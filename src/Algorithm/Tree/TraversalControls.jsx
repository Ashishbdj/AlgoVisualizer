import React from "react";

export default function TraversalControls({
  onPlayPause,
  onNext,
  onReset,
  isPlaying,
  currentStep,
  totalSteps,
}) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={onPlayPause}
        className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-400"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
      <button
        onClick={onNext}
        className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-400"
      >
        Next ▶
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-400"
      >
        Reset
      </button>

      <span className="text-sm text-gray-300 mt-2">
        Step {currentStep} / {totalSteps}
      </span>
    </div>
  );
}
