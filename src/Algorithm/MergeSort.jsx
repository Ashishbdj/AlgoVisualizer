import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MergeSort() {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 40, 60]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Function to generate steps of merge sort
  const mergeSort = (arr) => {
    const animations = [];
    const auxiliary = arr.slice();

    const mergeHelper = (main, start, end) => {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      mergeHelper(main, start, mid);
      mergeHelper(main, mid + 1, end);
      merge(main, start, mid, end);
    };

    const merge = (main, start, mid, end) => {
      let left = start;
      let right = mid + 1;
      const temp = [];

      while (left <= mid && right <= end) {
        animations.push([...main]);
        if (main[left] <= main[right]) {
          temp.push(main[left++]);
        } else {
          temp.push(main[right++]);
        }
      }

      while (left <= mid) temp.push(main[left++]);
      while (right <= end) temp.push(main[right++]);

      for (let i = 0; i < temp.length; i++) {
        main[start + i] = temp[i];
        animations.push([...main]);
      }
    };

    mergeHelper(auxiliary, 0, arr.length - 1);
    return animations;
  };

  const startSort = () => {
    setIsSorting(true);
    const animSteps = mergeSort(array);
    setSteps(animSteps);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isSorting && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setArray(steps[currentStep]);
        setCurrentStep(currentStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSorting, currentStep, steps]);

  const handleCustomInput = () => {
    const nums = inputValue.split(",").map((n) => parseInt(n.trim(), 10));
    if (nums.some(isNaN)) return alert("Please enter valid numbers separated by commas!");
    setArray(nums);
    setSteps([]);
    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Merge Sort Visualizer</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter numbers e.g. 40,10,20"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="p-2 rounded-md text-black w-64"
        />
        <button
          onClick={handleCustomInput}
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Update Array
        </button>
        <button
          onClick={startSort}
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Visualize
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      <div className="flex items-end gap-2 h-64">
        {array.map((value, idx) => (
          <motion.div
            key={idx}
            initial={{ height: 0 }}
            animate={{ height: value * 2 }}
            transition={{ duration: 0.4 }}
            className="bg-blue-400 w-8 rounded-t-md"
          >
            <div className="text-center text-sm mt-2">{value}</div>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 text-gray-300 text-center max-w-2xl">
        Merge Sort is a Divide and Conquer algorithm. It divides the array into halves,
        sorts them, and then merges the sorted halves back together.
      </p>
    </div>
  );
}
