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
  const find = (parent, i) => (parent[i] === i ? i : find(parent, parent[i]));
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
        description: `Considering edge ${edge.from}-${edge.to} (weight ${edge.weight})`,
      };
      if (x !== y) {
        union(parent, rank, x, y);
        mst.push(edge);
        step.included = true;
        step.mst = [...mst];
        step.description += " → added to MST.";
      } else {
        step.description += " → forms a cycle, skipped.";
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Top Header */}
      <header className="text-center py-6 bg-gradient-to-r from-blue-700 to-indigo-700 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide">
          Kruskal's Algorithm Visualizer
        </h1>
        <p className="text-sm text-gray-200">
          Step-by-step visualization and explanation of Kruskal's Algorithm
        </p>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Side - Visualizer */}
        <section className="flex-1 bg-[#0f172a] rounded-2xl shadow-inner flex flex-col justify-center items-center border border-blue-900 p-4">
          {/* Controls */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-500"
            >
              ⏭ Next
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
            >
              🔁 Reset
            </button>
          </div>

          {/* Graph Visualization */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex justify-center items-center">
            <svg width="650" height="400">
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
              {nodes.map((node) => (
                <motion.g key={node}>
                  <circle
                    cx={nodePositions[node].x}
                    cy={nodePositions[node].y}
                    r="22"
                    fill="#3b82f6"
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
              ))}
              {/* Weights */}
              {edges.map((edge, idx) => {
                const x =
                  (nodePositions[edge.from].x + nodePositions[edge.to].x) / 2;
                const y =
                  (nodePositions[edge.from].y + nodePositions[edge.to].y) / 2;
                return (
                  <text
                    key={`w${idx}`}
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    fill="white"
                  >
                    {edge.weight}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Step Description */}
          {steps[currentStep - 1] && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gray-700 p-4 rounded-lg w-3/4 text-yellow-400 font-medium shadow text-center"
            >
              {steps[currentStep - 1].description}
            </motion.div>
          )}
        </section>

        {/* Right Side - Algorithm Concept */}
        <aside className="flex-1 bg-[#1e293b] rounded-2xl shadow-lg p-6 overflow-y-auto border border-blue-900">
          <h2 className="text-3xl font-bold mb-4 text-blue-300">📘 Kruskal’s Algorithm</h2>
          <p className="text-gray-300 mb-4">
            Kruskal’s algorithm is a **greedy algorithm** used to find the
            **Minimum Spanning Tree (MST)** of a connected, undirected, weighted
            graph. It adds edges in increasing order of weight while ensuring no
            cycles are formed.
          </p>

          <h3 className="text-2xl font-semibold mb-3 text-blue-300">🧾 Pseudocode</h3>
          <pre className="bg-[#0f172a] text-green-400 p-4 rounded-lg mb-5 text-sm leading-6 overflow-x-auto">
{`Kruskal(Graph):
  MST = {}
  sort all edges by increasing weight
  for each edge (u, v) in sorted order:
      if u and v are in different sets:
          add edge (u, v) to MST
          union(u, v)
  return MST`}
          </pre>

          <h3 className="text-2xl font-semibold mb-3 text-blue-300">⚙️ Concept</h3>
          <ol className="list-decimal list-inside text-gray-300 space-y-1 mb-5">
            <li>Sort all edges in increasing order of their weights.</li>
            <li>Pick the smallest edge that doesn’t form a cycle.</li>
            <li>Repeat until there are (V-1) edges in MST.</li>
          </ol>

          <h3 className="text-2xl font-semibold mb-3 text-blue-300">⏱️ Complexity</h3>
          <ul className="list-disc list-inside text-gray-300 mb-5">
            <li>Time: O(E log E) due to sorting edges</li>
            <li>Space: O(V) for disjoint-set structure</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 text-blue-300">🌍 Applications</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Network design (cables, roads, pipelines)</li>
            <li>Cluster analysis in ML</li>
            <li>Electrical circuit design</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
