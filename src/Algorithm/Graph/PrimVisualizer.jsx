import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Example graph: adjacency list with weights
const defaultGraph = {
  0: [{ to: 1, weight: 2 }, { to: 3, weight: 6 }],
  1: [{ to: 0, weight: 2 }, { to: 2, weight: 3 }, { to: 3, weight: 8 }, { to: 4, weight: 5 }],
  2: [{ to: 1, weight: 3 }, { to: 4, weight: 7 }],
  3: [{ to: 0, weight: 6 }, { to: 1, weight: 8 }, { to: 4, weight: 9 }],
  4: [{ to: 1, weight: 5 }, { to: 2, weight: 7 }, { to: 3, weight: 9 }],
};

export default function PrimVisualizer() {
  const [graph] = useState(defaultGraph);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mstEdges, setMstEdges] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // Generate Prim's steps
  const generatePrimSteps = () => {
    const visited = new Set();
    const edges = [];
    const pq = [];
    const stepList = [];

    const addEdges = (node) => {
      visited.add(node);
      graph[node].forEach(({ to, weight }) => {
        if (!visited.has(to)) pq.push({ from: node, to, weight });
      });
    };

    addEdges(0);

    while (pq.length > 0) {
      pq.sort((a, b) => a.weight - b.weight);
      const edge = pq.shift();
      if (visited.has(edge.to)) continue;

      edges.push(edge);
      stepList.push({
        edge,
        mstEdges: [...edges],
        visited: new Set(visited),
        message: `Include edge (${edge.from} → ${edge.to}) with weight ${edge.weight}`,
      });

      addEdges(edge.to);
    }

    return stepList;
  };

  useEffect(() => {
    const s = generatePrimSteps();
    setSteps(s);
    setMstEdges([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            setMstEdges(steps[prev].mstEdges);
            return prev + 1;
          } else {
            clearInterval(timerRef.current);
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, steps]);

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleNext = () => {
    if (currentStep < steps.length) {
      setMstEdges(steps[currentStep].mstEdges);
      setCurrentStep((c) => c + 1);
    }
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setMstEdges([]);
  };

  // Auto-calculate node positions in a circle
  const getNodePositions = (n, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 50;
    const positions = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2; // start from top
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  };

  const nodeCount = Object.keys(graph).length;
  const nodePositions = getNodePositions(nodeCount, 600, 400); // adjust container size

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">
        🌐 Prim's Algorithm Visualizer
      </h1>

      {/* Controls */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={handleNext} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
          Next
        </button>
        <button
          onClick={handlePlayPause}
          className={`px-4 py-2 rounded ${
            isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={handleReset} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Reset
        </button>
        <div className="ml-4 text-gray-300">
          Step: {currentStep} / {steps.length}
        </div>
      </div>

      {/* Graph Visualization */}
      <div className="flex justify-center w-full mb-6">
        <div className="relative w-full max-w-3xl h-96 bg-gray-800 rounded-lg p-4 shadow-lg">
          <svg width="100%" height="100%">
            {/* Draw edges */}
            {Object.keys(graph).map((from) =>
              graph[from].map(({ to, weight }) => {
                const alreadyInMST = mstEdges.some(
                  (e) => (e.from === Number(from) && e.to === to) || (e.from === to && e.to === Number(from))
                );
                const color = alreadyInMST ? "#facc15" : "#6b7280";
                const fromPos = nodePositions[from];
                const toPos = nodePositions[to];
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={color}
                    strokeWidth={alreadyInMST ? 4 : 2}
                  />
                );
              })
            )}

            {/* Draw nodes */}
            {nodePositions.map((pos, idx) => (
              <g key={idx}>
                <circle cx={pos.x} cy={pos.y} r={20} fill="#3b82f6" />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fill="white" fontWeight="bold">
                  {idx}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Step Info Table */}
      <div className="overflow-x-auto w-full max-w-3xl">
        <table className="table-auto w-full text-white border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-2 py-1">Edge</th>
              <th className="border border-gray-600 px-2 py-1">Weight</th>
              <th className="border border-gray-600 px-2 py-1">Included in MST</th>
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, currentStep).map((step, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-gray-600 px-2 py-1">{`${step.edge.from} → ${step.edge.to}`}</td>
                <td className="border border-gray-600 px-2 py-1">{step.edge.weight}</td>
                <td className="border border-gray-600 px-2 py-1 text-yellow-400 font-semibold">Yes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Step message */}
      {steps[currentStep - 1] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-gray-700 p-3 rounded-lg w-full max-w-3xl text-yellow-400"
        >
          {steps[currentStep - 1].message}
        </motion.div>
      )}
    </div>
  );
}
