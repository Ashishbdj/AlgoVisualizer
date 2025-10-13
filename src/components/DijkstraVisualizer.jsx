import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function DijkstraVisualizer() {
  // Default graph
  const defaultGraph = {
    A: { B: 2, C: 4 },
    B: { A: 2, C: 1, D: 7 },
    C: { A: 4, B: 1, D: 3 },
    D: { B: 7, C: 3 },
  };

  const defaultPositions = {
    A: { x: 100, y: 50 },
    B: { x: 300, y: 50 },
    C: { x: 100, y: 200 },
    D: { x: 300, y: 200 },
  };

  const [graph, setGraph] = useState(defaultGraph);
  const [positions, setPositions] = useState(defaultPositions);
  const [nodes, setNodes] = useState(Object.keys(defaultGraph));

  const [distances, setDistances] = useState({});
  const [visited, setVisited] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [nodeInput, setNodeInput] = useState("");
  const [edgeInput, setEdgeInput] = useState("");

  const timerRef = useRef(null);

  // Initialize distances
  const initialize = (start) => {
    const initialDistances = {};
    nodes.forEach((node) => (initialDistances[node] = Infinity));
    initialDistances[start] = 0;
    setDistances(initialDistances);
    setVisited([]);
    setCurrentNode(start);
  };

  // One step of Dijkstra
  const nextStep = () => {
    if (!currentNode) return;
    const neighbors = graph[currentNode];
    const newDistances = { ...distances };

    for (const neighbor in neighbors) {
      if (!visited.includes(neighbor)) {
        newDistances[neighbor] = Math.min(
          newDistances[neighbor],
          distances[currentNode] + neighbors[neighbor]
        );
      }
    }

    setDistances(newDistances);
    setVisited((prev) => [...prev, currentNode]);

    const unvisitedNodes = nodes.filter((n) => !visited.includes(n) && n !== currentNode);
    if (unvisitedNodes.length === 0) {
      setCurrentNode(null);
      return;
    }

    const nextNode = unvisitedNodes.reduce(
      (minNode, node) => (newDistances[node] < newDistances[minNode] ? node : minNode),
      unvisitedNodes[0]
    );
    setCurrentNode(nextNode);
  };

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextStep, 800);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, currentNode, distances, visited]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => initialize(nodes[0]) && setIsPlaying(false);

  // Handle custom node input
  const handleNodeInput = () => {
    if (!nodeInput) return;
    const newNodes = nodeInput.split(",").map((n) => n.trim().toUpperCase()).filter((n) => n);
    if (newNodes.length > 0) {
      const newGraph = {};
      const newPositions = {};
      newNodes.forEach((n, idx) => {
        newGraph[n] = {};
        newPositions[n] = { x: 100 + (idx % 5) * 100, y: 50 + Math.floor(idx / 5) * 150 };
      });
      setNodes(newNodes);
      setGraph(newGraph);
      setPositions(newPositions);
      setDistances({});
      setVisited([]);
      setCurrentNode(null);
    }
    setNodeInput("");
  };

  // Handle custom edge input
  // Format: "A-B-2,C-D-3,B-C-5" => edge from A to B with weight 2, etc.
  const handleEdgeInput = () => {
    if (!edgeInput) return;
    const newGraph = { ...graph };
    edgeInput.split(",").forEach((edge) => {
      const [from, to, weight] = edge.split("-").map((s) => s.trim());
      if (from && to && weight) {
        if (!newGraph[from]) newGraph[from] = {};
        if (!newGraph[to]) newGraph[to] = {};
        newGraph[from][to] = parseInt(weight);
        newGraph[to][from] = parseInt(weight); // assuming undirected
      }
    });
    setGraph(newGraph);
    setEdgeInput("");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2 className="text-3xl font-bold text-indigo-600 mb-4">Dijkstra's Algorithm</h2>

      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-3xl text-gray-700 mb-6">
        <h3 className="text-xl font-semibold mb-2">Overview:</h3>
        <p className="mb-2">
          Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph without negative weights.
        </p>
        <h3 className="text-xl font-semibold mb-2">How it Works:</h3>
        <ol className="list-decimal list-inside mb-2">
          <li>Initialize distances to all nodes as infinity except the start node (0).</li>
          <li>Pick the unvisited node with the smallest distance.</li>
          <li>Update distances of its neighbors if a shorter path is found.</li>
          <li>Mark node as visited and repeat until all nodes are visited.</li>
        </ol>
        <h3 className="text-xl font-semibold mb-2">Time Complexity:</h3>
        <p>
          Using array: <strong>O(V^2)</strong>, Using min-priority queue: <strong>O((V+E) log V)</strong>
        </p>
      </div>

      {/* Custom Graph Input */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter nodes (e.g., A,B,C,D)"
          value={nodeInput}
          onChange={(e) => setNodeInput(e.target.value)}
          className="border rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleNodeInput} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Add Nodes
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <input
          type="text"
          placeholder="Enter edges (e.g., A-B-2,B-C-3)"
          value={edgeInput}
          onChange={(e) => setEdgeInput(e.target.value)}
          className="border rounded-lg p-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={handleEdgeInput} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Add Edges
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button onClick={() => initialize(nodes[0])} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          Start from {nodes[0]}
        </button>
        <button onClick={nextStep} disabled={!currentNode} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300">
          Next Step
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className={`px-4 py-2 rounded-lg text-white transition ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
          Reset
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="relative w-[500px] h-[300px] border border-gray-300 rounded-lg mt-4">
        {nodes.map((node) =>
          Object.entries(graph[node]).map(([neighbor, weight], idx) => {
            if (nodes.indexOf(neighbor) < nodes.indexOf(node)) return null;
            const start = positions[node];
            const end = positions[neighbor];
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <div key={`${node}-${neighbor}-${idx}`} className="absolute w-full h-full">
                <svg className="absolute w-full h-full">
                  <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="gray" strokeWidth="2" />
                  <text x={midX} y={midY - 5} fill="black" fontSize="14" fontWeight="bold" textAnchor="middle">{weight}</text>
                </svg>
              </div>
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
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-pointer ${isCurrent ? "bg-yellow-400" : isVisited ? "bg-green-500" : "bg-blue-500"}`}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
            >
              {node}
              <div className="absolute -bottom-6 text-black font-semibold text-sm">
                {distances[node] === Infinity ? "∞" : distances[node]}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-1"><div className="w-4 h-4 bg-yellow-400 rounded" /> Current Node</div>
        <div className="flex items-center gap-1"><div className="w-4 h-4 bg-green-500 rounded" /> Visited</div>
        <div className="flex items-center gap-1"><div className="w-4 h-4 bg-blue-500 rounded" /> Unvisited</div>
      </div>
    </div>
  );
}
