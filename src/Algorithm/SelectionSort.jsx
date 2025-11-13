import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function SelectionSort({ initialData }) {
  const defaultArray = initialData || [64, 25, 12, 22, 11];

  const [array, setArray] = useState([...defaultArray]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const timerRef = useRef(null);

  // Generate all steps for Selection Sort
  const generateSteps = (arr) => {
    const stepsArr = [];
    const a = [...arr];
    for (let i = 0; i < a.length - 1; i++) {
      let minIndex = i;
      stepsArr.push({
        array: [...a],
        comparing: [i],
        swapped: [],
        message: `Starting with index ${i}, assume ${a[i]} as the minimum.`,
      });

      for (let j = i + 1; j < a.length; j++) {
        stepsArr.push({
          array: [...a],
          comparing: [minIndex, j],
          swapped: [],
          message: `Compare ${a[minIndex]} and ${a[j]}`,
        });
        if (a[j] < a[minIndex]) {
          minIndex = j;
          stepsArr.push({
            array: [...a],
            comparing: [i, minIndex],
            swapped: [],
            message: `New minimum found: ${a[minIndex]} at index ${minIndex}`,
          });
        }
      }

      if (minIndex !== i) {
        [a[i], a[minIndex]] = [a[minIndex], a[i]];
        stepsArr.push({
          array: [...a],
          comparing: [i, minIndex],
          swapped: [i, minIndex],
          message: `Swap ${a[minIndex]} and ${a[i]}`,
        });
      }
    }

    stepsArr.push({
      array: [...a],
      comparing: [],
      swapped: [],
      message: "Array sorted!",
    });
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
      }, 500);
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
  const reset = () => { setCurrentStep(0); setIsPlaying(false); };
  const togglePlay = () => setIsPlaying(!isPlaying);

  const stepData = steps[currentStep] || {
    array: array,
    comparing: [],
    swapped: [],
    message: "",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-indigo-600 text-center mb-6">
        Selection Sort Visualizer
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Visualization */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-lg border border-gray-200">
         

          {/* User Input */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6 items-center">
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

          {/* Visualization Bars */}
          <div className="flex flex-row gap-4 justify-center items-end h-40">
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
                    className={`${color} w-8 rounded-t-lg`}
                  />
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-6 justify-center flex-wrap">
            <button
              onClick={goPrev}
              className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Previous
            </button>
            <button
              onClick={togglePlay}
              className={`px-6 py-2 rounded-lg text-white transition ${
                isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={goNext}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Next
            </button>
            <button
              onClick={reset}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>

          <p className="text-gray-600 mt-2">
            Step {currentStep + 1} / {steps.length}
          </p>
           <p className="text-gray-700 mb-4 font-semibold">{stepData.message}</p>
        </div>

        {/* Right Column: Information */}
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg border border-gray-200 space-y-4">
          <h2 className="text-5xl font-bold text-indigo-600">Selection Sort</h2>
          <p className="text-gray-700 text-4xl ">
            Selection Sort is a comparison-based sorting algorithm that divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted portion and moves it to the sorted portion.
          </p>

          <h3 className="text-5xl font-semibold text-indigo-500">Pseudocode:</h3>
          <pre className="bg-gray-100 p-3 rounded text-4xl text-gray-800">
{`for i = 0 to n-1:
    minIndex = i
    for j = i+1 to n:
        if array[j] < array[minIndex]:
            minIndex = j
    swap(array[i], array[minIndex])`}
          </pre>

          <h3 className="text-5xl font-semibold text-indigo-500">Time Complexity:</h3>
          <ul className="list-disc text-4xl list-inside text-gray-700">
            <li>Best Case: O(n²)</li>
            <li>Average Case: O(n²)</li>
            <li>Worst Case: O(n²)</li>
          </ul>

          <h3 className="text-5xl font-semibold text-indigo-500">Space Complexity:</h3>
          <p className="text-gray-700 text-4xl">O(1)</p>

          <h3 className="text-5xl font-semibold text-indigo-500">Use Cases:</h3>
          <ul className="list-disc list-inside text-4xl text-gray-700">
            <li>Small arrays</li>
            <li>When memory is limited</li>
            <li>Educational purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
