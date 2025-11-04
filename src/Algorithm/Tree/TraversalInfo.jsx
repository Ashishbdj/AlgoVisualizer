import React from "react";

export default function TraversalInfo({ traversalType, visited, steps }) {
  const theory = {
    inorder:
      "Inorder Traversal (Left ➜ Root ➜ Right): It first visits the left subtree, then the root, and finally the right subtree. It gives sorted order for BSTs.",
    preorder:
      "Preorder Traversal (Root ➜ Left ➜ Right): It first visits the root node, then recursively traverses the left subtree followed by the right subtree.",
    postorder:
      "Postorder Traversal (Left ➜ Right ➜ Root): It first visits the left and right subtrees recursively and visits the root node at the end.",
  };

  return (
    <div className="max-w-3xl mt-8 text-left text-gray-300 bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-400 mb-2">
        📖 {traversalType.toUpperCase()} Traversal
      </h2>
      <p className="mb-4 text-sm">{theory[traversalType]}</p>
      <p className="text-sm text-gray-400">
        <strong>Visited Order:</strong>{" "}
        {visited.length > 0 ? visited.join(" → ") : "No nodes visited yet."}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Total Nodes: {steps.length}
      </p>
    </div>
  );
}
