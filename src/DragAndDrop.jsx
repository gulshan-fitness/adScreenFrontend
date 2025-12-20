import { useState } from "react";

export default function DragAndDrop() {
  const [items, setItems] = useState(["Apple", "", "Cherry", "Mango"]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null); // Track hover during drag

  // When drag starts
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // When dragging over an item
  const handleDragOver = (e, index) => {
    if (items[index] === "") {
      e.preventDefault(); // allow drop only if target is empty
      setHoverIndex(index); // set hover index
    }
  };

  // When dragging leaves an item
  const handleDragLeave = (e, index) => {
    setHoverIndex(null); // reset hover index
  };

  // When dropped
  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    if (items[index] !== "") return; // only allow drop on empty slot

    const newItems = [...items];
    // Move dragged item to empty slot
    newItems[index] = newItems[draggedIndex];
    // Old place becomes empty
    newItems[draggedIndex] = "";

    setItems(newItems);
    setDraggedIndex(null);
    setHoverIndex(null); // reset hover after drop
  };

  return (
    <div className="p-5 max-w-sm">
      <h2 className="text-lg font-bold mb-4">Drag & Drop (Only Empty Slots)</h2>

      <ul className="list-none p-0">
        {items.map((item, index) => (
          <li
            key={index}
            draggable={item !== ""} // draggable only if not empty
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={() => {
              setDraggedIndex(null);
              setHoverIndex(null); // reset when drag ends
            }}
            className={`p-3 mb-2 border rounded cursor-grab transition-all duration-200
              ${item === "" ? "bg-gray-200" : "bg-blue-200"}
              ${draggedIndex === index ? "opacity-40" : "opacity-100"}
              ${hoverIndex === index && items[index] === "" ? "border-2 border-gray-400" : "border border-gray-300"}`}
          >
            {item || "Empty"}
          </li>
        ))}
      </ul>
    </div>
  );
}