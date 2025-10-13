import React from "react";
import { motion } from "framer-motion";

export default function AlgorithmCard({ title, description, path }) {
  return (
    <motion.a
      href={path}
      className="block bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 border border-gray-200 h-full"
      whileHover={{ y: -5 }}
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <span className="text-blue-600 font-semibold text-sm hover:underline">
        Visualize →
      </span>
    </motion.a>
  );
}
