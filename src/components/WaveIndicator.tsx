// src/components/WaveIndicator.tsx
import React from "react";

interface WaveIndicatorProps {
  currentWave: number;
}

const WaveIndicator: React.FC<WaveIndicatorProps> = ({ currentWave }) => {
  return (
    <div className="absolute top-4 left-4 bg-space-blue px-4 py-2 rounded-lg text-white z-10">
      <div className="flex items-center space-x-2">
        <span>Vague:</span>
        <span className="text-space-gold font-bold">{currentWave}</span>
      </div>
    </div>
  );
};

export default WaveIndicator;
