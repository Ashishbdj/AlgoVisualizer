import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function QuickSort({ initialData }) {
  const defaultArray = initialData || [70, 20, 90, 10, 50];
  const [array, setArray] = useState([...defaultArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // QuickSort step generator
  const generateSteps = (arr) => {
    const stepsArr = [];
    const a = [...arr];

    const quickSort = (low, high) => {
      if (low < high) {
        const pivotIndex = partition(low, high);
        quickSort(low, pivotIndex - 1);
        quickSort(pivotIndex + 1, high);
      }
    };

    const partition = (low, high) => {
      const pivot = a[high];
      let i = low - 1;
      stepsArr.push({
        array: [...a],
        comparing: [high],
        swapped: [],
        message: `Pivot selected: ${pivot}`,
      });

      for (let j = low; j < high; j++) {
        stepsArr.push({
          array: [...a],
          comparing: [j, high],
          swapped: [],
          message: `Compare ${a[j]} with pivot ${pivot}`,
        });
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          stepsArr.push({
            array: [...a],
            comparing: [i, j],
            swapped: [i, j],
            message: `Swap ${a[i]} and ${a[j]}`,
          });
        }
      }
      [a[i + 1], a[high]] = [a[high], a[i + 1]];
      stepsArr.push({
        array: [...a],
        comparing: [i + 1, high],
        swapped: [i + 1, high],
        message: `Move pivot ${pivot} to correct position.`,
      });
      return i + 1;
    };

    quickSort(0, a.length - 1);
    stepsArr.push({ array: [...a], comparing: [], swapped: [], message: "Array sorted!" });
    return stepsArr;
  };

  useEffect(() => {
    const allSteps = generateSteps(array);
    setSteps(allSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [array]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(timerRef.current);
          return prev;
        });
      }, 600);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps]);

  const handleUserData = () => {
    if (!userInput) return;
    const userArray = userInput
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((n) => !isNaN(n));
    if (userArray.length > 0) setArray(userArray);
    setUserInput("");
  };

  const goNext = () => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1);
  const goPrev = () => currentStep > 0 && setCurrentStep(currentStep - 1);
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const togglePlay = () => setIsPlaying(!isPlaying);

  const stepData = steps[currentStep] || { array, comparing: [], swapped: [], message: "" };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="max-w-3xl text-left bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Quick Sort</h2>
        <p className="text-gray-700 mb-2">
          Quick Sort is a **divide and conquer** sorting algorithm. It selects a pivot and partitions the
          array so that smaller elements are on one side and larger on the other.
        </p>
        <h3 className="text-lg font-semibold text-indigo-500 mt-2">How it Works:</h3>
        <ol className="list-decimal list-inside text-gray-700 mb-2">
          <li>Select a pivot element.</li>
          <li>Partition the array around the pivot.</li>
          <li>Recursively sort left and right partitions.</li>
        </ol>
        <p className="text-gray-700 font-semibold mt-2">{stepData.message}</p>
      </div>

      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <input
          type="text"
          placeholder="Enter array (e.g., 10,5,8,1)"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleUserData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </div>

      {/* Bars */}
      <div className="flex gap-2 h-44 items-end mt-4">
        {stepData.array.map((val, idx) => {
          let color = "bg-blue-400";
          if (stepData.comparing.includes(idx)) color = "bg-yellow-400";
          if (stepData.swapped.includes(idx)) color = "bg-red-500";
          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-sm font-semibold mb-1">{val}</span>
              <motion.div
                animate={{ height: val * 2 }}
                transition={{ duration: 0.3 }}
                className={`${color} w-6 rounded-t-lg`}
              />
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <button onClick={goPrev} className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
          Previous
        </button>
        <button onClick={goNext} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Next
        </button>
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white ${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Reset
        </button>
      </div>

      <p className="text-gray-600 mt-2">
        Step {currentStep + 1} / {steps.length}
      </p>
    </div>
  );
}
