import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LinearSearch() {
  const [array, setArray] = useState([20, 40, 10, 50, 30, 70, 60]);
  const [target, setTarget] = useState("");
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [inputArray, setInputArray] = useState("");

  // Linear search visualization logic
  const startSearch = () => {
    if (target === "") {
      alert("Please enter a target value!");
      return;
    }
    setFoundIndex(null);
    setIsSearching(true);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (isSearching && currentIndex < array.length) {
      const timer = setTimeout(() => {
        if (array[currentIndex] === parseInt(target, 10)) {
          setFoundIndex(currentIndex);
          setIsSearching(false);
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isSearching, currentIndex]);

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
  };

  const reset = () => {
    setCurrentIndex(-1);
    setFoundIndex(null);
    setIsSearching(false);
    setTarget("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Linear Search Visualizer</h1>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
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

      <div className="flex items-end gap-2 h-64 mt-6">
        {array.map((value, idx) => {
          let color = "bg-blue-400";
          if (idx === currentIndex) color = "bg-yellow-400";
          if (idx === foundIndex) color = "bg-green-500";

          return (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: value * 2 }}
              transition={{ duration: 0.3 }}
              className={`${color} w-10 rounded-t-md relative`}
            >
              <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-sm">
                {value}
              </span>
              {idx === currentIndex && (
                <motion.div
                  layoutId="indicator"
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs"
                >
                  🔍
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-8 text-gray-300 text-center max-w-2xl">
        Linear Search sequentially checks each element of the array until it finds the target or reaches the end.
        <br />
        {foundIndex !== null && (
          <span className="text-green-400">
            ✅ Target found at index {foundIndex}!
          </span>
        )}
        {foundIndex === null && !isSearching && currentIndex === array.length && (
          <span className="text-red-400">
            ❌ Target not found in the array.
          </span>
        )}
      </p>
    </div>
  );
}
