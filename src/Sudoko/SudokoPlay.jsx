import React, { useState, useEffect, useContext, useRef } from 'react';
import { Context } from '../Context_holder';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function SudokoPlay() {
  const { SudokoFetch, Sudoko, usertoken, user, notify } = useContext(Context);
  const { id } = useParams();

  const size = Sudoko?.size || 0;
  const [userInput, setUserInput] = useState([]);
  const [score, setScore] = useState(0);
  const inputRefs = useRef([]);

  const [PlayButtonShow, setPlayButtonShow] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);

  // Track error cells by coordinates as "r-c" strings
  const [errorCells, setErrorCells] = useState(new Set());

  // New state to hold deferred notification messages
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      notify(errorMessage);
      setErrorMessage(null);
    }
  }, [errorMessage, notify]);

  useEffect(() => {
    if (!id || !user?._id) return;
    SudokoFetch(id, user._id);
  }, [id, user]);

  useEffect(() => {
    if (size > 0) {
      inputRefs.current = Array(size)
        .fill(null)
        .map(() => Array(size).fill(null));
    }
  }, [size]);

  useEffect(() => {
    if (Sudoko?.puzzle) {
      setUserInput(
        Sudoko?.userScore?.userGrid ??
          Sudoko?.puzzle?.map(row => row.map(cell => (cell === 0 ? '' : String(cell))))
      );

      setTimeElapsed(Sudoko?.userScore?.timeTaken ?? 0);
      setScore(Sudoko?.userScore?.score ?? 0);
      setErrorCells(new Set());
    }
  }, [Sudoko]);

  useEffect(() => {
    if (!Sudoko?.solution || !Sudoko?.puzzle) return;

    let correctCount = 0;

    userInput.forEach((row, r) => {
      row.forEach((val, c) => {
        const isUserFilled = Sudoko.puzzle[r][c] === 0;
        if (isUserFilled && parseInt(val, 10) === Sudoko.solution[r][c]) {
          correctCount++;
        }
      });
    });

    setScore(correctCount);
  }, [userInput, Sudoko?.solution, Sudoko?.puzzle]);

  const checkDuplicateInRowOrCol = (r, c, value) => {
    if (!value) return false;
    const valNum = Number(value);
    if (isNaN(valNum) || valNum === 0) return false;

    // Check row
    for (let col = 0; col < size; col++) {
      if (col !== c) {
        if (Number(userInput[r][col]) === valNum) return true;
      }
    }

    // Check column
    for (let row = 0; row < size; row++) {
      if (row !== r) {
        if (Number(userInput[row][c]) === valNum) return true;
      }
    }

    return false;
  };

  const handleChange = (r, c, value) => {
    if (!/^\d*$/.test(value)) return; // only digits allowed

    if (PlayButtonShow) {
      setErrorMessage('Click on the Play button first');
      return;
    }

    setUserInput(prev => {
      const updated = prev.map(row => [...row]);
      updated[r][c] = value;
      return updated;
    });

    // Check duplicates and update errorCells
    setErrorCells(prev => {
      const newSet = new Set(prev);
      if (checkDuplicateInRowOrCol(r, c, value)) {
        newSet.add(`${r}-${c}`);
        setErrorMessage('Duplicate value in same row or column!');
      } else {
        newSet.delete(`${r}-${c}`);
      }
      return newSet;
    });
  };

  const handleKeyDown = (r, c, e) => {
    const key = e.key;
    let newR = r,
      newC = c;

    if (key === 'ArrowUp') newR = r > 0 ? r - 1 : r;
    else if (key === 'ArrowDown') newR = r < size - 1 ? r + 1 : r;
    else if (key === 'ArrowLeft') newC = c > 0 ? c - 1 : c;
    else if (key === 'ArrowRight') newC = c < size - 1 ? c + 1 : c;

    if ((newR !== r || newC !== c) && inputRefs.current[newR]?.[newC]) {
      inputRefs.current[newR][newC].focus();
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    if (!user || !id || !usertoken) return;

    const puzzleScore = {
      user_id: user?._id,
      Sudoko_id: id,
      userGrid: userInput,
      timeTaken: timeElapsed,
      score: score,
    };
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SUDOKOSCORE_URL}add`,
        puzzleScore,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then(success => {
        notify(success.data.msg, success.data.status);

        if (success.data.status === 1) {
          if (!id || !user?._id) return;
          SudokoFetch(id, user._id);

          setPlayButtonShow(true);
        }
      })
      .catch(error => {});
  };

  const handleRestart = score_id => {
    if (!score_id) return;

    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SUDOKOSCORE_URL}delete/${score_id}`,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then(success => {
        notify('Puzzle Restarted', success.data.status);

        if (success.data.status === 1) {
          if (!id || !user?._id) return;

          SudokoFetch(id, user?._id);

          setPlayButtonShow(true);
        }
      })
      .catch(error => {});
  };

  const PlayHandle = () => {
    if (id) {
      setPlayButtonShow(false);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0c0c0c] text-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#FFD700] drop-shadow">
        Playing Sudoku: {size} x {size}
      </h2>

      {PlayButtonShow && (
        <button
          onClick={PlayHandle}
          className="px-6 py-1 mx-auto  block mb-3 bg-[green] text-white font-bold rounded-lg hover:brightness-110 transition"
        >
          Play
        </button>
      )}

      <p className="text-sm text-gray-300">Time: {formatTime(timeElapsed)}</p>

      {userInput.length > 0 ? (
        <div className="w-full max-w-[90vw] sm:w-[400px] mx-auto p-2 sm:p-4 bg-black rounded-2xl shadow-xl">
          <div
            className="grid aspect-square gap-[1px]"
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {userInput?.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const isPrefilled = Sudoko.puzzle[rIdx][cIdx] !== 0;
                const blockSize = Math.sqrt(size);
                const thickTop = rIdx % blockSize === 0 ? 'border-t-4' : 'border-t';
                const thickLeft = cIdx % blockSize === 0 ? 'border-l-4' : 'border-l';
                const thickRight = (cIdx + 1) % blockSize === 0 ? 'border-r-4' : 'border-r';
                const thickBottom = (rIdx + 1) % blockSize === 0 ? 'border-b-4' : 'border-b';

                const cellHasError = errorCells.has(`${rIdx}-${cIdx}`);

                return (
                  <input
                    key={`${rIdx}-${cIdx}`}
                    ref={el => (inputRefs.current[rIdx][cIdx] = el)}
                    value={cell || ''}
                    onChange={e => handleChange(rIdx, cIdx, e.target.value)}
                    onKeyDown={e => handleKeyDown(rIdx, cIdx, e)}
                    disabled={isPrefilled}
                    maxLength={1}
                    className={`
                      w-full h-full aspect-square text-center text-[4.2vw] sm:text-[1.7vw] font-semibold
                      ${isPrefilled ? 'bg-[#111827] text-[#00FFFF]' : 'bg-[#58667a]'}
                      ${cellHasError ? 'border-red-500 border-4 text-red-500' : 'text-[#FFFFFFDD] border-gray-600'}
                      ${thickTop} ${thickLeft} ${thickRight} ${thickBottom}
                      focus:outline-none focus:bg-[#ffb342]
                      transition-all duration-150
                    `}
                  />
                );
              })
            )}
          </div>
        </div>
      ) : (
        <p className="text-center mt-10 text-gray-400">Loading puzzle...</p>
      )}

      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-gray-300">
          Score: {score} / {Sudoko?.puzzle?.flat().filter(d => d === 0)?.length}
        </p>

        <div className="flex justify-center gap-4 mt-2 flex-wrap">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#FFD700]   text-black font-bold rounded-lg hover:brightness-110 transition"
          >
            Submit Puzzle
          </button>
          {Sudoko?.userScore && (
            <button
              onClick={() => handleRestart(Sudoko?.userScore?._id)}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg hover:brightness-110 transition"
            >
              Beginning Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
