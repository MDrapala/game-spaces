// src/pages/Shop.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import ShopItem from "../components/ShopItem";
import NavigationBar from "../components/NavigationBar";

// Types pour les objets de la boutique
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

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const { playerLevel, credits, minerals, energy } = useGameStore();

  // Exemple d'articles de la boutique (à compléter)
  const shopItems: ShopItemData[] = [
    {
      id: "pack1",
      name: "Pack de démarrage",
      description: "Un pack de ressources pour démarrer votre aventure.",
      cost: {
        credits: 0,
        minerals: 0,
        energy: 0,
      },
      effect: "Obtenir 1000 crédits, 500 minerais et 200 énergie.",
      image: "pack1",
    },
    {
      id: "pack2",
      name: "Pack avancé",
      description: "Un pack de ressources pour joueurs intermédiaires.",
      cost: {
        credits: 500,
        minerals: 0,
        energy: 0,
      },
      effect: "Obtenir 2000 crédits, 1000 minerais et 500 énergie.",
      image: "pack2",
    },
    {
      id: "pack3",
      name: "Pack premium",
      description: "Un pack de ressources pour joueurs avancés.",
      cost: {
        credits: 2000,
        minerals: 500,
        energy: 200,
      },
      effect: "Obtenir 5000 crédits, 2000 minerais et 1000 énergie.",
      image: "pack3",
    },
  ];

  // Gérer l'achat d'un article
  const handleBuyItem = (item: ShopItemData) => {
    // Vérifier si le joueur peut se permettre l'article
    if (
      credits >= item.cost.credits &&
      minerals >= item.cost.minerals &&
      energy >= item.cost.energy
    ) {
      // À implémenter: logique d'achat
      playSound("buyUpgrade");

      // Exemple d'alerte (à remplacer par une meilleure UI)
      alert(`Vous avez acheté ${item.name}!`);
    } else {
      alert("Ressources insuffisantes!");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Barre de ressources */}
      <ResourceBar
        credits={credits}
        minerals={minerals}
        energy={energy}
        playerLevel={playerLevel}
      />

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-4 bg-space-dark">
        <h1 className="text-2xl font-bold text-white mb-4">Boutique</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopItems.map((item) => (
            <ShopItem
              key={item.id}
              item={item}
              canAfford={
                credits >= item.cost.credits &&
                minerals >= item.cost.minerals &&
                energy >= item.cost.energy
              }
              onBuy={() => handleBuyItem(item)}
            />
          ))}
        </div>
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="shop"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default Shop;
