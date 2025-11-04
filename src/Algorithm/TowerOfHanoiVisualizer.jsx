// TowerOfHanoiVisualizer.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Tower of Hanoi Visualizer
 * - props: none (self-contained)
 * - Requires: tailwindcss + framer-motion
 *
 * Notes:
 * - Keep disks <= 8 for reasonable animation and number of moves.
 */

export default function TowerOfHanoiVisualizer() {
  const [numDisks, setNumDisks] = useState(4);
  const [pegs, setPegs] = useState([[], [], []]); // arrays of disk sizes (ints), index 0 = left peg
  const [steps, setSteps] = useState([]); // snapshots of pegs after each move + message
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const MAX_DISKS = 8;

  // Initialize pegs for n disks
  const initPegs = (n) => {
    const start = [];
    for (let i = n; i >= 1; i--) start.push(i); // largest at start[0] for rendering bottom-first
    return [start, [], []];
  };

  // Generate sequence of moves and snapshots (deep-copied peg states)
  const generateSteps = (n) => {
    const moves = []; // { from: idx, to: idx }
    const snapshotSteps = [];

    // recursive function to push moves
    const hanoi = (count, from, to, aux) => {
      if (count === 0) return;
      hanoi(count - 1, from, aux, to);
      moves.push({ from, to });
      hanoi(count - 1, aux, to, from);
    };

    hanoi(n, 0, 2, 1);

    // simulate moves to capture snapshots
    const simPegs = initPegs(n).map((p) => [...p]);
    // initial snapshot
    snapshotSteps.push({
      pegs: simPegs.map((p) => [...p]),
      message: `Start with ${n} disk${n > 1 ? "s" : ""}.`,
    });

    moves.forEach((m, idx) => {
      const disk = simPegs[m.from].shift(); // remove top (start[0] is top for us)
      // Note: we store top at index 0 so shift/pop decisions consistent; we will reverse while rendering
      simPegs[m.to].unshift(disk);
      snapshotSteps.push({
        pegs: simPegs.map((p) => [...p]),
        message: `Move ${idx + 1}: disk ${disk} from peg ${["A", "B", "C"][m.from]} to ${["A", "B", "C"][m.to]}.`,
      });
    });

    return snapshotSteps;
  };

  // Prepare initial state on mount / when numDisks changes
  useEffect(() => {
    const n = Math.min(Math.max(1, Math.floor(Number(numDisks) || 1)), MAX_DISKS);
    setNumDisks(n);
    const initial = initPegs(n);
    setPegs(initial.map((p) => [...p]));
    const snaps = generateSteps(n);
    setSteps(snaps);
    setCurrentStep(0);
    setIsPlaying(false);
    // cleanup timer if any
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* react to explicit reset or numDisks change via handleSetDisks */]);

  // Controlled play/pause behavior
  useEffect(() => {
    if (isPlaying) {
      if (steps.length === 0) return;
      timerRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s < steps.length - 1) return s + 1;
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsPlaying(false);
          return s;
        });
      }, 700);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, steps]);

  // When currentStep changes, update pegs for display
  useEffect(() => {
    if (steps.length === 0) return;
    const step = steps[Math.max(0, Math.min(currentStep, steps.length - 1))];
    setPegs(step.pegs.map((p) => [...p]));
  }, [currentStep, steps]);

  // Handlers
  const handleSetDisks = (value) => {
    let n = Math.floor(Number(value) || 1);
    if (n < 1) n = 1;
    if (n > MAX_DISKS) n = MAX_DISKS;
    setNumDisks(n);
    const snaps = generateSteps(n);
    setSteps(snaps);
    setPegs(initPegs(n).map((p) => [...p]));
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((c) => Math.max(0, c - 1));
  };
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((c) => Math.min(steps.length - 1, c + 1));
  };
  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (currentStep >= steps.length - 1) {
      // restart if at end
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPegs(initPegs(numDisks).map((p) => [...p]));
  };

  // render helpers
  const pegLabels = ["A", "B", "C"];
  // For rendering, we want bottom-most disk at bottom. Our internal representation keeps top at index 0,
  // so to render bottom-first, reverse the peg array.
  const renderPegDisks = (pegArray) => {
    return [...pegArray].slice().reverse(); // bottom->top
  };

  // disk width calculation
  const diskWidth = (diskValue) => {
    // map diskValue 1..numDisks to width 60..220
    const minW = 60;
    const maxW = 220;
    const ratio = (diskValue - 1) / Math.max(1, numDisks - 1);
    return Math.round(minW + (maxW - minW) * ratio);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">🗼 Tower of Hanoi — Bars & Rings</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6 w-full max-w-3xl">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Disks</label>
          <input
            type="number"
            min="1"
            max={MAX_DISKS}
            value={numDisks}
            onChange={(e) => handleSetDisks(e.target.value)}
            className="w-20 text-black px-2 py-1 rounded-md"
          />
          <span className="text-xs text-gray-400 ml-2">recommended ≤ {MAX_DISKS}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            ◀ Prev
          </button>
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
          >
            Next ▶
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500"
          >
            Reset
          </button>
        </div>

        <div className="ml-auto text-sm text-gray-300">
          Move: {Math.max(0, currentStep)} / {Math.max(0, steps.length - 1)}
        </div>
      </div>

      {/* Visualization area */}
      <div className="w-full max-w-4xl bg-gray-800/50 rounded-2xl p-6 shadow-xl border border-gray-700">
        <div className="flex justify-between items-end gap-6">
          {/* For each peg */}
          {pegs.map((peg, pegIndex) => (
            <div key={pegIndex} className="flex-1 flex flex-col items-center">
              {/* peg label */}
              <div className="mb-4 text-sm text-gray-300">Peg {pegLabels[pegIndex]}</div>

              {/* peg visual: vertical bar */}
              <div className="relative w-full h-64 flex items-end justify-center">
                {/* vertical bar */}
                <div className="absolute bottom-0 w-1 bg-gray-400 h-full rounded-sm" />

                {/* disks container */}
                <div className="flex flex-col items-center justify-end gap-2 pb-4">
                  {renderPegDisks(peg).map((diskSize, idx) => {
                    // render each disk; idx is from 0..(peg.length-1) bottom->top
                    const width = diskWidth(diskSize);
                    // color palette based on size
                    const hue = Math.round((diskSize / Math.max(1, numDisks)) * 220); // 0..220
                    return (
                      <motion.div
                        key={`${pegIndex}-${diskSize}-${idx}-${currentStep}`}
                        layout
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="rounded-md flex items-center justify-center text-black font-semibold"
                        style={{
                          width: `${width}px`,
                          height: `${26}px`,
                          background: `hsl(${hue}deg 70% 65%)`,
                        }}
                      >
                        <span className="text-sm select-none">{diskSize}</span>
                      </motion.div>
                    );
                  })}
                  {/* empty space filler when peg has fewer disks so heights align */}
                  {Array.from({ length: Math.max(0, numDisks - peg.length) }).map((_, i) => (
                    <div key={`filler-${pegIndex}-${i}`} style={{ height: 26 }} />
                  ))}
                </div>
              </div>

              {/* peg base */}
              <div className="w-3/4 h-3 bg-gray-600 rounded-sm mt-4" />
            </div>
          ))}
        </div>

        {/* message */}
        <div className="mt-6 text-sm text-gray-300">
          {steps.length > 0 ? steps[Math.max(0, Math.min(currentStep, steps.length - 1))].message : "No moves yet."}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 max-w-3xl text-sm text-gray-400">
        <p>
          Tip: Disk numbers represent size (larger number → larger disk). The top of the peg is the smallest disk.
        </p>
      </div>
    </div>
  );
}
