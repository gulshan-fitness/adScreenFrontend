import React, { useEffect, useContext } from 'react';
import { Context } from '../Context_holder';
import { Link } from 'react-router-dom';

export default function SudokoListPlay() {
  const { SudokoFetch, AllSudoko } = useContext(Context);

  useEffect(() => {
    SudokoFetch();
  }, []);

  return (
    <div className="w-full min-h-screen px-4 py-10 bg-black text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-transparent bg-clip-text drop-shadow-md">
        Choose a Sudoku Puzzle to Play
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {AllSudoko?.map((puzzle) => (
          <div
            key={puzzle?._id}
            className="bg-black border border-[#FFD700] rounded-xl p-5 sm:p-6 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#FFD700] mb-2">
              {puzzle?.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-300 mb-1">
              <span className="font-semibold text-white">Type:</span> {puzzle?.type}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-1">
              <span className="font-semibold text-white">Size:</span> {puzzle?.size}x{puzzle?.size}
            </p>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              <span className="font-semibold text-white">Difficulty:</span> {puzzle?.difficulty}
            </p>

            <Link
              to={`/sudoko/${puzzle?._id}`}
              className="inline-block w-full text-center bg-[#FFD700] text-black font-bold py-2 rounded-lg hover:bg-black hover:text-[#FFD700] border border-[#FFD700] transition duration-300 text-sm sm:text-base"
            >
              Play Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
