import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FactorialVisualizer() {
  const [number, setNumber] = useState(5);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Recursive factorial function with step tracking
  const factorial = (n, path = []) => {
    path.push(`factorial(${n}) called`);
    if (n === 0 || n === 1) {
      path.push(`return 1`);
      return { result: 1, path };
    }
    const next = factorial(n - 1, path);
    const res = n * next.result;
    path.push(`return ${n} * factorial(${n - 1}) = ${res}`);
    return { result: res, path };
  };

  // Start visualization
  const handleStart = () => {
    if (number < 0) return alert("Please enter a non-negative number");
    const { result, path } = factorial(Number(number));
    setSteps(path);
    setResult(result);
    setCurrentStep(0);
    setIsRunning(true);
  };

  // Step-by-step animation
  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, steps]);

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gray-900 text-white">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-6 text-yellow-400"
      >
        🧠 Factorial Recursion Visualizer
      </motion.h1>

      {/* Input and Button */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          className="p-2 rounded text-black w-32"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          min="0"
        />
        <button
          onClick={handleStart}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-semibold"
        >
          Visualize
        </button>
      </div>

      {/* Algorithm Code Block */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl mb-8">
        <h2 className="text-lg font-semibold text-yellow-300 mb-3">
          📘 Factorial Algorithm:
        </h2>
        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
{`function factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)`}
        </pre>
      </div>

      {/* Recursive Steps Visualization */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-lg font-semibold text-yellow-300 mb-3">
          🔁 Recursive Steps:
        </h2>
        <ul className="space-y-2">
          {steps.slice(0, currentStep).map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-2 rounded ${
                step.includes("return")
                  ? "bg-green-700"
                  : "bg-gray-700"
              }`}
            >
              {step}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Final Result */}
      {currentStep === steps.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 text-2xl font-bold text-green-400"
        >
          ✅ Final Result: {result}
        </motion.div>
      )}
    </div>
  );
}
