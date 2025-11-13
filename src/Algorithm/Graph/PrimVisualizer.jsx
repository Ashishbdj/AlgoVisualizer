import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const defaultGraph = {
  0: [{ to: 1, weight: 2 }, { to: 3, weight: 6 }],
  1: [
    { to: 0, weight: 2 },
    { to: 2, weight: 3 },
    { to: 3, weight: 8 },
    { to: 4, weight: 5 },
  ],
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

  // Generate Prim's algorithm steps
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

  // Auto-play logic
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

  const getNodePositions = (n, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 100;
    const positions = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    return positions;
  };

  const nodeCount = Object.keys(graph).length;
  const nodePositions = getNodePositions(nodeCount, 900, 600);

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* HEADER */}
      <div className="text-center py-6 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
        <h1 className="text-4xl font-bold text-white">
          Prim's Algorithm Visualizer
        </h1>
        <p className="text-gray-200 text-sm mt-1">
          Understand Prim's Algorithm step by step with visualization and pseudocode
        </p>
      </div>

      {/* MAIN CONTENT - Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDE - VISUALIZER */}
        <div className="w-1/2 flex flex-col justify-center items-center border-r border-gray-700 p-6">
          {/* Controls */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
            >
              Next
            </button>
            <button
              onClick={handlePlayPause}
              className={`px-4 py-2 rounded transition ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Reset
            </button>
          </div>

          {/* Graph Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex justify-center items-center">
            <svg width="900" height="600">
              {/* Edges */}
              {Object.keys(graph).map((from) =>
                graph[from].map(({ to, weight }) => {
                  const inMST = mstEdges.some(
                    (e) =>
                      (e.from === Number(from) && e.to === to) ||
                      (e.from === to && e.to === Number(from))
                  );
                  const color = inMST ? "#facc15" : "#6b7280";
                  const fromPos = nodePositions[from];
                  const toPos = nodePositions[to];
                  return (
                    <g key={`${from}-${to}`}>
                      <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke={color}
                        strokeWidth={inMST ? 4 : 2}
                      />
                      <text
                        x={(fromPos.x + toPos.x) / 2}
                        y={(fromPos.y + toPos.y) / 2 - 10}
                        fill="#ddd"
                        fontSize="14"
                        textAnchor="middle"
                      >
                        {graph[from].find((e) => e.to === to)?.weight}
                      </text>
                    </g>
                  );
                })
              )}

              {/* Nodes */}
              {nodePositions.map((pos, idx) => (
                <g key={idx}>
                  <circle cx={pos.x} cy={pos.y} r={35} fill="#3b82f6" />
                  <text
                    x={pos.x}
                    y={pos.y + 8}
                    textAnchor="middle"
                    fill="white"
                    fontWeight="bold"
                    fontSize="22"
                  >
                    {idx}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Step Message */}
          {steps[currentStep - 1] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-gray-700 p-4 rounded-lg w-3/4 text-yellow-400 font-medium text-center text-lg"
            >
              {steps[currentStep - 1].message}
            </motion.div>
          )}
        </div>

        {/* RIGHT SIDE - THEORY & PSEUDOCODE */}
        <div className="w-1/2 bg-gray-900 p-10 overflow-y-auto space-y-8">
         <div>
            <h2 className="text-3xl font-semibold text-blue-400 mb-3">
              🧩 Concept
            </h2>
            <p className="text-gray-300 text-lg">
              Prim’s Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST)
              of a connected weighted graph by always choosing the smallest edge connecting the
              visited and unvisited nodes.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold text-purple-400 mb-3">
              📘 Pseudocode
            </h2>
            <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg text-lg leading-relaxed">
{`Prim(G):
  Initialize MST = {}
  Choose an arbitrary start node
  Add all its edges to PQ

  while PQ not empty:
      pick edge (u,v) with smallest weight
      if v not visited:
          add edge (u,v) to MST
          add edges of v to PQ

  return MST`}
            </pre>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-green-400 mb-3">
              ⏱️ Time Complexity
            </h2>
            <ul className="list-disc list-inside text-gray-300 text-lg">
              <li>Adjacency matrix: <b>O(V²)</b></li>
              <li>Using priority queue: <b>O(E log V)</b></li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-yellow-400 mb-3">
              🌍 Real-world Applications
            </h2>
            <ul className="list-disc list-inside text-gray-300 text-lg">
              <li>Network design (LAN, WAN)</li>
              <li>Electrical wiring optimization</li>
              <li>Road network design</li>
              <li>Clustering in ML</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
