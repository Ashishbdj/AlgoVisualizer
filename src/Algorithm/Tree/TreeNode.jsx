import React from "react";
import { motion } from "framer-motion";

export default function TreeNode({ node, visited }) {
  if (!node) return null;

  const isVisited = visited.includes(node.value);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        animate={{
          scale: isVisited ? 1.3 : 1,
          backgroundColor: isVisited ? "#4ade80" : "#1f2937",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-green-400 text-xl font-bold`}
      >
        {node.value}
      </motion.div>

      {/* Children */}
      {(node.left || node.right) && (
        <div className="flex justify-around w-full mt-6 gap-8">
          <TreeNode node={node.left} visited={visited} />
          <TreeNode node={node.right} visited={visited} />
        </div>
      )}
    </div>
  );
}
