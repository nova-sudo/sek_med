import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-white/30">
      <div className="text-center w-3/4 max-w-md">
        <p className="mb-4 text-black text-lg font-cool animate-pulse">Loading session...</p>
        <div className="w-full bg-gray-300 rounded-full h-1 overflow-hidden">
          <div className="bg-black h-full progress-bar"></div>
        </div>
      </div>
    </div>
  );
}