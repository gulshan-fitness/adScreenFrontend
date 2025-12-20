import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../Context_holder';

export default function CrosswordPuzzleList() {
  const { AllCrosswordPuzzle, CrosswordPuzzleFetch } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CrosswordPuzzleFetch();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
          Crossword Puzzles
        </h1>

        <div className="grid gap-6 sm:grid-cols-2">
          {AllCrosswordPuzzle?.map((puzzle) => (
            <div
              key={puzzle?._id}
              className="bg-[#0f0f0f] border border-[#FFD700] rounded-xl p-5 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#FFD700] mb-2">
                {puzzle?.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                Created on: {new Date(puzzle?.createdAt).toLocaleDateString()}
              </p>
              <Link
                to={`/crosswordpuzzle/${puzzle?._id}`}
                className="inline-block w-full text-center bg-[#FFD700] text-black font-semibold py-2 rounded-md hover:bg-black hover:text-[#FFD700] border border-[#FFD700] transition duration-300 text-sm sm:text-base"
              >
                Play
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
