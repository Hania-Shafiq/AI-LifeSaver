import { useState } from "react";

export default function Emergency() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    // placeholder demo: replace later with JSON match
    if (input.toLowerCase().includes("burn")) {
      setResult([
        "Cool under running water.",
        "Do not apply toothpaste or oil.",
        "Cover with a clean cloth.",
        "Call 1122 if severe."
      ]);
    } else {
      setResult(["No matching first aid guide found."]);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Emergency Assistant</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your emergency (e.g., burn injury)"
        className="w-full border p-2 rounded mb-4"
      />
      <button 
        onClick={handleSearch} 
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Search
      </button>

      {result && (
        <div className="mt-6 bg-white shadow p-4 rounded">
          <h3 className="font-semibold mb-2">First Aid Steps:</h3>
          <ul className="list-disc list-inside">
            {result.map((step, i) => <li key={i}>{step}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
