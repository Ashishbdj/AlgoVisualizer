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

  const reset = () => {
    setLow(0);
    setHigh(array.length - 1);
    setMid(null);
    setFoundIndex(null);
    setIsSearching(false);
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
        if (array[middle] === parseInt(target, 10)) {
          setFoundIndex(middle);
          setIsSearching(false);
        } else if (array[middle] < parseInt(target, 10)) {
          setLow(middle + 1);
        } else {
          setHigh(middle - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isSearching && low > high) {
      setIsSearching(false);
    }
  }, [isSearching, low, high]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Binary Search Visualizer</h1>

      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <input
          type="text"
          placeholder="Enter sorted array (e.g., 10,20,30)"
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

      {/* Visualization Bars */}
      <div className="flex items-end gap-2 h-64 mt-6">
        {array.map((value, idx) => {
          let color = "bg-blue-400";
          if (idx === mid) color = "bg-yellow-400";
          if (idx === foundIndex) color = "bg-green-500";
          if (idx < low || idx > high) color = "bg-gray-600 opacity-50";

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
              {idx === mid && (
                <motion.div
                  layoutId="indicator"
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs"
                >
                  🎯
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Status / Messages */}
      <div className="mt-8 text-gray-300 text-center max-w-2xl">
        <p>
          Binary Search works on **sorted arrays** by repeatedly dividing the
          search range in half.
        </p>
        {foundIndex !== null && (
          <p className="text-green-400 font-semibold mt-2">
            ✅ Target found at index {foundIndex}!
          </p>
        )}
        {!isSearching && foundIndex === null && low > high && (
          <p className="text-red-400 font-semibold mt-2">
            ❌ Target not found in the array.
          </p>
        )}
      </div>
    </div>
  );
}
