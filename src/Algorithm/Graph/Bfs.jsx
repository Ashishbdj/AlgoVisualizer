import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function BFSVisualizer() {
  const graph = {
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F"],
    D: [],
    E: ["F"],
    F: [],
  };
  const startNode = "A";

  const [steps, setSteps] = useState([]);
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef(null);

  const generateBFSSteps = () => {
    const queue = [startNode];
    const visited = [];
    const steps = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!visited.includes(current)) {
        visited.push(current);
        steps.push({
          step: steps.length + 1,
          node: current,
          queue: [...queue],
          visited: [...visited],
          description: `Visited node ${current}. Added its unvisited neighbors (${graph[current].filter(n => !visited.includes(n)).join(", ") || "none"}) to the queue.`,
        });

        graph[current].forEach((neighbor) => {
          if (!visited.includes(neighbor) && !queue.includes(neighbor)) {
            queue.push(neighbor);
          }
        });
      }
    }
    return steps;
  };

  useEffect(() => {
    const s = generateBFSSteps();
    setSteps(s);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            setVisited(steps[prev].visited);
            setQueue(steps[prev].queue);
            return prev + 1;
          } else {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1500);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps]);

  const handlePlayPause = () => {
    if (currentStep >= steps.length) {
      setVisited([]);
      setQueue([]);
      setCurrentStep(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setVisited(steps[currentStep].visited);
      setQueue(steps[currentStep].queue);
      setCurrentStep((c) => c + 1);
    }
  };

  const handleReset = () => {
    setVisited([]);
    setQueue([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nodePositions = {
    A: { x: 350, y: 80 },
    B: { x: 250, y: 200 },
    C: { x: 450, y: 200 },
    D: { x: 180, y: 320 },
    E: { x: 300, y: 320 },
    F: { x: 450, y: 320 },
  };

  const edges = [];
  Object.keys(graph).forEach((from) => {
    graph[from].forEach((to) => {
      edges.push({
        from,
        to,
        x1: nodePositions[from].x,
        y1: nodePositions[from].y,
        x2: nodePositions[to].x,
        y2: nodePositions[to].y,
      });
    });
  });

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
      {/* 🔹 Header */}
      <header className="text-center py-4 bg-gray-800 text-blue-400 text-3xl font-bold shadow-md">
        🔍 BFS Algorithm Visualizer
      </header>

      <div className="flex flex-1">
        {/* LEFT PANEL */}
        <div className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
          {/* Graph */}
          <div className="flex justify-center mb-8">
            <svg
              width="650"
              height="450"
              viewBox="0 0 650 450"
              className="bg-gray-900 rounded-xl shadow-lg border border-gray-700"
            >
              {edges.map((edge, i) => (
                <line
                  key={i}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke="#60a5fa"
                  strokeWidth="2"
                  opacity="0.8"
                />
              ))}
              {Object.keys(nodePositions).map((node) => {
                const { x, y } = nodePositions[node];
                const isVisited = visited.includes(node);
                return (
                  <motion.g key={node} animate={{ scale: isVisited ? 1.2 : 1 }}>
                    <circle
                      cx={x}
                      cy={y}
                      r="25"
                      fill={isVisited ? "#3b82f6" : "#64748b"}
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y + 5}
                      textAnchor="middle"
                      fontSize="18"
                      fontWeight="bold"
                      fill="white"
                    >
                      {node}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-6 justify-center">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg"
            >
              ⏭ Next
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
            >
              🔁 Reset
            </button>
          </div>

          {/* Traversal Log */}
          <h2 className="text-xl font-semibold text-blue-300 mb-2 text-center">
            BFS Traversal Log
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="table-auto w-full text-center border-collapse border border-gray-600 text-sm">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 px-2 py-1">Step</th>
                  <th className="border border-gray-600 px-2 py-1">Visited Node</th>
                  <th className="border border-gray-600 px-2 py-1">Queue</th>
                </tr>
              </thead>
              <tbody>
                {steps.slice(0, currentStep).map((s, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx === currentStep - 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800"
                    }
                  >
                    <td className="border border-gray-600 px-2 py-1">{s.step}</td>
                    <td className="border border-gray-600 px-2 py-1">{s.node}</td>
                    <td className="border border-gray-600 px-2 py-1">
                      {s.queue.join(", ") || "Empty"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Step Description */}
          {steps[currentStep - 1] && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gray-700 rounded-lg text-gray-200 shadow-md text-center mb-6"
            >
              <p>
                <strong>Step {currentStep}:</strong>{" "}
                {steps[currentStep - 1].description}
              </p>
            </motion.div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 bg-gray-800 p-6 flex flex-col items-center justify-start overflow-y-auto">
          {/* Definition */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 w-full">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              📖 Definition
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Breadth First Search (BFS) is a graph traversal algorithm that explores all neighbors of a node before moving to the next level.
              It uses a queue data structure to keep track of nodes to be visited next.
            </p>
          </div>

          {/* Complexity */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 w-full">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              ⏱️ Time & Space Complexity
            </h2>
            <ul className="text-sm text-gray-300 list-disc pl-6">
              <li>Time Complexity: O(V + E)</li>
              <li>Space Complexity: O(V)</li>
            </ul>
          </div>

          {/* Pseudocode */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 w-full">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              📜 Pseudocode (BFS)
            </h2>
            <pre className="bg-gray-900 p-4 rounded-lg shadow-lg w-full text-sm">
{`procedure BFS(G, start):
  create queue Q
  enqueue start to Q
  mark start visited
  while Q is not empty:
      node ← dequeue(Q)
      for each unvisited neighbor of node:
          mark neighbor visited
          enqueue neighbor`}
            </pre>
          </div>

          {/* Applications */}
          <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-full">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              🌍 Real-world Applications
            </h2>
            <ul className="text-sm text-gray-300 list-disc pl-6">
              <li>Shortest path in unweighted graphs</li>
              <li>Social networking site suggestions</li>
              <li>Web crawlers</li>
              <li>Broadcasting in networks</li>
              <li>Solving puzzles like 8-puzzle</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
