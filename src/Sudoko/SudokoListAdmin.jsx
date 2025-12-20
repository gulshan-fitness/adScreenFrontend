import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../Context_holder';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SudokoListAdmin() {

  
  const { SudokoFetch, AllSudoko, adminToken, notify } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SudokoFetch();
  }, []);

  const handleDelete = async (id) => {
    if (!adminToken || !id) return;

    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_SUDOKO_URL}delete/${id}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      )
      .then((success) => {
        notify(success.data.msg, success.data.status);
        if (success.data.status === 1) {
          SudokoFetch();
        }
      })
      .catch((error) => {});
  };



  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-10 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-[#f0e6d2]">
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 sm:mb-10 bg-gradient-to-r from-[#d4af37] via-[#f5de50] to-[#b8860b] text-transparent bg-clip-text drop-shadow-[0_4px_6px_rgba(212,175,55,0.7)]">
        Sudoku Puzzle Manager
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)]">
        <table className="min-w-full text-sm sm:text-base md:text-lg text-[#f0e6d2]">
          <thead>
            <tr className="bg-[#d4af37]/25 text-[#d4af37] uppercase text-xs sm:text-sm tracking-wide backdrop-blur-sm">
              <th className="py-2 sm:py-3 px-3 sm:px-6 text-left border-b border-[#b8860b]/40">Title</th>
              <th className="py-2 sm:py-3 px-3 sm:px-6 text-center border-b border-[#b8860b]/40">Type</th>
              <th className="py-2 sm:py-3 px-3 sm:px-6 text-center border-b border-[#b8860b]/40">Size</th>
              <th className="py-2 sm:py-3 px-3 sm:px-6 text-center border-b border-[#b8860b]/40">Difficulty</th>
              <th className="py-2 sm:py-3 px-3 sm:px-6 text-center border-b border-[#b8860b]/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {AllSudoko?.map((puzzle) => (
              <tr
                key={puzzle?._id}
                className="hover:bg-[#f5de50]/20 transition-all duration-300"
              >
                <td className="py-2 sm:py-4 px-3 sm:px-6 font-semibold">{puzzle?.title}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-center">{puzzle?.type}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-center">{puzzle?.size}x{puzzle?.size}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6 text-center">{puzzle?.difficulty}</td>
                <td className="py-2 sm:py-4 px-3 sm:px-6">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                    <Link to={`/adminprofile/sudoko/edit/${puzzle?._id}`}
                     
                      className="w-full sm:w-auto px-3  rounded-md bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-semibold shadow-lg hover:brightness-110 transition-all text-center text-sm sm:text-base"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(puzzle?._id)}
                      className="w-full sm:w-auto px-3  rounded-md bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-semibold shadow-lg hover:brightness-110 transition-all text-sm sm:text-base"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
