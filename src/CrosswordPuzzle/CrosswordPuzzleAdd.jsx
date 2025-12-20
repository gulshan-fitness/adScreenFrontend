import React, { useContext, useState } from "react";
import axios from "axios";
import { Context } from "../Context_holder";


const AddCrosswordPuzzle = () => {

  const{adminToken,notify }=useContext(Context)
  
  const [title, setTitle] = useState("");
  const [rawGridInput, setRawGridInput] = useState("");
  const [acrossClues, setAcrossClues] = useState([
    { number: "", clue: "", row: "", col: "", answer: "" },
  ]);
  const [downClues, setDownClues] = useState([
    { number: "", clue: "", row: "", col: "", answer: "" },
  ]);

  const parseGrid = (input) => {
    const grid = [];
    const layout = [];

    input
      .trim()
      .split("\n")
      .forEach((line) => {
        const row = [];
        const layoutRow = [];

        line
          .trim()
          .split(/\s+/)
          .forEach((cell) => {
            if (cell === "#") {
              row.push("");
              layoutRow.push(false);
            } else {
              row.push(cell);
              layoutRow.push(true);
            }
          });

        grid.push(row);
        layout.push(layoutRow);
      });

    return { grid, layout };
  };

  const handleClueChange = (type, index, field, value) => {
    const updatedClues = type === "across" ? [...acrossClues] : [...downClues];
    updatedClues[index][field] = value;
    type === "across" ? setAcrossClues(updatedClues) : setDownClues(updatedClues);
  };

  const handleAddClue = (type) => {
    const newClue = { number: "", clue: "", row: "", col: "", answer: "" };
    type === "across"
      ? setAcrossClues([...acrossClues, newClue])
      : setDownClues([...downClues, newClue]);
  };

  const handleSubmit = () => {
    if(!adminToken) return
    const { grid, layout } = parseGrid(rawGridInput);

    const formattedAcross = acrossClues
      .filter((c) => c.clue.trim())
      .map((c) => ({
        ...c,
        number: parseInt(c.number),
        row: parseInt(c.row),
        col: parseInt(c.col),
      }));

    const formattedDown = downClues
      .filter((c) => c.clue.trim())
      .map((c) => ({
        ...c,
        number: parseInt(c.number),
        row: parseInt(c.row),
        col: parseInt(c.col),
      }));
      
    const newPuzzle = {
      title,
      grid,
      layout,
      clues: {
        across: formattedAcross,
        down: formattedDown,
      },
    };

  axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_CROSSWORDPUZZLE_URL
        }add`,
        newPuzzle,
        {headers:{
          Authorization:adminToken
        }}
      ).then((success) => {
        notify(success.data.msg,success.data.status)
    if (success.data.status === 1) {
      setRawGridInput("");
      setTitle("");
      setAcrossClues([{ number: "", clue: "", row: "", col: "", answer: "" }]);
      setDownClues([{ number: "", clue: "", row: "", col: "", answer: "" }]);
    }

      })
      .catch((error) => {})
  };
  

  return (
     <div className="min-h-screen bg-[#0C0C0C] p-6 md:p-12 text-[#F5DEB3] font-sans">
    <div className="max-w-6xl mx-auto bg-[#1A1A1A] p-8  border-[#b8860b]/40 backdrop-blur-md bg-black/70 shadow-[0_8px_24px_rgba(184,134,11,0.4)] rounded-3xl  border border-[#333333]">
      <h2 className="text-4xl font-bold mb-10 text-center text-[#FFD700]">
        ✨ ADD Crossword Puzzle
      </h2>

      {/* Puzzle Title */}
      <div className="mb-8">
        <label className="block text-sm mb-2 text-[#FFD700]">Puzzle Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Puzzle Title"
          className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-[#F5DEB3] placeholder:text-[#888]"
        />
      </div>

      {/* Grid Input */}
      <div className="mb-12">
        <label className="block text-sm mb-2 text-[#FFD700]">Grid Input</label>
        <textarea
          rows={6}
          value={rawGridInput}
          onChange={(e) => setRawGridInput(e.target.value)}
          placeholder=
          "1 2 3 # 5 # 7 # 8"
          className="w-full px-4 py-3 rounded-xl bg-[#0C0C0C] border border-[#333333] font-mono text-sm text-[#F5DEB3] placeholder:text-[#888] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
        />
        <p className="text-xs text-[#888] mt-2">Use <code>#</code> for black cells.Separate colums by space. Separate rows by newlines.</p>
      </div>

      {/* Clue Sections */}
      {["Across", "Down"].map((type) => (
        <div key={type} className="mb-14">
          <h3 className="text-2xl font-semibold text-[#FFD700] mb-4">{type} Clues</h3>
          {(type === "Across" ? acrossClues : downClues).map((clue, index) => (
            <div key={index} className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-4 bg-[#0C0C0C] p-4 rounded-xl border border-[#333333]">
              <input
                type="number"
                placeholder="No."
                value={clue.number}
                onChange={(e) => handleClueChange(type.toLowerCase(), index, "number", e.target.value)}
                className="bg-[#1A1A1A] border border-[#333333] px-3 py-2 rounded-md text-[#F5DEB3]"
              />
              <input
                type="text"
                placeholder="Clue"
                value={clue.clue}
                onChange={(e) => handleClueChange(type.toLowerCase(), index, "clue", e.target.value)}
                className="md:col-span-2 bg-[#1A1A1A] border border-[#333333] px-3 py-2 rounded-md text-[#F5DEB3]"
              />
              <input
                type="number"
                placeholder="Row"
                value={clue.row}
                onChange={(e) => handleClueChange(type.toLowerCase(), index, "row", e.target.value)}
                className="bg-[#1A1A1A] border border-[#333333] px-3 py-2 rounded-md text-[#F5DEB3]"
              />
              <input
                type="number"
                placeholder="Col"
                value={clue.col}
                onChange={(e) => handleClueChange(type.toLowerCase(), index, "col", e.target.value)}
                className="bg-[#1A1A1A] border border-[#333333] px-3 py-2 rounded-md text-[#F5DEB3]"
              />
              <input
                type="text"
                placeholder="Answer"
                value={clue.answer}
                onChange={(e) => handleClueChange(type.toLowerCase(), index, "answer", e.target.value)}
                className="md:col-span-2 bg-[#1A1A1A] border border-[#333333] px-3 py-2 rounded-md text-[#F5DEB3]"
              />
              <button
                onClick={() =>
                  type === "Across"
                    ? setAcrossClues((prev) => prev.filter((_, i) => i !== index))
                    : setDownClues((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-red-400 hover:underline text-sm mt-1"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleAddClue(type.toLowerCase())}
            className="text-[#D4AF37] hover:text-white hover:underline text-sm"
          >
            + Add Another {type} Clue
          </button>
        </div>
      ))}

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-[#FFD700] text-black font-semibold px-10 py-1 rounded-full shadow-lg hover:brightness-110 transition"
        >
    Submit 
        </button>
      </div>
    </div>
  </div>
  );
};

export default AddCrosswordPuzzle;





 
