import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const algorithms = [
    { name: "Bubble Sort", desc: "Simple comparison-based sorting algorithm.", path: "bubble-sort" },
    { name: "Dijkstra's Algorithm", desc: "Finds shortest path in a graph.", path: "dijkstra" },
    { name: "Merge Sort", desc: "Divide-and-conquer sorting algorithm.", path: "merge-sort" },
    { name: "Quick Sort", desc: "Efficient recursive sorting algorithm.", path: "quick-sort" },
    { name: "Binary Search", desc: "Efficient search on sorted data.", path: "binary-search" },
    { name: "DFS Traversal", desc: "Graph traversal using depth-first search.", path: "dfs" },
  ];

  const handleCardClick = (algo) => {
    navigate(`/algorithm/${algo.path}`);
  };

  const particleCount = 20;
  const particles = Array.from({ length: particleCount });

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative flex flex-col items-center justify-center h-[50vh] text-center px-4 overflow-hidden rounded-b-3xl"
        style={{ background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)" }}
      >
        {particles.map((_, idx) => {
          const xOffset = (mousePos.x / window.innerWidth - 0.5) * 30;
          const yOffset = (mousePos.y / window.innerHeight - 0.5) * 30;
          const randomX = Math.random() * window.innerWidth;
          const randomY = Math.random() * 200;
          return (
            <motion.div
              key={idx}
              className="absolute w-2 h-2 bg-white rounded-full opacity-40"
              initial={{ x: randomX, y: randomY }}
              animate={{ x: randomX + xOffset, y: randomY + yOffset }}
              transition={{
                repeat: Infinity,
                duration: 4 + Math.random() * 2,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />
          );
        })}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 z-10"
        >
          Algorithm Visualizer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl z-10"
        >
          Learn and understand algorithms with live visualizations. Click any card below to explore!
        </motion.p>
      </section>

      {/* ALGORITHM CARDS */}
      <section
        id="categories"
        className="flex-1 w-full px-6 sm:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {algorithms.map((algo, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleCardClick(algo)}
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 transition cursor-pointer"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              {algo.name}
            </h2>
            <p className="text-gray-600 text-sm">{algo.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Algorithm Visualizer | Built with ❤️ using MERN Stack
      </footer>
    </div>
  );
}
