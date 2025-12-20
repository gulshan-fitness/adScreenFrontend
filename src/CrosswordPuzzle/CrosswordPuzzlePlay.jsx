import { useParams } from 'react-router-dom';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { Context } from '../Context_holder';
import axios from 'axios';

export default function CrosswordPuzzlePlay() {
  const {
    CrosswordPuzzle,
    CrosswordPuzzleFetch,
    usertoken,
    notify,
    user,
    userGrid,
    setUserGrid,
    CrosswordPuzzleScore_id,
  } = useContext(Context);

  const { id } = useParams();

  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(null);
  const [selectedClue, setSelectedClue] = useState(null);

  // Refs for inputs
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!id || !user) return;
    CrosswordPuzzleFetch(id, user?._id);
  }, [id, user]);

  useEffect(() => {
    if (CrosswordPuzzle?.layout) {
      const initialGrid = CrosswordPuzzle.layout.map((row) =>
        row.map((active) => (active ? '' : null))
      );

      if (!userGrid || userGrid.length === 0) setUserGrid(initialGrid);

      // Reset selected clue & showCorrect on new puzzle load
      setSelectedClue(null);
      setShowCorrect(false);

      // Initialize refs array to match grid size
      inputRefs.current = CrosswordPuzzle.layout.map((row) =>
        row.map(() => React.createRef())
      );
    }
  }, [CrosswordPuzzle]);

  useEffect(() => {
    if (CrosswordPuzzle) {
      CrosswordPuzzle.clues.across.forEach((c) => (c.direction = 'across'));
      CrosswordPuzzle.clues.down.forEach((c) => (c.direction = 'down'));
    }
  }, [CrosswordPuzzle]);

  const focusCell = (row, col) => {
    const ref = inputRefs.current?.[row]?.[col];
    if (ref && ref.current) {
      ref.current.focus();
    }
  };

  const handleChange = (row, col, value) => {
    if (/^[A-Za-z0-9]?$/.test(value)) {
      const updated = userGrid?.map((r) => [...r]);
      updated[row][col] = value.toUpperCase();
      setUserGrid(updated);

      if (value.length === 1) {
        let nextRow = row;
        let nextCol = col;
        const maxRow = CrosswordPuzzle.layout.length - 1;
        const maxCol = CrosswordPuzzle.layout[0].length - 1;
        const direction = selectedClue?.direction || 'across';

        if (direction === 'across') {
          do {
            nextCol = nextCol < maxCol ? nextCol + 1 : 0;
            if (nextCol === 0) {
              nextRow = nextRow < maxRow ? nextRow + 1 : 0;
            }
          } while (nextRow <= maxRow && !CrosswordPuzzle.layout[nextRow][nextCol]);
        } else if (direction === 'down') {
          do {
            nextRow = nextRow < maxRow ? nextRow + 1 : 0;
          } while (nextRow <= maxRow && !CrosswordPuzzle.layout[nextRow][nextCol]);
        }

        if (nextRow <= maxRow) {
          focusCell(nextRow, nextCol);
        }
      }
    }
  };

  const handleKeyDown = (e, row, col) => {
    if (!CrosswordPuzzle?.layout) return;
    
    const maxRow = CrosswordPuzzle.layout.length - 1;
    const maxCol = CrosswordPuzzle.layout[0].length - 1;

    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        do {
          newRow = newRow > 0 ? newRow - 1 : maxRow;
        } while (newRow >= 0 && !CrosswordPuzzle.layout[newRow][newCol]);
        e.preventDefault();
        focusCell(newRow, newCol);
        break;

      case 'ArrowDown':
        do {
          newRow = newRow < maxRow ? newRow + 1 : 0;
        } while (newRow <= maxRow && !CrosswordPuzzle.layout[newRow][newCol]);
        e.preventDefault();
        focusCell(newRow, newCol);
        break;

      case 'ArrowLeft':
        do {
          newCol = newCol > 0 ? newCol - 1 : maxCol;
        } while (newCol >= 0 && !CrosswordPuzzle.layout[newRow][newCol]);
        e.preventDefault();
        focusCell(newRow, newCol);
        break;

      case 'ArrowRight':
        do {
          newCol = newCol < maxCol ? newCol + 1 : 0;
        } while (newCol <= maxCol && !CrosswordPuzzle.layout[newRow][newCol]);
        e.preventDefault();
        focusCell(newRow, newCol);
        break;

      case 'Enter':
      case 'Tab':
        e.preventDefault();
        do {
          newCol = newCol < maxCol ? newCol + 1 : 0;
          if (newCol === 0) {
            newRow = newRow < maxRow ? newRow + 1 : 0;
          }
        } while (newRow <= maxRow && newCol <= maxCol && !CrosswordPuzzle.layout[newRow][newCol]);
        focusCell(newRow, newCol);
        break;

      default:
        break;
    }
  };

  const checkAnswers = () => {
    if (!CrosswordPuzzle || !userGrid) return;
    
    let total = 0;

    const checkClue = (clue, direction) => {
      const { row, col, answer } = clue;
      let isCorrect = true;

      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'across' ? row : row + i;
        const c = direction === 'across' ? col + i : col;
        
        // Check if coordinates are valid
        if (r >= userGrid.length || c >= userGrid[0].length) {
          isCorrect = false;
          break;
        }
        
        const userChar = userGrid[r][c] || '';

        if (userChar.toUpperCase() !== answer[i].toUpperCase()) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect) {
        total++;
      }
    };

    CrosswordPuzzle.clues.across.forEach((clue) => checkClue(clue, 'across'));
    CrosswordPuzzle.clues.down.forEach((clue) => checkClue(clue, 'down'));

    setScore(total);
    setShowCorrect(true);

    if (!usertoken || !user || !userGrid || !id) return;

    const puzzleScore = {
      crosswordPuzzle_id: id,
      user_id: user._id,
      currentScore: total,
      answersGrid: userGrid,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_CROSSWORDPUZZLESCORE_URL
        }add`,
        puzzleScore,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then((success) => {
        notify(success.data.msg, success.data.status);
        if (success.data.status === 1) {
          CrosswordPuzzleFetch(id, user._id);
        }
      })
      .catch(() => {});
  };

  const focusClue = (clue) => {
    const { row, col, direction, number } = clue;
    setSelectedClue({ row, col, direction, number });
    focusCell(row, col);
  };

  const getCellColor = (row, col) => {
    if (!CrosswordPuzzle || !userGrid) return 'bg-white';
    
    if (selectedClue) {
      const { row: clueRow, col: clueCol, direction, number } = selectedClue;
      const clueList = direction === 'across' ? CrosswordPuzzle.clues.across : CrosswordPuzzle.clues.down;
      const clue = clueList.find((c) => c.number === number);

      if (clue) {
        for (let i = 0; i < clue.answer.length; i++) {
          const r = clueRow + (direction === 'down' ? i : 0);
          const c = clueCol + (direction === 'across' ? i : 0);
          if (r === row && c === col) {
            return 'bg-yellow-200';
          }
        }
      }
    }

    if (!showCorrect) return 'bg-white';

    for (const clue of [...CrosswordPuzzle.clues.across, ...CrosswordPuzzle.clues.down]) {
      const { answer, row: clueRow, col: clueCol, direction } = clue;

      for (let i = 0; i < answer.length; i++) {
        const r = clueRow + (direction === 'down' ? i : 0);
        const c = clueCol + (direction === 'across' ? i : 0);

        if (r === row && c === col) {
          // Check if coordinates are valid
          if (r >= userGrid.length || c >= userGrid[0].length) {
            return 'bg-white';
          }
          
          const userChar = userGrid[r][c] || '';
          const correctChar = answer[i].toUpperCase();
          return userChar.toUpperCase() === correctChar ? 'bg-green-200' : 'bg-red-200';
        }
      }
    }
    return 'bg-white';
  };

  const restartPuzzleHandler = () => {
    if (!CrosswordPuzzleScore_id || !usertoken || !id || !user) return;

    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_CROSSWORDPUZZLESCORE_URL
        }delete/${CrosswordPuzzleScore_id}`,
        {
          headers: {
            Authorization: usertoken,
          },
        }
      )
      .then((success) => {
        notify("Puzzle Restarted", success.data.status);
        if (success.data.status === 1) {
          CrosswordPuzzleFetch(id, user._id);
          setUserGrid([]);
          setSelectedClue(null);
          setShowCorrect(false);
          setScore(null);
        }
      })
      .catch(() => {});
  };

  if (!CrosswordPuzzle) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 py-10 px-4 bg-black text-[#D4AF37] min-h-screen font-sans">
      <h2 className='mx-auto text-lg uppercase font-bold '>{CrosswordPuzzle?.title}</h2>

      <div className="flex flex-wrap gap-6 md:gap-14 justify-center">
        {CrosswordPuzzle.clues.across && CrosswordPuzzle.clues.down && (
          <>
            <div className="w-full md:w-2/5">
              <h2 className="text-2xl font-bold mb-4 border-b border-[#D4AF37] pb-2">Across</h2>
              <div className="max-h-[160px] p-3 border border-[#D4AF37] bg-[#0a0a0a] shadow-inner shadow-[#D4AF37]/30 overflow-y-auto rounded-md">
                {CrosswordPuzzle.clues.across.map((clue) => (
                  <p
                    key={'across' + clue.number}
                    onClick={() => focusClue(clue)}
                    className={`cursor-pointer mb-2 px-2 py-1 rounded-md transition-all duration-200 ${
                      selectedClue?.number === clue.number && selectedClue.direction === 'across'
                        ? 'bg-[#D4AF37] text-black font-semibold'
                        : 'hover:bg-[#D4AF37]/20'
                    }`}
                  >
                    {clue.number}. {clue.clue}
                  </p>
                ))}
              </div>
            </div>

            <div className="w-full md:w-2/5">
              <h2 className="text-2xl font-bold mb-4 border-b border-[#D4AF37] pb-2">Down</h2>
              <div className="max-h-[160px] p-3 border border-[#D4AF37] bg-[#0a0a0a] shadow-inner shadow-[#D4AF37]/30 overflow-y-auto rounded-md">
                {CrosswordPuzzle.clues.down.map((clue) => (
                  <p
                    key={'down' + clue.number}
                    onClick={() => focusClue(clue)}
                    className={`cursor-pointer mb-2 px-2 py-1 rounded-md transition-all duration-200 ${
                      selectedClue?.number === clue.number && selectedClue.direction === 'down'
                        ? 'bg-[#D4AF37] text-black font-semibold'
                        : 'hover:bg-[#D4AF37]/20'
                    }`}
                  >
                    {clue.number}. {clue.clue}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="overflow-auto">
        <table className="mx-auto border-collapse border border-gray-300">
          <tbody>
            {CrosswordPuzzle?.layout?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row?.map((cellActive, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-gray-400 w-10 h-10 text-center align-middle relative ${cellActive ? '' : 'bg-black'}`}
                  >
                    {cellActive ? (
                      <>
                        <input
                          type="text"
                          maxLength={1}
                          value={userGrid?.[rowIndex]?.[colIndex] || ''}
                          onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          ref={(el) => {
                            if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                            inputRefs.current[rowIndex][colIndex] = el;
                          }}
                          className={`w-full h-full text-center uppercase sm:text-lg text-xs focus:bg-[#ffb342] font-semibold outline-none ${getCellColor(rowIndex, colIndex)}`}
                        />
                        {/* Optional: show clue number on top-left corner */}
                        <div className="absolute -top-1 left-0 sm:text-xs text-[10px] text-gray-500 p-1 select-none pointer-events-none">
                          {CrosswordPuzzle.clues.across.find(c => c.row === rowIndex && c.col === colIndex)?.number ||
                           CrosswordPuzzle.clues.down.find(c => c.row === rowIndex && c.col === colIndex)?.number || ''}
                        </div>
                      </>
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {score !== null && (
        <p className="text-center font-bold mt-2 text-xl text-[#D4AF37]">
          Your score: {score} /{' '}
          {CrosswordPuzzle.clues.across.length + CrosswordPuzzle.clues.down.length}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-5 ">
        <button
          onClick={checkAnswers}
          className="px-5 py-2 bg-[#D4AF37] text-black rounded hover:bg-[#c8a93d] font-semibold transition"
        >
          Check Answers
        </button>
        
        {CrosswordPuzzleScore_id && (
          <button
            onClick={restartPuzzleHandler}
            className="px-5 py-2 bg-[#111] border border-[#D4AF37] text-[#D4AF37] rounded hover:bg-[#222] font-semibold transition"
          >
            Restart Puzzle
          </button>
        )}
      </div>
    </div>
  );
}