import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import BubbleSortVisualizer from "../components/BubbleSortVisualizer";
import DijkstraVisualizer from "../components/DijkstraVisualizer";

export default function HomePage() {
  const initialArray = [50, 80, 30, 70, 60, 90, 40];
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const dijkstraRef = useRef(null);

  // Mouse position for interactive particles
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Dummy algorithm cards
  const algorithms = [
    { name: "Bubble Sort", desc: "Simple comparison-based sorting algorithm." },
    { name: "Dijkstra's Algorithm", desc: "Finds shortest path in a graph." },
    { name: "Merge Sort", desc: "Divide-and-conquer sorting algorithm." },
    { name: "Quick Sort", desc: "Efficient recursive sorting algorithm." },
    { name: "Binary Search", desc: "Efficient search on sorted data." },
    { name: "DFS Traversal", desc: "Graph traversal using depth-first search." },
  ];

  // Scroll to algorithm section
  const handleCardClick = (algo) => {
    setSelectedAlgorithm(algo.name);
    setTimeout(() => {
      if (dijkstraRef.current && algo.name === "Dijkstra's Algorithm") {
        dijkstraRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Particles for hero
  const particleCount = 20;
  const particles = Array.from({ length: particleCount });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      {/* NAVBAR */}
      <Navbar />

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
            className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl border border-gray-200 transition cursor-pointer"
            onClick={() => handleCardClick(algo)}
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              {algo.name}
            </h2>
            <p className="text-gray-600 text-sm">{algo.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Algorithm Visualizer Section */}
      <section ref={dijkstraRef} className="w-full px-6 sm:px-12 py-16">
        {selectedAlgorithm === "Bubble Sort" && <BubbleSortVisualizer initialData={initialArray} />}
        {selectedAlgorithm === "Dijkstra's Algorithm" && <DijkstraVisualizer />}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t">
        © {new Date().getFullYear()} Algorithm Visualizer | Built with ❤️ using MERN Stack
      </footer>
    </div>
  );
}
