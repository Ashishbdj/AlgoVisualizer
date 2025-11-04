import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function InsertionSort({ initialData }) {
  const defaultArray = initialData || [50, 30, 40, 10, 60, 20];

  const [array, setArray] = useState([...defaultArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef(null);

  // 🔹 Generate all steps for Insertion Sort
  const generateSteps = (arr) => {
    const stepsArr = [];
    const a = [...arr];

    for (let i = 1; i < a.length; i++) {
      let key = a[i];
      let j = i - 1;

      stepsArr.push({
        array: [...a],
        comparing: [i],
        swapped: [],
        message: `Select key = ${key}`,
      });

      while (j >= 0 && a[j] > key) {
        stepsArr.push({
          array: [...a],
          comparing: [j, j + 1],
          swapped: [j, j + 1],
          message: `${a[j]} > ${key} → Shift ${a[j]} to the right`,
        });

        a[j + 1] = a[j];
        j--;
        stepsArr.push({
          array: [...a],
          comparing: [j + 1],
          swapped: [],
          message: `Array after shifting`,
        });
      }

      a[j + 1] = key;

      stepsArr.push({
        array: [...a],
        comparing: [j + 1],
        swapped: [j + 1],
        message: `Insert key ${key} at position ${j + 1}`,
      });
    }

    stepsArr.push({
      array: [...a],
      comparing: [],
      swapped: [],
      message: "✅ Array is fully sorted!",
    });

    return stepsArr;
  };

  // 🔹 Initialize steps
  useEffect(() => {
    const allSteps = generateSteps(array);
    setSteps(allSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [array]);

  // 🔹 Auto-play
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(timerRef.current);
          return prev;
        });
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps]);

  // 🔹 Handle user input
  const handleUserData = () => {
    if (!userInput) return;
    const userArray = userInput
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((n) => !isNaN(n));
    if (userArray.length > 0) setArray(userArray);
    setUserInput("");
  };

  // 🔹 Navigation
  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const stepData = steps[currentStep] || {
    array: array,
    comparing: [],
    swapped: [],
    message: "",
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* 🧩 Algorithm Description */}
      <div className="max-w-3xl text-left bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">Insertion Sort</h2>
        <p className="text-gray-700 mb-2">
          Insertion Sort builds the final sorted array one item at a time. It picks each element
          and inserts it into its correct position relative to the already-sorted portion of the array.
        </p>
        <h3 className="text-lg font-semibold text-indigo-500 mt-2">How it Works:</h3>
        <ol className="list-decimal list-inside text-gray-700 mb-2">
          <li>Start from the second element (key).</li>
          <li>Compare key with elements before it.</li>
          <li>Shift elements that are greater than key one position ahead.</li>
          <li>Insert the key at the correct location.</li>
        </ol>
        <p className="text-gray-700 font-semibold mt-2">{stepData.message}</p>
      </div>

      {/* 🧮 User input */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <input
          type="text"
          placeholder="Enter array (e.g., 5,3,8,1)"
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

      {/* 📊 Bars Visualization */}
      <div className="flex gap-2 h-44 items-end relative mt-4">
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

      {/* 🎮 Controls */}
      <div className="flex gap-4 mt-4 flex-wrap justify-center">
        <button
          onClick={goPrev}
          className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Next
        </button>
        <button
          onClick={togglePlay}
          className={`px-4 py-2 rounded-lg text-white transition ${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Step info */}
      <p className="text-gray-600 mt-2">
        Step {currentStep + 1} / {steps.length}
      </p>
    </div>
  );
}
