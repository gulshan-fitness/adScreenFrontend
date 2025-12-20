import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Context } from '../../Context_holder';
import { Link, Links } from 'react-router-dom';

// Matchstick Patterns - Seven Segment Display
const Patterns = {
  0: [
    { id: 'a', status: true }, { id: 'b', status: true }, { id: 'c', status: true },
    { id: 'd', status: false }, { id: 'e', status: true }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  1: [
    { id: 'a', status: false }, { id: 'b', status: false }, { id: 'c', status: true },
    { id: 'd', status: false }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: false },
  ],
  2: [
    { id: 'a', status: true }, { id: 'b', status: false }, { id: 'c', status: true },
    { id: 'd', status: true }, { id: 'e', status: true }, { id: 'f', status: false },
    { id: 'g', status: true },
  ],
  3: [
    { id: 'a', status: true }, { id: 'b', status: false }, { id: 'c', status: true },
    { id: 'd', status: true }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  4: [
    { id: 'a', status: false }, { id: 'b', status: true }, { id: 'c', status: true },
    { id: 'd', status: true }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: false },
  ],
  5: [
    { id: 'a', status: true }, { id: 'b', status: true }, { id: 'c', status: false },
    { id: 'd', status: true }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  6: [
    { id: 'a', status: true }, { id: 'b', status: true }, { id: 'c', status: false },
    { id: 'd', status: true }, { id: 'e', status: true }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  7: [
    { id: 'a', status: true }, { id: 'b', status: false }, { id: 'c', status: true },
    { id: 'd', status: false }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: false },
  ],
  8: [
    { id: 'a', status: true }, { id: 'b', status: true }, { id: 'c', status: true },
    { id: 'd', status: true }, { id: 'e', status: true }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  9: [
    { id: 'a', status: true }, { id: 'b', status: true }, { id: 'c', status: true },
    { id: 'd', status: true }, { id: 'e', status: false }, { id: 'f', status: true },
    { id: 'g', status: true },
  ],
  '+': [{ id: 'a', status: true }, { id: 'b', status: true }],
  '-': [{ id: 'a', status: true }, { id: 'b', status: false }],
  '=': [{ id: 'a', status: true }, { id: 'b', status: true }],
};

export default function   AllMatchstickPuzzles() {
  const { adminToken, notify,MatchistickPuzzleFetch,AllMatchistickPuzzles } = useContext(Context);
  
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });



  useEffect(() => {
   MatchistickPuzzleFetch()  
  }, []);


useEffect(
    ()=>{
        if(AllMatchistickPuzzles?.length!=0){
 setLoading(false)
        }
         

        setTimeout(() => {

          setLoading(false)

        }, 2000);




    },[AllMatchistickPuzzles]
)




  const deletePuzzle = async (puzzleId) => {
  
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_MATCHSTICKPUZZLE_URL}delete/${puzzleId}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }

      );
      
      notify(response.data.msg, response.data.status);

      if (response.data.status === 1){
        setDeleteLoading(puzzleId);
        MatchistickPuzzleFetch()
      }
    } catch (error) {

      notify('Failed to delete puzzle', 0);

      console.error('Error deleting puzzle:', error);

    } finally {
      setDeleteLoading(null);
    }
  };

  const getEquationString = (gameData) => {
    return gameData.map(item => item.value).join('');
  };


 

  const getButtonSize = () => {
    if (windowSize.width < 640) return 'py-2 px-3 text-xs';
    if (windowSize.width < 768) return 'py-2 px-4 text-sm';
    return 'py-2 px-4 text-sm';
  };

  const getCardPadding = () => {
    if (windowSize.width < 640) return 'p-4';
    if (windowSize.width < 768) return 'p-5';
    return 'p-6';
  };

  const getGridLayout = () => {
    if (windowSize.width < 640) return 'grid-cols-1 gap-4';
    if (windowSize.width < 1024) return 'grid-cols-2 gap-6';
    return 'grid-cols-3 gap-8';
  };

  const buttonSize = getButtonSize();
  const cardPadding = getCardPadding();
  const gridLayout = getGridLayout();

  if (loading) {

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#ffd700] text-lg">Loading Puzzles...</p>
        </div>
      </div>
    );
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111] p-4 sm:p-6 md:p-8">
      {/* Gold Accent Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd700]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] p-0.5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#ffd700]/20">
              <div className="bg-[#111] rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-6 border border-[#ffd700]/10">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ffd700] to-[#ffed4e] bg-clip-text text-transparent mb-2 sm:mb-4">
                  Matchstick Puzzles
                </h1>
                <p className="text-[#ffd700]/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                  Manage and edit your collection of mathematical puzzles
                </p>
                <div className="mt-4 flex items-center justify-center space-x-2 text-[#ffd700]/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm font-medium">{AllMatchistickPuzzles?.length} Puzzles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Puzzles Grid */}
        {AllMatchistickPuzzles?.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-[#111]/90 backdrop-blur-xl rounded-2xl border border-[#ffd700]/20 shadow-2xl shadow-[#ffd700]/10 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-[#ffd700]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ffd700]/20">
                <svg className="w-8 h-8 text-[#ffd700]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#ffd700] mb-2">No Puzzles Found</h3>
              <p className="text-[#ffd700]/60 text-sm mb-4">Create your first matchstick puzzle to get started</p>
              <Link to={"/adminprofile/matchstickpuzzle/add"} className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#111] font-semibold rounded-lg px-6 py-2 hover:shadow-lg hover:shadow-[#ffd700]/20 transition-all duration-300">
                Create Puzzle
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid ${gridLayout} mb-8`}>
            {AllMatchistickPuzzles?.map((puzzle) => (
              <div
                key={puzzle._id}
                className="bg-[#111]/90 backdrop-blur-xl rounded-2xl border border-[#ffd700]/20 shadow-2xl shadow-[#ffd700]/10 hover:shadow-[#ffd700]/30 hover:border-[#ffd700]/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={cardPadding}>
                  {/* Puzzle Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#ffd700] to-[#ffed4e] rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-[#111] font-bold text-sm">{puzzle.level}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#ffd700]">Level {puzzle.level}</h3>
                        <p className="text-[#ffd700]/60 text-xs">
                          {new Date(puzzle.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="bg-[#ffd700]/10 text-[#ffd700] text-xs font-medium px-2 py-1 rounded-full border border-[#ffd700]/20">
                        {puzzle.move} {puzzle.move === 1 ? 'move' : 'moves'}
                      </span>
                    </div>
                  </div>

                  {/* Equations */}
                  <div className="space-y-6 mb-4">
                    {/* Puzzle Equation */}
                    <div>
                      <p className="text-[#ffd700]/60 text-xs font-medium mb-3">PUZZLE</p>
                      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#ffd700]/10">
                        <p className="text-lg font-mono text-[#ffd700] text-center font-bold mb-4">
                          {
                          getEquationString(puzzle?.game)
                          }
                        </p>
                        {/* <div className="flex justify-center items-center space-x-4 flex-wrap">
                          {puzzle?.game?.map((item, idx) => (
                            <div key={idx} className="text-center">


                            </div>
                          ))}
                        </div> */}
                      </div>
                    </div>

                    {/* Solution Equation */}
                    <div>
                      <p className="text-[#ffd700]/60 text-xs font-medium mb-3">SOLUTION</p>
                      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#ffed4e]/20">
                        <p className="text-lg font-mono text-[#ffed4e] text-center font-bold mb-4">
                          {getEquationString(puzzle?.result)}
                        </p>
                       
                      </div>
                    </div>
                  </div>

                  {/* Hint */}
                  <div className="mb-4">
                    <p className="text-[#ffd700]/60 text-xs font-medium mb-2">HINT</p>
                    <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#ffd700]/5">
                      <p className="text-[#ffd700]/80 text-sm">{puzzle.hint}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link

                     to={`/adminprofile/matchstickpuzzle/edit/${puzzle?._id}`}

                      className={`flex-1 bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-[#111] font-semibold rounded-lg hover:shadow-lg hover:shadow-[#ffd700]/20 transition-all duration-300 flex items-center justify-center space-x-2 ${buttonSize}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </Link>
                    
                    <button
                      onClick={() => deletePuzzle(puzzle._id)}

                      disabled={deleteLoading === puzzle._id}

                      className={`flex-1 bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center space-x-2 ${buttonSize}`}
                    >
                      {deleteLoading === puzzle._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        <div className="bg-[#111]/90 backdrop-blur-xl rounded-2xl border border-[#ffd700]/20 shadow-2xl shadow-[#ffd700]/10 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#ffd700] mb-1">{AllMatchistickPuzzles?.length}</div>
              <div className="text-[#ffd700]/60 text-sm">Total Puzzles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffd700] mb-1">
                {AllMatchistickPuzzles?.reduce((max, puzzle) => Math.max(max, puzzle.level), 0)}
              </div>
              <div className="text-[#ffd700]/60 text-sm">Highest Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffd700] mb-1">
                {AllMatchistickPuzzles?.reduce((total, puzzle) => total + puzzle.move, 0)}
              </div>
              <div className="text-[#ffd700]/60 text-sm">Total Moves</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#ffd700] mb-1">
                {new Set(AllMatchistickPuzzles?.map(p => p.level)).size}
              </div>
              <div className="text-[#ffd700]/60 text-sm">Unique Levels</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}