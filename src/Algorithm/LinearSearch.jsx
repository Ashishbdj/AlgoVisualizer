import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LinearSearch() {
  const [array, setArray] = useState([20, 40, 10, 50, 30, 70, 60]);
  const [target, setTarget] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [inputArray, setInputArray] = useState("");
  const [stepMessage, setStepMessage] = useState("");

  // Start search
  const startSearch = () => {
    if (target === "") {
      alert("Please enter a target value!");
      return;
    }
    setFoundIndex(null);
    setCurrentIndex(0);
    setStepMessage("Starting linear search...");
    setIsSearching(true);
  };

  // Visualization logic
  useEffect(() => {
    if (isSearching && currentIndex < array.length) {
      const timer = setTimeout(() => {
        const currentValue = array[currentIndex];
        setStepMessage(
          `Step ${currentIndex + 1}: Comparing ${currentValue} with target ${target}...`
        );

        if (currentValue === parseInt(target, 10)) {
          setFoundIndex(currentIndex);
          setIsSearching(false);
          setStepMessage(`✅ Element ${target} found at index ${currentIndex}!`);
        } else if (currentIndex === array.length - 1) {
          setStepMessage(`❌ Element ${target} not found in the array.`);
          setIsSearching(false);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSearching, currentIndex]);

  // Update custom array
  const handleCustomArray = () => {
    const nums = inputArray.split(",").map((n) => parseInt(n.trim(), 10));
    if (nums.some(isNaN)) {
      alert("Please enter valid numbers separated by commas!");
      return;
    }
    setArray(nums);
    setFoundIndex(null);
    setCurrentIndex(-1);
    setIsSearching(false);
    setStepMessage("");
  };

  // Reset
  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(null);
    setIsSearching(false);
    setTarget("");
    setStepMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-950 to-blue-900 text-white flex flex-col">
      {/* Header */}
      <header className="text-center py-8 bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg">
        <h1 className="text-6xl font-extrabold text-blue-300 drop-shadow-lg">
          Linear Search Visualizer
        </h1>
        <p className="text-gray-300 mt-3 text-lg">
          Understand Linear Search step by step with visual animation and insights.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 p-6 bg-gray-800 shadow-md">
        <input
          type="text"
          placeholder="Enter array e.g. 10,20,30"
          value={inputArray}
          onChange={(e) => setInputArray(e.target.value)}
          className="p-2 rounded-md text-black w-64"
        />
        <button
          onClick={handleCustomArray}
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Update Array
        </button>

        <input
          type="number"
          placeholder="Target value"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="p-2 rounded-md text-black w-40"
        />
        <button
          onClick={startSearch}
          disabled={isSearching}
          className={`px-4 py-2 rounded-lg ${
            isSearching
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Search
        </button>
        <button
          onClick={reset}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Main Content: Left (Visualizer + Explanation) | Right (Info) */}
      <main className="flex flex-col md:flex-row flex-grow px-10 py-10 gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-6 bg-gray-900/40 rounded-xl p-6 shadow-lg border border-gray-700">
          {/* Top - Visualization */}
          <div className="flex justify-center items-end h-[50vh] bg-gray-800/40 rounded-lg p-4 shadow-inner">
            <div className="flex items-end gap-3 w-full justify-center">
              {array.map((value, idx) => {
                let color = "bg-blue-500";
                if (idx === currentIndex) color = "bg-yellow-400";
                if (idx === foundIndex) color = "bg-green-500";

                return (
                  <motion.div
                    key={idx}
                    initial={{ height: 0 }}
                    animate={{ height: value * 2 }}
                    transition={{ duration: 0.3 }}
                    className={`${color} w-12 rounded-t-md relative`}
                  >
                    <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-sm">
                      {value}
                    </span>
                    {idx === currentIndex && (
                      <motion.div
                        layoutId="indicator"
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 text-sm"
                      >
                        🔍
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom - Step Explanation */}
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-5xl font-semibold text-blue-400 mb-3">
              🪜 Step Explanation
            </h2>
            <p className="text-gray-300 text-6xl leading-relaxed min-h-[100px]">
              {stepMessage || "Click 'Search' to begin the visualization."}
            </p>
          </div>
        </div>

       {/* RIGHT SIDE - Info, Pseudocode, Complexity */}
<div className="flex-1 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between text-lg">
  <div>
    {/* Definition */}
    <h2 className="text-5xl font-bold text-blue-400 mb-3">📖 Linear Search</h2>
    <p className="text-gray-200 text-3xl mb-6 leading-relaxed">
      Linear Search is a simple search algorithm that checks each element of an array sequentially until the target element is found or the end of the array is reached.
    </p>

    {/* Pseudocode */}
    <h2 className="text-5xl font-bold text-blue-400 mb-3">🧾 Pseudocode</h2>
    <pre className="bg-gray-900 text-gray-100  p-4 rounded-md text-3xl mb-6 overflow-x-auto">
{`LinearSearch(array, target):
  for i ← 0 to length(array) - 1 do
      if array[i] == target then
          return i
  return -1  // not found`}
    </pre>

    {/* Complexity */}
    <h2 className="text-5xl font-bold text-blue-400 mb-2">⏱️ Time Complexity</h2>
    <ul className="text-gray-200 text-3xl list-disc list-inside mb-6">
      <li>Best Case: <span className="text-green-400">O(1)</span></li>
      <li>Average Case: <span className="text-yellow-400">O(n)</span></li>
      <li>Worst Case: <span className="text-red-400">O(n)</span></li>
    </ul>

    <h2 className="text-5xl font-bold text-blue-400 mb-2">💾 Space Complexity</h2>
    <p className="text-gray-200 text-3xl mb-6">O(1) — Uses constant extra space.</p>

    {/* Real-Life Analogy */}
    <h2 className="text-5xl font-bold text-blue-400 mb-2">📘 Real-Life Analogy</h2>
    <p className="text-gray-200 text-3xl leading-relaxed">
      Imagine searching for your friend’s name in a random guest list. You start from the top and check one name at a time until you find them — that’s exactly how Linear Search works!
    </p>
  </div>
</div>

      </main>
    </div>
  );
}
