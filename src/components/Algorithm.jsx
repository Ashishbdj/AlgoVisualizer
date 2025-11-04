import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaSortAmountDown,
  FaCodeBranch,
  FaTree,
  FaProjectDiagram,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Algorithm() {
  const navigate = useNavigate();

  // 🔹 Full Algorithm List
  const algorithms = [
    // 🔍 Searching Algorithms
    {
      id: "linear-search",
      title: "Linear Search",
      category: "Searching",
      icon: <FaSearch className="text-blue-500 text-4xl" />,
      desc: "Sequentially checks each element until the target is found.",
    },
    {
      id: "binary-search",
      title: "Binary Search",
      category: "Searching",
      icon: <FaSearch className="text-green-500 text-4xl" />,
      desc: "Divide and conquer method for finding elements in sorted arrays.",
    },
    // 🔢 Sorting Algorithms
    {
      id: "bubble-sort",
      title: "Bubble Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-pink-500 text-4xl" />,
      desc: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    },
    {
      id: "selection-sort",
      title: "Selection Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-yellow-500 text-4xl" />,
      desc: "Finds the smallest element and places it at the beginning each pass.",
    },
    {
      id: "insertion-sort",
      title: "Insertion Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-orange-500 text-4xl" />,
      desc: "Builds the sorted array one element at a time.",
    },
    {
      id: "merge-sort",
      title: "Merge Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-purple-500 text-4xl" />,
      desc: "Divides array into halves, sorts recursively, and merges them.",
    },
    {
      id: "quick-sort",
      title: "Quick Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-teal-500 text-4xl" />,
      desc: "Uses a pivot to partition the array and recursively sorts subarrays.",
    },
    {
      id: "heap-sort",
      title: "Heap Sort",
      category: "Sorting",
      icon: <FaSortAmountDown className="text-emerald-500 text-4xl" />,
      desc: "Builds a heap and repeatedly extracts the maximum element.",
    },

    // 🔁 Recursion Algorithms
    
    {
      id: "factorial-recursion",
      title: "Factorial (Recursion)",
      category: "Recursion",
      icon: <FaCodeBranch className="text-red-500 text-4xl" />,
      desc: "Calculates factorial of n as n * factorial(n-1).",
    },
    {
      id: "fibonacci-recursion",
      title: "Fibonacci (Recursion)",
      category: "Recursion",
      icon: <FaCodeBranch className="text-lime-500 text-4xl" />,
      desc: "Generates Fibonacci sequence recursively using previous two terms.",
    },
    {
      id: "tower-of-hanoi",
      title: "Tower of Hanoi",
      category: "Recursion",
      icon: <FaCodeBranch className="text-amber-500 text-4xl" />,
      desc: "Moves disks between rods recursively following puzzle constraints.",
    },

    // 🌳 Tree Traversal Algorithms
    {
      id: "inorder-traversal",
      title: "Tree Traversal",
      category: "Tree",
      icon: <FaTree className="text-green-500 text-4xl" />,
      desc: "Visits left subtree, root, then right subtree (LNR).",
    }
    ,

    // 🌐 Graph Algorithms
    {
      id: "dfs",
      title: "Depth First Search (DFS)",
      category: "Graph",
      icon: <FaProjectDiagram className="text-indigo-500 text-4xl" />,
      desc: "Explores as far as possible along each branch before backtracking.",
    },
    {
      id: "bfs",
      title: "Breadth First Search (BFS)",
      category: "Graph",
      icon: <FaProjectDiagram className="text-sky-500 text-4xl" />,
      desc: "Explores all neighbors before moving to the next level.",
    },
    {
      id: "dijkstra",
      title: "Dijkstra’s Algorithm",
      category: "Graph",
      icon: <FaProjectDiagram className="text-yellow-500 text-4xl" />,
      desc: "Finds shortest paths from a source node to all others in a weighted graph.",
    },
    {
      id: "kruskal",
      title: "Kruskal’s Algorithm",
      category: "Graph",
      icon: <FaProjectDiagram className="text-green-600 text-4xl" />,
      desc: "Finds a Minimum Spanning Tree using a greedy approach with sorted edges.",
    },
    {
      id: "prim",
      title: "Prim’s Algorithm",
      category: "Graph",
      icon: <FaProjectDiagram className="text-red-600 text-4xl" />,
      desc: "Builds a Minimum Spanning Tree by adding the nearest vertex to the growing tree.",
    },
  ];

  const categories = ["All", "Searching", "Sorting", "Recursion", "Tree", "Graph"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlgorithms = algorithms.filter((algo) => {
    const matchesCategory =
      selectedCategory === "All" || algo.category === selectedCategory;
    const matchesSearch =
      algo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      algo.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (id) => {
    navigate(`/algorithm/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Algorithm Library
        </h1>
        <p className="text-gray-600 mb-6">
          Explore algorithms by category, search instantly, and learn efficiently.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6 relative">
          <input
            type="text"
            placeholder="Search algorithms..."
            className="w-full border border-gray-300 rounded-full px-5 py-2 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-lg" />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence>
          {filteredAlgorithms.map((algo) => (
            <motion.div
              key={algo.id}
              layout
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCardClick(algo.id)}
              className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {algo.icon}
                <h2 className="text-xl font-semibold text-gray-800">{algo.title}</h2>
                <p className="text-gray-600 text-sm">{algo.desc}</p>
                <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {algo.category}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
