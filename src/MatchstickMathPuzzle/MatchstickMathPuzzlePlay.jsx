import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Context } from "../Context_holder";
import axios from "axios";
import Patterns from "./Patterns.json";
let showMoves=0

const MatchStick = ({ match, onDragStart, onDrop }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`h-full w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px] relative rounded-sm transition-all duration-200 
        ${match?.status ? "cursor-grab hover:shadow-lg" : "cursor-pointer"} 
        ${hover ? "bg-gray-300" : "bg-gray-800"}`}
      draggable={match?.status}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        if (!match?.status) e.preventDefault();
      }}
      onDragEnter={() => {
        if (!match?.status) setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        setHover(false);
        onDrop(e);
      }}
    >
      {match?.status && (
        <div className="h-full w-full bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 rounded-sm shadow-inner relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-[10px] sm:h-[12px] md:h-[14px] lg:h-[16px] w-[8px] sm:w-[10px] md:w-[12px] lg:w-[14px] rounded-sm bg-gradient-to-b from-red-600 via-red-700 to-red-900 shadow-md border border-red-800" />
        </div>
      )}
    </div>
  );
};

const MatchStickHorizontal = ({ match, onDragStart, onDrop }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px] relative rounded-sm transition-all duration-200 
        ${match?.status ? "cursor-grab hover:shadow-lg" : "cursor-pointer"} 
        ${hover ? "bg-gray-300" : "bg-gray-800"}`}
      draggable={match?.status}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        if (!match?.status) e.preventDefault();
      }}
      onDragEnter={() => {
        if (!match?.status) setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        setHover(false);
        onDrop(e);
      }}
    >
      {match?.status && (
        <div className="w-full h-full bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 rounded-sm relative z-10">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[8px] sm:h-[10px] md:h-[12px] lg:h-[14px] w-[10px] sm:w-[12px] md:w-[14px] lg:w-[16px] rounded-sm bg-gradient-to-r from-red-600 via-red-700 to-red-900 shadow-md border border-red-800 " />
        </div>
      )}
    </div>
  );
};

// Updated useDragDrop hook to handle the nested matchsticks structure
const useDragDrop = (matchsticks, setEquation, index, VerifyHandler, ShowMoves, UseMoves) => {
  const handleDragStart = (segmentIndex, matchIndex) => (e) => {
    const match = matchsticks[segmentIndex]?.[matchIndex];
    
    if (match?.status) {
      e.dataTransfer.setData("match", JSON.stringify({ 
        fromIndex: index, 
        segmentIndex, 
        matchIndex
      }));
    } else {
      e.preventDefault();
    }
  };

  const handleDrop = (segmentIndex, matchIndex) => (e) => {
    e.preventDefault();
    
    const targetMatch = matchsticks[segmentIndex]?.[matchIndex];
    
    if (!targetMatch?.status) {
      const data = e.dataTransfer.getData("match");
      if (!data) return;
      
      const { fromIndex, segmentIndex: fromSegmentIndex, matchIndex: fromMatchIndex } = JSON.parse(data);

      setEquation((prev) => {
        const newEquation = [...prev];

        // Check if source matchstick exists and is active
        const sourceMatch = newEquation[fromIndex]?.matchsticks[fromSegmentIndex]?.[fromMatchIndex];

        if (sourceMatch?.status) {
          // Remove from source
          sourceMatch.status = false;
          
          // Add to target
          newEquation[index].matchsticks[segmentIndex][matchIndex].status = true;

          // Update values for both source and target using Patterns
          const updateComponentValue = (component) => {
            if (!component.matchsticks || component.matchsticks.length === 0) return component.value;
            
            const isOperatorOrEquals = ['+', '-', '='].includes(component.value);
            
            if (isOperatorOrEquals) {
              // For operators and equals - flatten the nested arrays
              const allSticks = [];
              component.matchsticks.forEach((segment, segIdx) => {
                if (Array.isArray(segment)) {
                  segment.forEach((match, matchIdx) => {
                    allSticks.push({
                      id: match.id,
                      status: match.status
                    });
                  });
                }
              });

              // Find matching pattern in Patterns.json for operators/equals
              for (const [key, value] of Object.entries(Patterns)) {
                if (['+', '-', '='].includes(key)) {
                  const pattern = value;
                  if (Array.isArray(pattern) && pattern.length === allSticks.length) {
                    const isMatch = pattern.every((patternMatch, i) => 
                      patternMatch.id === allSticks[i]?.id && patternMatch.status === allSticks[i]?.status
                    );
                    
                    if (isMatch) {
                      return key;
                    }
                  }
                }
              }
            } else {
              // For numbers - handle nested segments
              const allSegments = [];
              component.matchsticks.forEach((segment, segIdx) => {
                if (Array.isArray(segment)) {
                  const segmentSticks = [];
                  segment.forEach((match, matchIdx) => {
                    segmentSticks.push({
                      id: match.id,
                      status: match.status
                    });
                  });
                  allSegments.push(segmentSticks);
                }
              });

              // Find matching pattern in Patterns.json for numbers
              for (const [key, pattern] of Object.entries(Patterns)) {
                if (!['+', '-', '='].includes(key)) {
                  if (Array.isArray(pattern) && pattern.length === allSegments.length) {
                    let allSegmentsMatch = true;
                    
                    pattern.forEach((patternSegment, segIdx) => {
                      if (Array.isArray(patternSegment)) {
                        patternSegment.forEach((patternMatch, matchIdx) => {
                          if (allSegments[segIdx]?.[matchIdx]?.status !== patternMatch.status) {
                            allSegmentsMatch = false;
                          }
                        });
                      }
                    });
                    
                    if (allSegmentsMatch) {
                      return key;
                    }
                  }
                }
              }
            }
            
            return component.value; // Return current value if no pattern matches
          };

          // Update both source and target values
          newEquation[fromIndex].value = updateComponentValue(newEquation[fromIndex]);
          newEquation[index].value = updateComponentValue(newEquation[index]);
        }

        return newEquation;
      });

    showMoves=showMoves+1
if (showMoves >= UseMoves) {
  // ✅ Verify only after using all moves
  VerifyHandler();
}
    }
  };

  
  
  return { handleDragStart, handleDrop };
};

const Num = ({ matchsticks, setEquation, numIndex, VerifyHandler, ShowMoves, UseMoves }) => {
  
  console.log(matchsticks);
  
  const { handleDragStart, handleDrop } = useDragDrop(
    matchsticks,
    setEquation,
    numIndex,
    VerifyHandler,
    ShowMoves,
    UseMoves
  );


  

  // Helper to render one digit (7-segment display)
  const renderDigit = (digitSticks, digitIndex = 0) => (
    <div
      key={digitIndex}
      className="relative h-[80px] w-[40px] sm:h-[100px] sm:w-[50px] md:h-[120px] md:w-[60px] lg:h-[140px] lg:w-[70px] xl:h-[160px] xl:w-[80px] mx-1 sm:mx-2"
    >
      {/* a */}
      <div className="absolute top-0 left-0 w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px]">
        <MatchStickHorizontal
          match={digitSticks[0]}
          onDragStart={handleDragStart(digitIndex, 0)}
          onDrop={handleDrop(digitIndex, 0)}
        />
      </div>

      {/* b */}
      <div className="absolute top-[6px] sm:top-[8px] md:top-[10px] lg:top-[12px] left-0 h-[32px] sm:h-[40px] md:h-[48px] lg:h-[56px] xl:h-[64px] w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px]">
        <MatchStick
          match={digitSticks[1]}
          onDragStart={handleDragStart(digitIndex, 1)}
          onDrop={handleDrop(digitIndex, 1)}
        />
      </div>

      {/* c */}
      <div className="absolute top-[6px] sm:top-[8px] md:top-[10px] lg:top-[12px] right-0 h-[32px] sm:h-[40px] md:h-[48px] lg:h-[56px] xl:h-[64px] w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px]">
        <MatchStick
          match={digitSticks[2]}
          onDragStart={handleDragStart(digitIndex, 2)}
          onDrop={handleDrop(digitIndex, 2)}
        />
      </div>

      {/* d */}
      <div className="absolute top-[38px] sm:top-[48px] md:top-[58px] lg:top-[68px] xl:top-[76px] left-0 w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px]">
        <MatchStickHorizontal
          match={digitSticks[3]}
          onDragStart={handleDragStart(digitIndex, 3)}
          onDrop={handleDrop(digitIndex, 3)}
        />
      </div>

      {/* e */}
      <div className="absolute bottom-[6px] sm:bottom-[8px] md:bottom-[10px] lg:bottom-[12px] left-0 h-[32px] sm:h-[40px] md:h-[48px] lg:h-[56px] xl:h-[64px] w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px]">
        <MatchStick
          match={digitSticks[4]}
          onDragStart={handleDragStart(digitIndex, 4)}
          onDrop={handleDrop(digitIndex, 4)}
        />
      </div>

      {/* f */}
      <div className="absolute bottom-[6px] sm:bottom-[8px] md:bottom-[10px] lg:bottom-[12px] right-0 h-[32px] sm:h-[40px] md:h-[48px] lg:h-[56px] xl:h-[64px] w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px]">
        <MatchStick
          match={digitSticks[5]}
          onDragStart={handleDragStart(digitIndex, 5)}
          onDrop={handleDrop(digitIndex, 5)}
        />
      </div>

      {/* g */}
      <div className="absolute bottom-0 left-0 w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px]">
        <MatchStickHorizontal
          match={digitSticks[6]}
          onDragStart={handleDragStart(digitIndex, 6)}
          onDrop={handleDrop(digitIndex, 6)}
        />
      </div>
    </div>
  );

  // Determine how many digits (1 or 2)
if (!Array.isArray(matchsticks)) return null;

// ✅ Handle one or multiple digits correctly
if (Array.isArray(matchsticks[0]) && typeof matchsticks[0][0] === "object") {
  // Multi-digit (e.g., 2-digit number)
  return (
    <div className="flex items-center gap-2">
      {matchsticks.map((digit, digitIndex) => renderDigit(digit, digitIndex))}
    </div>
  );
} else {
  // Single-digit number
  return <div className="flex">{renderDigit(matchsticks, 0)}</div>;
}




};

// Fixed Operator component
const Operator = ({ matchsticks, setEquation, operatorIndex, VerifyHandler, ShowMoves, UseMoves }) => {
  const { handleDragStart, handleDrop } = useDragDrop(matchsticks, setEquation, operatorIndex, VerifyHandler, ShowMoves, UseMoves);

  return (
    <div className="relative h-[80px] w-[40px] sm:h-[100px] sm:w-[50px] md:h-[120px] md:w-[60px] lg:h-[140px] lg:w-[70px] xl:h-[160px] xl:w-[80px] mx-1 sm:mx-2 flex items-center justify-center">
      {/* Horizontal Bar */}
      <div className="absolute top-1/2 left-0 w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px] -translate-y-1/2 z-50">
        <MatchStickHorizontal 
          match={matchsticks[0][0]} 
          onDragStart={handleDragStart(0, 0)} 
          onDrop={handleDrop(0, 0)} 
        />
      </div>
      {/* Vertical Bar */}
      <div className="absolute left-1/2 top-1/2 h-[62%] w-[6px] sm:w-[8px] md:w-[10px] lg:w-[12px] -translate-x-1/2 -translate-y-1/2">
        <MatchStick
          match={matchsticks[1][0]}
          onDragStart={handleDragStart(1, 0)}
          onDrop={handleDrop(1, 0)}
        />
      </div>
    </div>
  );
};

// Fixed Equals component
const Equals = ({ matchsticks, setEquation, equalsIndex, VerifyHandler, ShowMoves, UseMoves }) => {
  const { handleDragStart, handleDrop } = useDragDrop(matchsticks, setEquation, equalsIndex, VerifyHandler, ShowMoves, UseMoves);

  return (
    <div className="relative h-[80px] w-[40px] sm:h-[100px] sm:w-[50px] md:h-[120px] md:w-[60px] lg:h-[140px] lg:w-[70px] xl:h-[160px] xl:w-[80px] mx-1 sm:mx-2 flex flex-col items-center justify-center gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[14px]">
      {/* Top Horizontal */}
      <div className="w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px]">
        <MatchStickHorizontal 
          match={matchsticks[0][0]} 
          onDragStart={handleDragStart(0, 0)} 
          onDrop={handleDrop(0, 0)} 
        />
      </div>
      {/* Bottom Horizontal */}
      <div className="w-full h-[6px] sm:h-[8px] md:h-[10px] lg:h-[12px]">
        <MatchStickHorizontal 
          match={matchsticks[1][0]} 
          onDragStart={handleDragStart(1, 0)} 
          onDrop={handleDrop(1, 0)} 
        />
      </div>
    </div>
  );
};

const EquationComponent = ({ item, index, setEquation, VerifyHandler, ShowMoves, UseMoves }) => {
  switch (item.id) {
    case "number":
      return <Num matchsticks={item.matchsticks} setEquation={setEquation} numIndex={index} VerifyHandler={VerifyHandler} ShowMoves={ShowMoves} UseMoves={UseMoves} />;
    case "operator":
      return <Operator matchsticks={item.matchsticks} setEquation={setEquation} operatorIndex={index} VerifyHandler={VerifyHandler} ShowMoves={ShowMoves} UseMoves={UseMoves} />;
    case "equals":
      return <Equals matchsticks={item.matchsticks} setEquation={setEquation} equalsIndex={index} VerifyHandler={VerifyHandler} ShowMoves={ShowMoves} UseMoves={UseMoves} />;
    case "result":
      return <Num matchsticks={item.matchsticks} setEquation={setEquation} numIndex={index} VerifyHandler={VerifyHandler} ShowMoves={ShowMoves} UseMoves={UseMoves} />;
    default:
      return null;
  }
};

// Main Component remains the same
export default function MatchstickMathPuzzlePlay() {
  const { MatchistickPuzzleFetch, MatchistickPuzzles, AllMatchistickPuzzles, usertoken, notify, user } = useContext(Context);
  const [equation, setEquation] = useState([]);
  const [useMoves, setUseMoves] = useState(0);

  const [congrats, setCongrats] = useState(false);
  const [failedPopup, setFailedPopup] = useState(false);
  const { id } = useParams();

  const Nextindex = AllMatchistickPuzzles?.findIndex(d => d?._id == id) + 1;
  const Nextindex_id = AllMatchistickPuzzles[AllMatchistickPuzzles?.findIndex(d => d?._id == id) + 1]?._id;

  useEffect(() => {
    MatchistickPuzzleFetch(id);
    MatchistickPuzzleFetch();
  }, [id]);



  useEffect(() => {
    if (MatchistickPuzzles) {
      setEquation(MatchistickPuzzles?.game);
      setUseMoves(MatchistickPuzzles?.move);
    }
  }, [MatchistickPuzzles]);

  const MatchstickMathPuzzleScoreSubmit = (ans) => {
    if (!user || !id) return;

    const score = {
      user_id: user?._id,
      MatchstickMathPuzzle_id: id,
      score: ans,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_MATCHISTICKSCORESCORE_URL}add`,
        score,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then(success => {
        notify(success.data.msg, success.data.status);
      })
      .catch(error => {});
  };

  const VerifyHandler = () => {
    if (equation?.length === 0 || !id || !usertoken) return;
    

    const data = { submitedAnswer: equation };
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_MATCHSTICKPUZZLE_URL}resultVerify/${id}`,
        data,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then((success) => {
        notify(success.data.msg, success.data.status);


        showMoves=0;

        if (success.data.status === 1) {
          setCongrats(true);
          MatchstickMathPuzzleScoreSubmit(1);
        } else {
          setFailedPopup(true);
          MatchstickMathPuzzleScoreSubmit(0);
        }
      })
      .catch((error) => {
        notify(error.message, 0);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center text-white text-sm sm:text-base md:text-lg font-semibold mb-4">
        <p>Level {MatchistickPuzzles?.level}</p>
        <p>Moves: {showMoves}/{MatchistickPuzzles?.move}</p>
        <p>Puzzle {MatchistickPuzzles?.level}</p>
      </div>

      {/* Instructions */}
      <div className="w-full max-w-4xl text-center text-white text-sm sm:text-base mb-4">
        <p>Drag and drop matchsticks to correct the equation. You have {MatchistickPuzzles?.move} moves.</p>
      </div>

      {/* Equation Display */}
      <div className="w-full max-w-4xl flex justify-center">
        {equation?.length !== 0 ? (
          <div className="bg-gray-900 flex flex-wrap justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-lg shadow-xl border border-gray-700">
            {equation?.map((item, index) => (
              <div key={index} className="flex-shrink-0">
                <EquationComponent
                  item={item}
                  index={index}
                  setEquation={setEquation}
                  VerifyHandler={VerifyHandler}
                  ShowMoves={showMoves}
                  UseMoves={useMoves}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white text-xl font-bold animate-pulse">Loading...</div>
        )}
      </div>

      <div className="flex items-center justify-center mt-3">
        <Link to={"/matchstickpuzzleLevels"} className="px-4 py-2 bg-black border border-cyan-400 rounded-md text-cyan-300 font-semibold text-sm transition-all duration-300 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_3px_rgba(34,211,238,0.4)] relative overflow-hidden group">
          <span className="relative z-10">Levels</span>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-md blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
        </Link>
      </div>

      {/* Congrats Popup */}
      <div className={`${congrats ? "block" : "hidden"} fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-lg shadow-2xl p-6 sm:p-8 flex flex-col gap-4 items-center animate-fade-in z-50`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600">Congratulations!</h2>
        <p className="text-sm sm:text-base">You solved the puzzle!</p>
        <div className="flex gap-4">
          <Link to={"/matchstickpuzzleLevels"} onClick={() => setCongrats(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Levels
          </Link>
          {Nextindex < AllMatchistickPuzzles?.length && (
            <Link to={`/matchstickpuzzle/${Nextindex_id}`} onClick={() => { setCongrats(false); showMoves=0; }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Next
            </Link>
          )}
        </div>
      </div>

      {/* Failed Popup */}
      <div className={`${failedPopup ? "block" : "hidden"} fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black rounded-lg shadow-2xl p-6 sm:p-8 flex flex-col gap-4 items-center animate-fade-in z-50`}>
        <h2 className="text-2xl sm:text-3xl font-bold text-red-600">Try Again!</h2>
        <p className="text-sm sm:text-base">The equation is incorrect. You have {useMoves - showMoves} moves left.</p>
        <div className="flex gap-4">
          <Link to={"/matchstickpuzzleLevels"} onClick={() => setCongrats(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Levels
          </Link>
          <button onClick={() => { setFailedPopup(false); showMoves=0; MatchistickPuzzleFetch(id); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}