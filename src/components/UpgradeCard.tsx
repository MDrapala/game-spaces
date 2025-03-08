// src/components/UpgradeCard.tsx
import React from "react";

interface StatItem {
  label: string;
  value: string;
}

interface UpgradeCardProps {
  title: string;
  description: string;
  currentLevel: number;
  cost: number;
  canAfford: boolean;
  onPurchase: () => void;
  stats: StatItem[];
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({
  title,
  description,
  currentLevel,
  cost,
  canAfford,
  onPurchase,
  stats,
}) => {
  return (
    <div className="bg-space-light-blue p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg text-white font-bold">{title}</h3>
        <div className="text-space-gold font-bold">Niv. {currentLevel}</div>
      </div>

      <p className="text-gray-300 mb-4">{description}</p>

      {/* Statistiques */}
      <div className="mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-white">{stat.label}</span>
            <span className="text-space-highlight">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Coût */}
      <div className="flex justify-between mb-4">
        <span className="text-white">Coût:</span>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-space-gold rounded-full mr-1"></div>
          <span className={canAfford ? "text-white" : "text-red-500"}>
            {cost}
          </span>
        </div>
      </div>

      {/* Bouton d'amélioration */}
      <button
        className={`w-full px-4 py-2 rounded-lg ${
          canAfford
            ? "bg-space-accent hover:bg-space-highlight"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={!canAfford}
        onClick={onPurchase}
      >
        {canAfford ? "Améliorer" : "Crédits insuffisants"}
      </button>
    </div>
  );
};

export default UpgradeCard;
