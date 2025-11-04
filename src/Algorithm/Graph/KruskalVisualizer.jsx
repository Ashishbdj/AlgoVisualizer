import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function KruskalVisualizer() {
  const nodes = ["A", "B", "C", "D", "E"];
  const edges = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 5 },
    { from: "B", to: "D", weight: 10 },
    { from: "C", to: "D", weight: 3 },
    { from: "D", to: "E", weight: 7 },
    { from: "C", to: "E", weight: 8 },
  ];

  const nodePositions = {
    A: { x: 100, y: 100 },
    B: { x: 300, y: 100 },
    C: { x: 200, y: 200 },
    D: { x: 400, y: 200 },
    E: { x: 300, y: 300 },
  };

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [mstEdges, setMstEdges] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  // Union-Find functions
  const find = (parent, i) => {
    if (parent[i] === i) return i;
    return find(parent, parent[i]);
  };

  const union = (parent, rank, x, y) => {
    const xroot = find(parent, x);
    const yroot = find(parent, y);
    if (rank[xroot] < rank[yroot]) parent[xroot] = yroot;
    else if (rank[xroot] > rank[yroot]) parent[yroot] = xroot;
    else {
      parent[yroot] = xroot;
      rank[xroot]++;
    }
  };

  const generateKruskalSteps = () => {
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const parent = {};
    const rank = {};
    nodes.forEach((node) => {
      parent[node] = node;
      rank[node] = 0;
    });

    const stepsArr = [];
    const mst = [];

    sortedEdges.forEach((edge, idx) => {
      const x = find(parent, edge.from);
      const y = find(parent, edge.to);
      const step = {
        step: idx + 1,
        edge,
        included: false,
        mst: [...mst],
        description: `Considering edge ${edge.from}-${edge.to} with weight ${edge.weight}`,
      };
      if (x !== y) {
        union(parent, rank, x, y);
        mst.push(edge);
        step.included = true;
        step.mst = [...mst];
        step.description += " → added to MST.";
      } else {
        step.description += " → creates a cycle, skipped.";
      }
      stepsArr.push(step);
    });

    return stepsArr;
  };

  useEffect(() => {
    const s = generateKruskalSteps();
    setSteps(s);
    setMstEdges([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            setMstEdges(steps[prev].mst);
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
      setCurrentStep(0);
      setMstEdges([]);
    }
    setIsPlaying((p) => !p);
  };
  const handleNext = () => {
    if (currentStep < steps.length) {
      setMstEdges(steps[currentStep].mst);
      setCurrentStep((c) => c + 1);
    }
  };
  const handleReset = () => {
    setCurrentStep(0);
    setMstEdges([]);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        🌳 Kruskal's Algorithm Visualizer
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
      <svg width="600" height="400" className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
        {/* Edges */}
        {edges.map((edge, idx) => {
          const included = mstEdges.includes(edge);
          return (
            <line
              key={idx}
              x1={nodePositions[edge.from].x}
              y1={nodePositions[edge.from].y}
              x2={nodePositions[edge.to].x}
              y2={nodePositions[edge.to].y}
              stroke={included ? "#facc15" : "#64748b"}
              strokeWidth={included ? 4 : 2}
              opacity="0.8"
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((node) => {
          return (
            <motion.g key={node}>
              <circle
                cx={nodePositions[node].x}
                cy={nodePositions[node].y}
                r="22"
                fill="#818cf8"
                stroke="#1e293b"
                strokeWidth="2"
              />
              <text
                x={nodePositions[node].x}
                y={nodePositions[node].y + 5}
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
        {/* Weights */}
        {edges.map((edge, idx) => {
          const x = (nodePositions[edge.from].x + nodePositions[edge.to].x) / 2;
          const y = (nodePositions[edge.from].y + nodePositions[edge.to].y) / 2;
          return (
            <text key={`w${idx}`} x={x} y={y - 5} textAnchor="middle" fill="white">
              {edge.weight}
            </text>
          );
        })}
      </svg>

      {/* MST Table */}
      <div className="mt-6 w-full max-w-md overflow-x-auto">
        <table className="table-auto w-full text-center border-collapse border border-gray-600">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-2 py-1">Step</th>
              <th className="border border-gray-600 px-2 py-1">Edge</th>
              <th className="border border-gray-600 px-2 py-1">MST Edges</th>
            </tr>
          </thead>
          <tbody>
            {steps.slice(0, currentStep).map((s, idx) => (
              <tr
                key={idx}
                className={idx === currentStep - 1 ? "bg-yellow-600 text-black" : "bg-gray-800"}
              >
                <td className="border border-gray-600 px-2 py-1">{s.step}</td>
                <td className="border border-gray-600 px-2 py-1">{`${s.edge.from}-${s.edge.to}`}</td>
                <td className="border border-gray-600 px-2 py-1">
                  {s.mst.map((e) => `${e.from}-${e.to}`).join(", ") || "Empty"}
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
          {steps[currentStep - 1].description}
        </motion.div>
      )}
    </div>
  );
}
