// src/components/PlayerShip.tsx
import React from "react";
import { Spaceship, Turret } from "../store/gameStore";

interface PlayerShipProps {
  ship: Spaceship;
  position: { x: number; y: number };
  turrets: Turret[];
}

const PlayerShip: React.FC<PlayerShipProps> = ({ position, turrets }) => {
  return (
    <div
      className="absolute transition-transform"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
      }}
    >
      {/* Corps du vaisseau */}
      <div className="relative">
        {/* Base du vaisseau */}
        <div
          className="w-40 h-24 bg-blue-700 rounded-r-3xl rounded-l-sm flex items-center justify-center"
          style={{ boxShadow: "0 0 15px rgba(0, 100, 255, 0.5)" }}
        >
          {/* Cockpit */}
          <div className="absolute w-12 h-12 rounded-full bg-blue-300 left-6 top-6">
            <div className="w-8 h-8 rounded-full bg-blue-500 m-2"></div>
          </div>

          {/* Ailes */}
          <div className="absolute w-16 h-8 bg-blue-600 -top-8 left-8"></div>
          <div className="absolute w-16 h-8 bg-blue-600 -bottom-8 left-8"></div>

          {/* Réacteur */}
          <div className="absolute -left-2 top-8 w-4 h-8 bg-orange-500 rounded-l-full">
            <div className="w-8 h-4 bg-yellow-300 absolute top-2 -left-6 animate-pulse"></div>
          </div>
        </div>

        {/* Emplacements des tourelles */}
        {turrets.map((turret, index) => {
          // Répartir les tourelles sur le dessus et le dessous du vaisseau
          const isTop = index % 2 === 0;
          const offset = Math.floor(index / 2) * 15;
          const positionY = isTop ? -10 : 34;

          return (
            <div
              key={turret.id}
              className="absolute w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center"
              style={{
                top: `${positionY}px`,
                left: `${20 + offset}px`,
                zIndex: 15,
              }}
            >
              <div className="w-6 h-2 bg-gray-500 rounded-full transform rotate-90 absolute"></div>
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerShip;
