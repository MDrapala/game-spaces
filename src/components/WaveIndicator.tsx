// src/components/WaveIndicator.tsx
import React, { useEffect, useState } from "react";

interface WaveIndicatorProps {
  currentWave: number;
}

const WaveIndicator: React.FC<WaveIndicatorProps> = ({ currentWave }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Afficher l'indicateur pendant quelques secondes lors du changement de vague
  useEffect(() => {
    setIsVisible(true);

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [currentWave]);

  return (
    <div
      className={`absolute top-20 left-1/2 transform -translate-x-1/2 bg-space-light-blue px-6 py-3 rounded-lg transition-opacity duration-500 pointer-events-none z-10 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-xl text-white font-bold text-center">
        Vague {currentWave}
      </div>
    </div>
  );
};

export default WaveIndicator;
