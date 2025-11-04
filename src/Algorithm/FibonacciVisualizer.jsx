import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FibonacciVisualizer() {
  const [number, setNumber] = useState(5);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Recursive Fibonacci with step tracking
  const fibonacci = (n, path = []) => {
    path.push(`🌀 fib(${n}) called`);
    if (n === 0) {
      path.push(`🟩 return 0`);
      return { result: 0, path };
    }
    if (n === 1) {
      path.push(`🟩 return 1`);
      return { result: 1, path };
    }

    const left = fibonacci(n - 1, path);
    const right = fibonacci(n - 2, path);
    const res = left.result + right.result;

    path.push(`✨ fib(${n - 1}) + fib(${n - 2}) = ${res}`);
    path.push(`🔙 return ${res} to fib(${n + 1} or parent call)`);
    return { result: res, path };
  };

  // Start visualization (clear old output first)
  const handleStart = () => {
    if (number < 0) return alert("Please enter a non-negative number");

    // Clear previous output
    setSteps([]);
    setCurrentStep(0);
    setResult(null);
    setIsRunning(false);

    // Short delay to show reset animation before new data appears
    setTimeout(() => {
      const { result, path } = fibonacci(Number(number));
      setSteps(path);
      setResult(result);
      setIsRunning(true);
    }, 300);
  };

  // Auto-step animation
  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isRunning, currentStep, steps]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
      >
        🌀 Fibonacci Recursion Visualizer
      </motion.h1>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3 mb-8"
      >
        <input
          type="number"
          className="p-2 rounded-lg text-black w-36 font-semibold text-center"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          min="0"
        />
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300"
        >
          🚀 Visualize
        </button>
      </motion.div>

      {/* Code Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 p-5 rounded-2xl shadow-lg w-full max-w-xl mb-8 border border-cyan-600"
      >
        <h2 className="text-lg font-semibold text-cyan-300 mb-2">
          📘 Fibonacci Algorithm
        </h2>
        <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-x-auto text-sm font-mono leading-relaxed">
{`function fib(n):
    if n == 0: return 0
    if n == 1: return 1
    return fib(n - 1) + fib(n - 2)`}
        </pre>
      </motion.div>

      {/* Recursive Step Display */}
      <div className="relative bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-xl border border-blue-700 min-h-[250px]">
        <h2 className="text-lg font-semibold text-cyan-300 mb-4">
          🔁 Step-by-Step Recursion Flow:
        </h2>

        <div className="flex flex-col gap-3">
          {steps.slice(0, currentStep).map((step, index) => {
            const isReturn = step.includes("return");
            const isCombine = step.includes("=");
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg shadow-md text-sm sm:text-base font-mono ${
                  isReturn
                    ? "bg-green-700 text-green-100"
                    : isCombine
                    ? "bg-blue-700 text-blue-100"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {step}
              </motion.div>
            );
          })}
        </div>

        {steps.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Step {currentStep} / {steps.length}
          </p>
        )}
      </div>

      {/* Final Result */}
      {currentStep === steps.length && steps.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mt-10 text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          ✅ Final Result: <span className="text-white">{result}</span>
        </motion.div>
      )}
    </div>
  );
}
