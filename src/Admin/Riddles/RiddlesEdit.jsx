import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../Context_holder";
import { useParams } from "react-router-dom";

export default function RiddlesEdit() {
  const { adminToken, notify, RiddlesFetch, Riddles } = useContext(Context);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      RiddlesFetch(id);
    }
  }, [id]);

  useEffect(() => {
   
    if (Riddles) {
      setLoading(false);
    }
  }, [Riddles]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const question = e.target.question.value;
    const answer = e.target.answer.value;
    const clue = e.target.clue.value;
    const type = e.target.type.value;

    const updatedRiddle = { question, answer, clue, type };

    axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RIDDLES_URL}edit/${id}`,
        updatedRiddle,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      )
      .then((success) => {
        notify(success.data.msg, success.data.status);
        if(success.data.status==1){
      RiddlesFetch(id);
            
        }
    
      })
      .catch((error) => {
        notify(error.message, 0);
      });
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] text-center">
        <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#FFD700] text-sm">Loading Riddle...</p>
      </div>
    );
  }


  if (!Riddles) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333333] text-center">
        <p className="text-[#F5DEB3] text-sm">Riddle not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] p-6 md:p-12 text-[#F5DEB3] font-sans">
      <div className="max-w-3xl mx-auto bg-[#1A1A1A] p-8 border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl border border-[#333333]">
        <h2 className="text-4xl font-bold mb-10 text-center text-[#FFD700]">
          ✨ Edit Riddle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question */}
          <div>
            <label className="block text-sm mb-2 text-[#FFD700]">Question</label>
            <input
              type="text"
              name="question"
              required
              defaultValue={Riddles?.question}
              placeholder="Enter the riddle question"
              className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-[#F5DEB3] placeholder:text-[#888]"
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm mb-2 text-[#FFD700]">Answer</label>
            <input
              type="text"
              name="answer"
              required
              defaultValue={Riddles?.answer}
              placeholder="Enter the answer"
              className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-[#F5DEB3] placeholder:text-[#888]"
            />
          </div>

          {/* Clue */}
          <div>
            <label className="block text-sm mb-2 text-[#FFD700]">Clue</label>
            <textarea
              name="clue"
              required
              rows="4"
              defaultValue={Riddles?.clue}
              placeholder="Enter a clue"
              className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-[#F5DEB3] placeholder:text-[#888]"
            />
          </div>

          {/* Type of Riddle */}
          <div>
            <label className="block text-sm mb-2 text-[#FFD700]">Type</label>
            <select
              name="type"
              required
              defaultValue={Riddles?.type}
              className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-[#F5DEB3]"
            >
              <option value="easy">Easy</option>
              <option value="hard">Hard</option>
              <option value="very hard">Very Hard</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#FFD700] text-black font-semibold px-10 py-3 rounded-full shadow-lg hover:brightness-110 transition"
            >
              Update Riddle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}