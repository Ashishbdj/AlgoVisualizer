import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import TreeNode from "./TreeNode";
import TraversalControls from "./TraversalControls";
import TraversalInfo from "./TraversalInfo";

export default function BinaryTreeVisualizer() {
  // 🌳 User input field (default)
  const [input, setInput] = useState("1,2,3,4,5,null,6,7");
  const [tree, setTree] = useState(null);

  const [traversalType, setTraversalType] = useState("inorder");
  const [steps, setSteps] = useState([]);
  const [visited, setVisited] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef(null);

  // 🌲 Helper to build tree from level order
  const buildTree = (values) => {
    if (!values.length) return null;
    const nodes = values.map((v) =>
      v === "null" ? null : { value: v, left: null, right: null }
    );
    let i = 0;
    for (let j = 1; j < nodes.length; j++) {
      if (!nodes[i]) {
        i++;
        j--;
        continue;
      }
      if (!nodes[i].left) nodes[i].left = nodes[j];
      else if (!nodes[i].right) {
        nodes[i].right = nodes[j];
        i++;
      }
    }
    return nodes[0];
  };

  // 🧭 Traversal functions with step messages
  const inorder = (node, arr = [], msg = []) => {
    if (!node) return;
    msg.push(`Traverse left of ${node.value}`);
    inorder(node.left, arr, msg);
    arr.push(node.value);
    msg.push(`Visit node ${node.value}`);
    msg.push(`Traverse right of ${node.value}`);
    inorder(node.right, arr, msg);
    return { order: arr, messages: msg };
  };

  const preorder = (node, arr = [], msg = []) => {
    if (!node) return;
    arr.push(node.value);
    msg.push(`Visit node ${node.value}`);
    msg.push(`Traverse left of ${node.value}`);
    preorder(node.left, arr, msg);
    msg.push(`Traverse right of ${node.value}`);
    preorder(node.right, arr, msg);
    return { order: arr, messages: msg };
  };

  const postorder = (node, arr = [], msg = []) => {
    if (!node) return;
    msg.push(`Traverse left of ${node.value}`);
    postorder(node.left, arr, msg);
    msg.push(`Traverse right of ${node.value}`);
    postorder(node.right, arr, msg);
    arr.push(node.value);
    msg.push(`Visit node ${node.value}`);
    return { order: arr, messages: msg };
  };

  // 🧩 Generate steps and messages
  const generateSteps = (type) => {
    if (!tree) return { order: [], messages: [] };
    if (type === "inorder") return inorder(tree);
    if (type === "preorder") return preorder(tree);
    return postorder(tree);
  };

  // 🧮 On traversal type change or new tree
  useEffect(() => {
    if (!tree) return;
    const { order, messages } = generateSteps(traversalType);
    setSteps(order.map((v, i) => ({ value: v, message: messages[i] || "" })));
    setVisited([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [traversalType, tree]);

  // ▶️ Auto-play traversal animation
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length) {
            setVisited((v) => [...v, steps[prev].value]);
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

  const handlePlayPause = () => {
    if (currentStep >= steps.length) {
      setVisited([]);
      setCurrentStep(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setVisited((v) => [...v, steps[currentStep].value]);
      setCurrentStep((c) => c + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setVisited([]);
    setCurrentStep(0);
  };

  // 🏗 Build new tree from input
  const handleBuildTree = () => {
    const values = input
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length);
    const newTree = buildTree(values);
    setTree(newTree);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">
        🌳 Binary Tree Traversal Visualizer
      </h1>

      {/* User Input Section */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter nodes e.g. 1,2,3,4,5,null,6"
          className="text-black p-2 rounded-md w-80"
        />
        <button
          onClick={handleBuildTree}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold"
        >
          Build Tree
        </button>
      </div>

      {/* Traversal Selection */}
      <div className="mb-4 flex gap-4">
        {["inorder", "preorder", "postorder"].map((type) => (
          <button
            key={type}
            onClick={() => setTraversalType(type)}
            className={`px-4 py-2 rounded-md ${
              traversalType === type
                ? "bg-yellow-500 text-black font-bold"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Controls */}
      <TraversalControls
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={steps.length}
      />

      {/* Tree Visualization */}
      <div className="mt-8">
        {tree ? (
          <TreeNode node={tree} visited={visited} />
        ) : (
          <p className="text-gray-400 italic">
            Please enter a valid input and click "Build Tree".
          </p>
        )}
      </div>

      {/* Step Description */}
      {steps.length > 0 && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-800 p-4 rounded-md w-full max-w-xl text-center text-yellow-300 font-medium"
        >
          {steps[currentStep]?.message || "Traversal Complete!"}
        </motion.div>
      )}

      {/* Theory Section */}
      <TraversalInfo
        traversalType={traversalType}
        visited={visited}
        steps={steps.map((s) => s.value)}
      />
    </div>
  );
}
