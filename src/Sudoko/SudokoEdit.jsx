



import React, { useState, useContext, useEffect } from 'react';
import { Context } from '../Context_holder';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function SudokoEdit() {
  const { adminToken, notify,SudokoFetch, Sudoko } = useContext(Context);
  const { id } = useParams()

  const [title, setTitle] = useState('');
  const [type, setType] = useState('classic');
  const [size, setSize] = useState(9);
  const [difficulty, setDifficulty] = useState('easy');
  const [puzzleText, setPuzzleText] = useState('');
  const [solutionText, setSolutionText] = useState('');

    const formattedText = (sudokuGrid)=>{
 const textFormate= sudokuGrid?.map(row => row.join(',')).join('\n');
 return textFormate
    }
    
   


  useEffect(() => {
    if (!id ) return;
    SudokoFetch(id);
  }, [id]);


  useEffect(
    ()=>{

        setDifficulty(Sudoko?.difficulty) 
        setPuzzleText( formattedText(Sudoko?.puzzle))
        setSize(Sudoko?.size)
        setSolutionText(formattedText(Sudoko?.solution))
        setTitle(Sudoko?.title)
        setType(Sudoko?.type)

    },[Sudoko]
  )

  const parseGrid = (text) => {
    return text
      .trim()
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(row =>
        row.replace(/,+$/, '') // remove trailing commas
          .split(',')
          .map(n => parseInt(n.trim()) || 0)
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!id)return

    const puzzle = parseGrid(puzzleText);
    const solution = parseGrid(solutionText);

    if (puzzle.length !== size || solution.length !== size) {
      return notify(`❌ Each grid must have ${size} rows.`, 0);
    }

    if (puzzle.some(row => row.length !== size) || solution.some(row => row.length !== size)) {
      return notify(`❌ Each row must have ${size} numbers.`, 0);
    }

    const payload = {
      title,
      type,
      size,
      difficulty,
      puzzle,
      solution,
    };

    axios.put(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SUDOKO_URL}edit/${id}`,
      payload,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    ).then((res) => {
      notify(res.data.msg, res.data.status);
      if (res.data.status === 1) {
       SudokoFetch(id);
      }
    }).catch(() => {});
  };



  return ( <div className='w-full min-h-screen px-4 sm:px-6 py-8 sm:py-10 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-[#f0e6d2]'>

    <div className="rounded-2xl border p-7 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)]">
      <h2 className="text-center text-3xl sm:text-4xl font-extrabold mb-8 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
        Edit Sudoku Puzzle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-black bg-opacity-80 border border-yellow-600 rounded-md px-4 py-3 text-yellow-300 placeholder-yellow-500 text-base sm:text-lg
            focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-black bg-opacity-80 border border-yellow-600 rounded-md px-4 py-3 text-yellow-300 text-base sm:text-lg
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          >
            <option value="classic">Classic</option>
            <option value="hyper">Hyper</option>
            <option value="killer">Killer</option>
          </select>

          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="bg-black bg-opacity-80 border border-yellow-600 rounded-md px-4 py-3 text-yellow-300 text-base sm:text-lg
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          >
            <option value={4}>4x4</option>
            <option value={9}>9x9</option>
            <option value={16}>16x16</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-black bg-opacity-80 border border-yellow-600 rounded-md px-4 py-3 text-yellow-300 text-base sm:text-lg
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-yellow-400 text-base sm:text-lg">
            Puzzle Grid (Enter {size}x{size} numbers):
          </label>
          <textarea
            rows={size}
            value={puzzleText}
        
            onChange={(e) => setPuzzleText(e.target.value)}
            placeholder="Separate numbers by commas. Each line is a row. Use 0 for hidden cells."
            className="w-full bg-black bg-opacity-70 border border-yellow-700 rounded-md px-4 py-3 font-mono text-yellow-300 placeholder-yellow-600  text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-yellow-400 text-base sm:text-lg">
            Solution Grid (Enter {size}x{size} numbers):
          </label>
          <textarea
            rows={size}
            value={solutionText}
            onChange={(e) => setSolutionText(e.target.value)}
            placeholder="Separate numbers by commas. Each line is a row."
            className="w-full bg-black bg-opacity-70 border border-yellow-700 rounded-md px-4 py-3 font-mono text-yellow-300 placeholder-yellow-600  text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8  rounded-md bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold shadow-lg hover:brightness-110 transition-all text-base sm:text-lg"
        >
          Save
        </button>
      </form>
    </div>

  </div>
    
  );
}
