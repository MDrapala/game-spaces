// src/components/TopBar.tsx
import React from "react";

interface TopBarProps {
  playerLevel: number;
  coins: number;
  gems: number;
  onNavigate: (page: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  playerLevel,
  coins,
  gems,
  onNavigate,
}) => {
  return (
    <div className="bg-gray-800 p-2 flex justify-between items-center shadow-md">
      {/* Niveau du joueur */}
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {playerLevel}
        </div>
        <span className="ml-2 text-white font-medium">Niveau</span>
      </div>

      {/* Ressources */}
      <div className="flex space-x-4">
        {/* Pièces */}
        <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
          <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-yellow-800 font-bold">
            $
          </div>
          <span className="ml-2 text-white">{coins.toLocaleString()}</span>
        </div>

        {/* Gemmes */}
        <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
          <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-green-800 font-bold">
            💎
          </div>
          <span className="ml-2 text-white">{gems.toLocaleString()}</span>
        </div>
      </div>

      {/* Menu de navigation */}
      <div className="flex space-x-2">
        <button
          className="p-2 bg-blue-700 rounded-full"
          onClick={() => onNavigate("missions")}
        >
          📋
        </button>
        <button
          className="p-2 bg-purple-700 rounded-full"
          onClick={() => onNavigate("shop")}
        >
          🛒
        </button>
        <button
          className="p-2 bg-gray-700 rounded-full"
          onClick={() => onNavigate("settings")}
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default TopBar;
