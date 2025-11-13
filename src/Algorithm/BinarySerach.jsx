import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BinarySearch() {
  const [array, setArray] = useState([10, 20, 30, 40, 50, 60, 70]);
  const [target, setTarget] = useState("");
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(array.length - 1);
  const [mid, setMid] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [inputArray, setInputArray] = useState("");
  const [stepMessage, setStepMessage] = useState("");

  const reset = () => {
    setLow(0);
    setHigh(array.length - 1);
    setMid(null);
    setFoundIndex(null);
    setIsSearching(false);
    setStepMessage("");
  };

  const handleCustomArray = () => {
    const nums = inputArray
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);
    if (nums.length === 0) {
      alert("Please enter valid numbers separated by commas!");
      return;
    }
    setArray(nums);
    setLow(0);
    setHigh(nums.length - 1);
    setMid(null);
    setFoundIndex(null);
    setIsSearching(false);
    setStepMessage("");
  };

  const startSearch = () => {
    if (target === "") {
      alert("Please enter a target value!");
      return;
    }
    reset();
    setIsSearching(true);
  };

  useEffect(() => {
    if (isSearching && low <= high) {
      const timer = setTimeout(() => {
        const middle = Math.floor((low + high) / 2);
        setMid(middle);

        const lowText = `<span class="text-cyan-400">Low: ${low}</span>`;
        const midText = `<span class="text-yellow-400">Mid: ${middle}</span>`;
        const highText = `<span class="text-orange-400">High: ${high}</span>`;
        const valueText = `<span class="text-blue-300">Checking: ${array[middle]}</span>`;

        setStepMessage(
          `${lowText}, ${midText}, ${highText}<br/>${valueText}`
        );

        if (array[middle] === parseInt(target, 10)) {
          setFoundIndex(middle);
          setStepMessage(
            `${lowText}, ${midText}, ${highText}<br/><span class="text-green-400 font-bold">✅ Target ${target} found at index ${middle}!</span>`
          );
          setIsSearching(false);
        } else if (array[middle] < parseInt(target, 10)) {
          setLow(middle + 1);
        } else {
          setHigh(middle - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isSearching && low > high) {
      setStepMessage(
        `<span class="text-red-400 font-bold">❌ Target ${target} not found.</span><br/><span class="text-cyan-400">Low: ${low}</span>, <span class="text-yellow-400">Mid: ${mid}</span>, <span class="text-orange-400">High: ${high}</span>`
      );
      setIsSearching(false);
    }
  }, [isSearching, low, high]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col px-10 py-10 gap-10">
      {/* Header */}
      <header className="text-center py-6 bg-gradient-to-r from-blue-800 to-indigo-900 shadow-lg rounded-lg">
        <h1 className="text-6xl font-extrabold text-blue-300 drop-shadow-lg">
          Binary Search Visualizer
        </h1>
        <p className="text-gray-300 mt-3 text-xl">
          Understand Binary Search step by step with visual animation and insights.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-4 p-6 bg-gray-800 shadow-md rounded-lg">
        <input
          type="text"
          placeholder="Enter sorted array e.g. 10,20,30"
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
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
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
      <main className="flex flex-col md:flex-row flex-grow gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-6 bg-gray-900/40 rounded-xl p-6 shadow-lg border border-gray-700">
          {/* Top - Visualization */}
          <div className="flex justify-center items-end h-[50vh] bg-gray-800/40 rounded-lg p-4 shadow-inner">
            <div className="flex items-end gap-3 w-full justify-center">
              {array.map((value, idx) => {
                let color = "bg-blue-500";
                if (idx === mid) color = "bg-yellow-400";
                if (idx === foundIndex) color = "bg-green-500";
                if (idx < low || idx > high) color = "bg-gray-600 opacity-50";

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
                    {idx === mid && (
                      <motion.div
                        layoutId="indicator"
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 text-sm"
                      >
                        🎯
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
            <div
              className="text-gray-300 text-4xl leading-relaxed min-h-[120px]"
              dangerouslySetInnerHTML={{ __html: stepMessage || "Click 'Search' to begin the visualization." }}
            />
          </div>
        </div>

        {/* RIGHT SIDE - Info, Pseudocode, Complexity */}
        <div className="flex-1 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between text-lg">
          <div>
            {/* Definition */}
            <h2 className="text-5xl font-bold text-blue-400 mb-3">📖 Binary Search</h2>
            <p className="text-gray-200 text-3xl mb-6 leading-relaxed">
              Binary Search is an efficient search algorithm for <b>sorted arrays</b> that repeatedly divides the search range in half until the target element is found or the range is empty.
            </p>

            {/* Pseudocode */}
            <h2 className="text-5xl font-bold text-blue-400 mb-3">🧾 Pseudocode</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-3xl mb-6 overflow-x-auto">
{`BinarySearch(array, target):
  low ← 0
  high ← length(array) - 1
  while low ≤ high:
      mid ← floor((low + high)/2)
      if array[mid] == target:
          return mid
      else if array[mid] < target:
          low ← mid + 1
      else:
          high ← mid - 1
  return -1  // not found`}
            </pre>

            {/* Complexity */}
            <h2 className="text-5xl font-bold text-blue-400 mb-2">⏱️ Time Complexity</h2>
            <ul className="text-gray-200 text-3xl list-disc list-inside mb-6">
              <li>Best Case: <span className="text-green-400">O(1)</span></li>
              <li>Average Case: <span className="text-yellow-400">O(log n)</span></li>
              <li>Worst Case: <span className="text-red-400">O(log n)</span></li>
            </ul>

            <h2 className="text-5xl font-bold text-blue-400 mb-2">💾 Space Complexity</h2>
            <p className="text-gray-200 text-3xl mb-6">O(1) — Uses constant extra space.</p>

            {/* Real-Life Analogy */}
            <h2 className="text-5xl font-bold text-blue-400 mb-2">📘 Real-Life Analogy</h2>
            <p className="text-gray-200 text-3xl leading-relaxed">
              Imagine looking for a word in a dictionary. You don’t read every word; instead, you open near the middle and decide which half to search next. That’s how Binary Search works!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
