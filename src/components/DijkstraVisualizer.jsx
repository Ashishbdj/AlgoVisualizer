// DijkstraVisualizer.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DijkstraVisualizer() {
  const defaultGraph = {
    A: { B: 2, C: 4 },
    B: { A: 2, C: 1, D: 7 },
    C: { A: 4, B: 1, D: 3 },
    D: { B: 7, C: 3 },
  };

  const defaultPositions = {
    A: { x: 100, y: 80 },
    B: { x: 300, y: 80 },
    C: { x: 100, y: 220 },
    D: { x: 300, y: 220 },
  };

  const [graph, setGraph] = useState(defaultGraph);
  const [positions] = useState(defaultPositions);
  const [nodes] = useState(Object.keys(defaultGraph));

  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [logs, setLogs] = useState([]); // ✅ Step comments
  const timerRef = useRef(null);

  // Initialize
  const initialize = (start) => {
    const dist = {};
    nodes.forEach((n) => (dist[n] = Infinity));
    dist[start] = 0;
    setDistances(dist);
    setVisited([]);
    setCurrentNode(start);
    setLogs([`🔹 Starting from node ${start}`]);
  };

  // Step
  const nextStep = () => {
    if (!currentNode) return;

    const neighbors = graph[currentNode];
    const newDist = { ...distances };
    const newLogs = [...logs, `➡️ Visiting node ${currentNode}`];

    // Relax edges
    for (const neighbor in neighbors) {
      if (!visited.includes(neighbor)) {
        const newDistance = distances[currentNode] + neighbors[neighbor];
        if (newDistance < newDist[neighbor]) {
          newDist[neighbor] = newDistance;
          newLogs.push(
            `✅ Updated distance of ${neighbor} → ${newDistance} (via ${currentNode})`
          );
        }
      }
    }

    setDistances(newDist);
    setVisited((prev) => [...prev, currentNode]);

    const unvisited = nodes.filter((n) => !visited.includes(n) && n !== currentNode);
    if (unvisited.length === 0) {
      setCurrentNode(null);
      newLogs.push("🏁 Algorithm completed — all nodes visited!");
      setLogs(newLogs);
      return;
    }

    // Find next node with smallest distance
    const next = unvisited.reduce(
      (min, node) => (newDist[node] < newDist[min] ? node : min),
      unvisited[0]
    );

    newLogs.push(`➡️ Next node to visit: ${next}`);
    setCurrentNode(next);
    setLogs(newLogs);
  };

  // Auto-play mode
  useEffect(() => {
    if (isPlaying) timerRef.current = setInterval(nextStep, 1200);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentNode, distances, visited]);

  const reset = () => {
    initialize(nodes[0]);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      {/* Header */}
      <header className="text-center py-5 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide">Dijkstra's Algorithm Visualizer</h1>
        <p className="text-sm text-gray-200">
          Step-by-step visualization of shortest path algorithm.
        </p>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Left Section */}
        <section className="flex-[0.5] bg-[#1e293b] rounded-2xl p-4 shadow-inner flex flex-col items-center justify-center border border-indigo-900">
          {/* Graph Area */}
          <div className="relative w-[500px] h-[300px] bg-[#0f172a] rounded-lg border border-indigo-800">
            {/* Edges */}
            {nodes.map((node) =>
              Object.entries(graph[node]).map(([neighbor, weight], idx) => {
                if (nodes.indexOf(neighbor) < nodes.indexOf(node)) return null;
                const start = positions[node];
                const end = positions[neighbor];
                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;
                return (
                  <svg key={`${node}-${neighbor}-${idx}`} className="absolute w-full h-full">
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke="gray"
                      strokeWidth="2"
                    />
                    <text
                      x={midX}
                      y={midY - 5}
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {weight}
                    </text>
                  </svg>
                );
              })
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = positions[node];
              const isCurrent = node === currentNode;
              const isVisited = visited.includes(node);
              return (
                <motion.div
                  key={node}
                  style={{ left: pos.x - 20, top: pos.y - 20 }}
                  className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-pointer ${
                    isCurrent
                      ? "bg-yellow-400"
                      : isVisited
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  animate={{ scale: isCurrent ? 1.2 : 1 }}
                >
                  {node}
                  <div className="absolute -bottom-6 text-gray-200 font-semibold text-sm">
                    {distances[node] === Infinity ? "∞" : distances[node]}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => initialize(nodes[0])}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Start
            </button>
            <button
              onClick={nextStep}
              disabled={!currentNode}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-500"
            >
              Next
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isPlaying
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button
              onClick={reset}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Right Section */}
        <aside className="flex-[0.5] bg-[#1e293b] rounded-2xl shadow-lg p-6 overflow-y-auto border border-indigo-900">
          <h2 className="text-3xl font-bold mb-4 text-indigo-300">
            📘 Dijkstra's Algorithm
          </h2>
          <p className="text-gray-300 mb-4">
            Dijkstra’s Algorithm finds the shortest path from a source node to all
            other nodes in a weighted graph (with no negative weights).
          </p>

          {/* Pseudocode */}
          <h3 className="text-2xl font-semibold mb-3 text-indigo-300">🧾 Pseudocode</h3>
          <pre className="bg-[#0f172a] text-green-400 p-4 rounded-lg mb-5 text-sm leading-6">
{`Dijkstra(Graph, source):
  for each vertex v in Graph:
      dist[v] ← ∞
      prev[v] ← undefined
  dist[source] ← 0

  while unvisited vertices remain:
      u ← vertex with smallest dist[]
      for each neighbor v of u:
          alt ← dist[u] + weight(u, v)
          if alt < dist[v]:
              dist[v] ← alt
              prev[v] ← u
      mark u as visited`}
          </pre>

          {/* Logs Section */}
          <h3 className="text-2xl font-semibold mb-3 text-indigo-300">🪶 Step Comments</h3>
          <div className="bg-[#0f172a] p-4 rounded-lg mb-5 h-48 overflow-y-auto text-gray-200 border border-indigo-700">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic">Run the algorithm to see steps...</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="text-sm mb-1">
                  {log}
                </p>
              ))
            )}
          </div>

          {/* Legend */}
          <h3 className="text-2xl font-semibold mb-3 text-indigo-300">🎨 Legend</h3>
          <div className="flex flex-col gap-2 text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded" /> Current Node
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" /> Visited Node
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" /> Unvisited Node
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
