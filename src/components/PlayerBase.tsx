// src/components/PlayerBase.tsx
import React from "react";

interface PlayerBaseProps {
  x: number;
  y: number;
}

const PlayerBase: React.FC<PlayerBaseProps> = ({ x, y }) => {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Base spatiale du joueur */}
      <div className="relative">
        {/* Cercle extérieur */}
        <div className="w-20 h-20 rounded-full bg-space-light-blue"></div>

        {/* Cercle moyen */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-space-blue"></div>

        {/* Cercle intérieur */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-space-dark"></div>

        {/* Tourelle */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2">
          <div className="w-4 h-16 bg-space-highlight"></div>
          <div className="w-8 h-4 bg-space-highlight rounded-full absolute top-[-2px] left-1/2 transform -translate-x-1/2"></div>
        </div>

        {/* Antennes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-10 bg-space-accent transform -rotate-15"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-10 bg-space-accent transform rotate-15"></div>
      </div>
    </div>
  );
};

export default PlayerBase;
