// src/components/ShopItem.tsx
import React from "react";

interface ShopItemData {
  id: string;
  name: string;
  description: string;
  cost: {
    credits: number;
    minerals: number;
    energy: number;
  };
  effect: string;
  image: string;
}

interface ShopItemProps {
  item: ShopItemData;
  canAfford: boolean;
  onBuy: () => void;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, canAfford, onBuy }) => {
  // Fonction pour rendre l'image
  const renderImage = () => {
    // Utiliser des placeholders ou des emojis pour l'instant
    switch (item.image) {
      case "pack1":
        return <div className="text-4xl">🚀</div>;
      case "pack2":
        return <div className="text-4xl">⭐</div>;
      case "pack3":
        return <div className="text-4xl">💎</div>;
      default:
        return <div className="text-4xl">📦</div>;
    }
  };

  return (
    <div className="bg-space-light-blue p-4 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="bg-space-blue p-2 rounded-lg mr-3">{renderImage()}</div>
        <h3 className="text-lg text-white font-bold">{item.name}</h3>
      </div>

      <p className="text-gray-300 mb-4">{item.description}</p>

      <div className="text-space-highlight mb-4">{item.effect}</div>

      {/* Coût */}
      <div className="mb-4">
        <h4 className="text-white font-bold mb-1">Coût:</h4>
        <div className="flex space-x-4">
          {item.cost.credits > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-gold rounded-full mr-1"></div>
              <span className={canAfford ? "text-white" : "text-red-500"}>
                {item.cost.credits}
              </span>
            </div>
          )}

          {item.cost.minerals > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-highlight rounded-full mr-1"></div>
              <span className={canAfford ? "text-white" : "text-red-500"}>
                {item.cost.minerals}
              </span>
            </div>
          )}

          {item.cost.energy > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-energy rounded-full mr-1"></div>
              <span className={canAfford ? "text-white" : "text-red-500"}>
                {item.cost.energy}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bouton d'achat */}
      <button
        className={`w-full px-4 py-2 rounded-lg ${
          canAfford
            ? "bg-space-accent hover:bg-space-highlight"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={!canAfford}
        onClick={onBuy}
      >
        {canAfford ? "Acheter" : "Ressources insuffisantes"}
      </button>
    </div>
  );
};

export default ShopItem;
