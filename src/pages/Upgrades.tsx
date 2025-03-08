// src/pages/Upgrades.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import UpgradeCard from "../components/UpgradeCard";
import NavigationBar from "../components/NavigationBar";

const Upgrades: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const {
    clickDamage,
    clickMultiplier,
    autoClickers,
    purchaseUpgrade,
    playerLevel,
    credits,
    minerals,
    energy,
  } = useGameStore();

  const handlePurchaseUpgrade = (
    type: "clickDamage" | "clickMultiplier" | "autoClicker"
  ) => {
    const success = purchaseUpgrade(type);
    if (success) {
      playSound("buyUpgrade");
    }
  };

  // Calculer les coûts des améliorations
  const clickDamageCost = 200 * (clickDamage + 1);
  const clickMultiplierCost = 500 * clickMultiplier;
  const autoClickerCost = 300 * (autoClickers + 1);

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
        <h1 className="text-2xl font-bold text-white mb-4">Améliorations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Amélioration des dégâts par clic */}
          <UpgradeCard
            title="Puissance de tir"
            description="Augmente les dégâts infligés à chaque clic."
            currentLevel={clickDamage}
            cost={clickDamageCost}
            canAfford={credits >= clickDamageCost}
            onPurchase={() => handlePurchaseUpgrade("clickDamage")}
            stats={[
              { label: "Dégâts actuels", value: clickDamage.toString() },
              {
                label: "Prochains dégâts",
                value: (clickDamage + 1).toString(),
              },
            ]}
          />

          {/* Amélioration du multiplicateur de clic */}
          <UpgradeCard
            title="Multiplicateur de tir"
            description="Multiplie les dégâts infligés à chaque clic."
            currentLevel={Math.round(clickMultiplier * 10)}
            cost={clickMultiplierCost}
            canAfford={credits >= clickMultiplierCost}
            onPurchase={() => handlePurchaseUpgrade("clickMultiplier")}
            stats={[
              {
                label: "Multiplicateur actuel",
                value: `x${clickMultiplier.toFixed(1)}`,
              },
              {
                label: "Prochain multiplicateur",
                value: `x${(clickMultiplier + 0.1).toFixed(1)}`,
              },
            ]}
          />

          {/* Amélioration des auto-clickers */}
          <UpgradeCard
            title="Canons automatiques"
            description="Tire automatiquement sur les ennemis sans avoir à cliquer."
            currentLevel={autoClickers}
            cost={autoClickerCost}
            canAfford={credits >= autoClickerCost}
            onPurchase={() => handlePurchaseUpgrade("autoClicker")}
            stats={[
              { label: "Canons actuels", value: autoClickers.toString() },
              {
                label: "Dégâts par seconde",
                value: (autoClickers * 1).toString(),
              },
            ]}
          />
        </div>
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="upgrades"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default Upgrades;
