import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../Context_holder';

export default function RiddlesList() {



  const { AllRiddles, RiddlesFetch, deleteRiddle } = useContext(Context);



  const [loading, setLoading] = useState(true);



  useEffect(() => {
    RiddlesFetch();
  }, []);



  useEffect(() => {
    if (AllRiddles) {
      setLoading(false);
    }
  }, [AllRiddles]);



  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this riddle?")) {
      deleteRiddle(id);
    }
  };

  

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
          Riddles List
        </h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : AllRiddles?.length === 0 ? (
          <div className="text-center text-gray-400">No riddles found.</div>
        ) : (
          <div className="space-y-4">
            {AllRiddles.map((riddle) => (
              <div
                key={riddle._id}
                className="bg-[#0f0f0f] border border-[#FFD700] rounded-xl p-4 shadow-lg hover:shadow-yellow-400/30 transition-all duration-300"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-[#FFD700] mb-2">
                  {riddle.question}
                </h2>
                <p className="text-sm text-gray-300 mb-2">
                  Type: {riddle.type}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Created on: {new Date(riddle.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-3">
                  <Link
                    to={`/adminprofile/riddles/edit/${riddle._id}`}
                    className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-black hover:text-yellow-500 border border-yellow-500 transition duration-300 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(riddle._id)}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-black hover:text-red-600 border border-red-600 transition duration-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
