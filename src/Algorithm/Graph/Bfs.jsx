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
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        🔍 BFS Visualizer (Queue Table)
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

      {/* Graph Visualization */}
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
            stroke="#4ade80"
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
                fill={isVisited ? "#3b82f6" : "#64748b"}
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

      {/* Queue Table */}
      <div className="mt-8 w-full max-w-md overflow-x-auto">
        <table className="table-auto w-full text-center border-collapse border border-gray-600">
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
