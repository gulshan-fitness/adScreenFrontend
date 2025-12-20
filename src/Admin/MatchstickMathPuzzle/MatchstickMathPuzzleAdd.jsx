import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../Context_holder';
import matchstickPatterns from '../../MatchstickMathPuzzle/Patterns.json'; 

export default function MatchstickMathPuzzleAdd() {
  const { adminToken, notify, MatchistickCounts, MatchistickPuzzletotalcountFetch } = useContext(Context);
  
  const [game, setGame] = useState("");
  const [result, setResult] = useState("");
  const [hint, setHint] = useState("");
  const [moves, setMoves] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    MatchistickPuzzletotalcountFetch()
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Patterns = matchstickPatterns;

  const getInputSize = () => {
    if (windowSize.width < 640) return 'text-lg py-3 px-4';
    if (windowSize.width < 768) return 'text-xl py-4 px-5';
    return 'text-xl py-4 px-6';
  };

  const getButtonSize = () => {
    if (windowSize.width < 640) return 'py-3 px-6 text-base';
    if (windowSize.width < 768) return 'py-4 px-8 text-lg';
    return 'py-4 px-10 text-lg';
  };

  // Function to process equation and split into characters/digits
  const processEquation = (equation) => {
    const result = [];
    let i = 0;
    
    while (i < equation.length) {
      // Check for multi-digit numbers (10-29)
      if (i < equation.length - 1) {
        const twoDigit = equation.substring(i, i + 2);
        if (Patterns[twoDigit]) {
          result.push(twoDigit);
          i += 2;
          continue;
        }
      }
      
      // Single character
      result.push(equation[i]);
      i += 1;
    }
    
    return result;
  };

  // Function to get matchsticks data exactly as it is from JSON
  const getMatchsticksData = (char) => {
    return Patterns[char];
  };

  // Function to determine ID based on character and position
  const getCharacterId = (char, index, equationChars) => {
    if (char === '+' || char === '-') {
      return 'operator';
    } else if (char === '=') {
      return 'equals';
    } else {
      // For numbers, check if it's the result part (after equals)
      const equalsIndex = equationChars.indexOf('=');
      if (equalsIndex !== -1 && index > equalsIndex) {
        return 'result';
      } else {
        return 'number';
      }
    }
  };


  const SaveHandler = async () => {
   
    
    if ( 

  !game.trim() ||
  !result.trim() ||
  !hint.trim() ||
  moves === "" ||
  moves === null ||
  MatchistickCounts === null ||
  MatchistickCounts === undefined

) {

      notify('Please fill all fields', 0);

      return;
    }

    setIsLoading(true);

    try {
      // Process game input
      const gameChars = processEquation(game);
      const resultChars = processEquation(result);
      const tempGameData = [];
      const tempResultData = [];

      // Process game array
      gameChars.forEach((char, index) => {
        const matchsticksData = getMatchsticksData(char);
        
        if (!matchsticksData) {
          console.warn(`No pattern found for character: ${char}`);
          return;
        }

        const id = getCharacterId(char, index, gameChars);
        
        tempGameData.push({
          id: id,
          value: char,
          matchsticks: matchsticksData
        });
      });

      // Process result array
      resultChars.forEach((char, index) => {
        const matchsticksData = getMatchsticksData(char);
        
        if (!matchsticksData) {
          console.warn(`No pattern found for character: ${char}`);
          return;
        }

        const id = getCharacterId(char, index, resultChars);
        
        tempResultData.push({
          id: id,
          value: char,
          matchsticks: matchsticksData
        });
      });

      if (tempGameData.length === 0 || tempResultData.length === 0) {
        notify('Invalid input format or unsupported characters', 0);
        setIsLoading(false);
        return;
      }

      const data = {
        game: tempGameData,
        level: parseInt(MatchistickCounts + 1),
        move: parseInt(moves),
        hint: hint,
        result: tempResultData,
      };

      console.log('Sending data:', JSON.stringify(data, null, 2));

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_MATCHSTICKPUZZLE_URL}add`,
        data,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );

      notify(response.data.msg, response.data.status);
      if (response.data.status === 1) {
        setGame("");
        setResult("");
        setHint("");
        setMoves("");
        MatchistickPuzzletotalcountFetch();
      }
    } catch (error) {
      console.error('Error creating puzzle:', error);
      notify(error.response?.data?.msg || error.message, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const inputSize = getInputSize();
  const buttonSize = getButtonSize();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#111] via-[#0a0a0a] to-[#111] p-4 sm:p-6 md:p-8">
      {/* Gold Accent Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ffd700]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#ffd700]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-[#ffd700] to-[#ffed4e] p-0.5 rounded-2xl sm:rounded-3xl shadow-2xl shadow-[#ffd700]/20">
              <div className="bg-[#111] rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-4 sm:py-6 border border-[#ffd700]/10">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ffd700] to-[#ffed4e] bg-clip-text text-transparent mb-2 sm:mb-4">
                  Create Matchstick Puzzle
                </h1>
                <p className="text-[#ffd700]/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                  Design challenging mathematical puzzles with matchstick interactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-[#111]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-[#ffd700]/20 shadow-2xl shadow-[#ffd700]/10 p-6 sm:p-8 md:p-10 mb-8">
          {/* Puzzle Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Puzzle Input */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#ffd700]">
                  Puzzle Equation
                </h3>
                <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                  <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[#ffd700]/80 text-sm mb-2">
                  Enter the initial equation (e.g., "10+5=15" or "3+5=8")
                </label>
                <input
                  type="text"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  placeholder="Examples: 10+5=15, 3+5=8, 25-13=12"
                  className={`w-full bg-[#1a1a1a] border border-[#ffd700]/30 rounded-xl text-white placeholder-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-300 ${inputSize}`}
                />
                <p className="text-xs text-[#ffd700]/60">
                  Supports numbers 0-29, operators (+, -), and equals (=)
                </p>
              </div>
            </div>

            {/* Result Input */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#ffd700]">
                  Solution Equation
                </h3>
                <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                  <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[#ffd700]/80 text-sm mb-2">
                  Enter the solved equation (e.g., "9-5=4" or "18-13=5")
                </label>
                <input
                  type="text"
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="Examples: 9-5=4, 18-13=5, 20-15=5"
                  className={`w-full bg-[#1a1a1a] border border-[#ffd700]/30 rounded-xl text-white placeholder-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-300 ${inputSize}`}
                />
                <p className="text-xs text-[#ffd700]/60">
                  This should be the correct solution after moving matchsticks
                </p>
              </div>
            </div>
          </div>

          {/* Hint and Moves Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Hint Input */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#ffd700]">
                  Puzzle Hint
                </h3>
                <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                  <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[#ffd700]/80 text-sm mb-2">
                  Provide a helpful hint for solving the puzzle
                </label>
                <textarea
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Example: Try moving one matchstick from the first number to make a different number..."
                  rows="3"
                  className={`w-full bg-[#1a1a1a] border border-[#ffd700]/30 rounded-xl text-white placeholder-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-300 resize-none ${inputSize}`}
                />
                <p className="text-xs text-[#ffd700]/60">
                  Give players a clue without revealing the solution
                </p>
              </div>
            </div>

            {/* Moves Input */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-[#ffd700]">
                  Maximum Moves
                </h3>
                <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                  <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-[#ffd700]/80 text-sm mb-2">
                  Number of matchstick moves allowed
                </label>
                <input
                  type="number"
                  value={moves}
                  onChange={(e) => setMoves(e.target.value)}
                  placeholder="Example: 1"
                  min="1"
                  max="10"
                  className={`w-full bg-[#1a1a1a] border border-[#ffd700]/30 rounded-xl text-white placeholder-[#ffd700]/40 focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:border-transparent transition-all duration-300 ${inputSize}`}
                />
                <p className="text-xs text-[#ffd700]/60">
                  Typically 1-3 moves for challenging puzzles
                </p>
              </div>
            </div>
          </div>

          {/* Level Information */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/20 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-[#ffd700]">
                Level Information
              </h3>
              <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center border border-[#ffd700]/30">
                <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-[#ffd700]/60 text-sm mb-1">Current Level</p>
                <div className="bg-[#111] rounded-xl p-3 border border-[#ffd700]/20">
                  <p className="text-2xl font-bold text-[#ffd700]">{MatchistickCounts + 1}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[#ffd700]/60 text-sm mb-1">Total Puzzles</p>
                <div className="bg-[#111] rounded-xl p-3 border border-[#ffd700]/20">
                  <p className="text-2xl font-bold text-[#ffd700]">{MatchistickCounts}</p>
                </div>
              </div>
            </div>
          </div>

{/*          
          {(game || result) && (
            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffd700]/10 mb-8">
              <h3 className="text-lg font-semibold text-[#ffd700] mb-4">Data Structure Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {game && (
                  <div>
                    <p className="text-[#ffd700]/60 text-sm mb-2">Puzzle Structure</p>
                    <div className="bg-[#111] rounded-xl p-4 border border-[#ffd700]/20">
                      <pre className="text-xs text-[#ffd700]/80 overflow-auto">
                        {JSON.stringify(
                          processEquation(game).map((char, index) => ({
                            id: getCharacterId(char, index, processEquation(game)),
                            value: char,
                            matchsticks: getMatchsticksData(char)
                          })),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
                {result && (
                  <div>
                    <p className="text-[#ffd700]/60 text-sm mb-2">Solution Structure</p>
                    <div className="bg-[#111] rounded-xl p-4 border border-[#ffd700]/20">
                      <pre className="text-xs text-[#ffd700]/80 overflow-auto">
                        {JSON.stringify(
                          processEquation(result).map((char, index) => ({
                            id: getCharacterId(char, index, processEquation(result)),
                            value: char,
                            matchsticks: getMatchsticksData(char)
                          })),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={SaveHandler}
              disabled={isLoading}
              className={`
                bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:from-[#ffed4e] hover:to-[#ffd700] 
                text-[#111] font-bold rounded-xl shadow-2xl shadow-[#ffd700]/30 transform transition-all duration-300 
                hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                border border-[#ffd700]/50
                ${buttonSize}
              `}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-[#111] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Puzzle...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#111]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Matchstick Puzzle</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}