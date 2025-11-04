import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Dfs() {
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
  const [stack, setStack] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef(null);

  // Generate DFS steps
  const generateDFSSteps = () => {
    const stack = [startNode];
    const visited = [];
    const steps = [];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!visited.includes(current)) {
        visited.push(current);
        steps.push({
          step: steps.length + 1,
          node: current,
          stack: [...stack],
          visited: [...visited],
          description: `Visited node ${current}. Added its unvisited neighbors (${graph[current].filter(n => !visited.includes(n)).join(", ") || "none"}) to the stack.`,
        });

        // push neighbors in reverse order to maintain correct DFS order
        [...graph[current]].reverse().forEach((neighbor) => {
          if (!visited.includes(neighbor) && !stack.includes(neighbor)) {
            stack.push(neighbor);
          }
        });
      }
    }

    return steps;
  };

  useEffect(() => {
    const s = generateDFSSteps();
    setSteps(s);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            setVisited(steps[prev].visited);
            setStack(steps[prev].stack);
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
      setStack([]);
      setCurrentStep(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setVisited(steps[currentStep].visited);
      setStack(steps[currentStep].stack);
      setCurrentStep((c) => c + 1);
    }
  };

  const handleReset = () => {
    setVisited([]);
    setStack([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nodePositions = {
    A: { x: 300, y: 60 },
    B: { x: 200, y: 160 },
    C: { x: 400, y: 160 },
    D: { x: 140, y: 260 },
    E: { x: 260, y: 260 },
    F: { x: 400, y: 260 },
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">
        🔎 DFS Visualizer (Stack Table)
      </h1>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
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

      {/* Graph */}
      <svg
        width="600"
        height="400"
        viewBox="0 0 600 400"
        className="bg-gray-800 rounded-xl shadow-lg border border-gray-700"
      >
        {edges.map((edge, i) => (
          <line
            key={i}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke="#a78bfa"
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
                r="22"
                fill={isVisited ? "#a78bfa" : "#64748b"}
                stroke="#1e293b"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="white"
              >
                {node}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Stack Table */}
      <div className="mt-8 w-full max-w-md overflow-x-auto">
        <table className="table-auto w-full text-center border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-2 py-1">Step</th>
              <th className="border border-gray-600 px-2 py-1">Visited Node</th>
              <th className="border border-gray-600 px-2 py-1">Stack</th>
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, currentStep).map((s, idx) => (
              <tr
                key={idx}
                className={
                  idx === currentStep - 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800"
                }
              >
                <td className="border border-gray-600 px-2 py-1">{s.step}</td>
                <td className="border border-gray-600 px-2 py-1">{s.node}</td>
                <td className="border border-gray-600 px-2 py-1">
                  {s.stack.join(", ") || "Empty"}
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
          className="mt-6 p-4 bg-gray-700 rounded-lg max-w-xl text-gray-200 shadow-md text-center"
        >
          <p>
            <strong>Step {currentStep}:</strong>{" "}
            {steps[currentStep - 1].description}
          </p>
        </motion.div>
      )}
    </div>
  );
}
