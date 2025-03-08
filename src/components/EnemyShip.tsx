// src/components/EnemyShip.tsx
import React from "react";
import { Enemy } from "../store/gameStore";

interface EnemyShipProps {
  enemy: Enemy;
  onClick: () => void;
}

const EnemyShip: React.FC<EnemyShipProps> = ({ enemy, onClick }) => {
  // Calculer le pourcentage de santé
  const healthPercent = (enemy.health / enemy.maxHealth) * 100;

  // Déterminer la couleur de la barre de vie
  const getHealthColor = () => {
    if (healthPercent > 60) return "bg-green-500";
    if (healthPercent > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Rendu du vaisseau selon le type
  const renderShip = () => {
    const { type, size } = enemy;

    switch (type) {
      case "small":
        return (
          <div className="relative" style={{ transform: `scale(${size})` }}>
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-red-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>
          </div>
        );
      case "medium":
        return (
          <div className="relative" style={{ transform: `scale(${size})` }}>
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-orange-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-red-400"></div>
          </div>
        );
      case "large":
        return (
          <div className="relative" style={{ transform: `scale(${size})` }}>
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-700"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-orange-500 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-25 h-3 bg-red-500"></div>
            <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>
        );
      case "boss":
        return (
          <div className="relative" style={{ transform: `scale(${size})` }}>
            <div className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[40px] border-l-transparent border-r-transparent border-b-purple-700"></div>
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 rounded-full"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-30 h-4 bg-purple-500"></div>
            <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="enemy absolute cursor-pointer transition-transform"
      style={{
        left: `${enemy.position.x}px`,
        top: `${enemy.position.y}px`,
      }}
      onClick={onClick}
    >
      {/* Vaisseau ennemi */}
      {renderShip()}

      {/* Barre de vie */}
      <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800 rounded">
        <div
          className={`h-full rounded ${getHealthColor()}`}
          style={{ width: `${healthPercent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default EnemyShip;
