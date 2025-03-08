// src/pages/Hangar.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import ShipCard from "../components/ShipCard";
import NavigationBar from "../components/NavigationBar";

const Hangar: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const {
    ships,
    activeShips,
    playerLevel,
    credits,
    minerals,
    energy,
    purchaseShip,
    upgradeShip,
    activateShip,
    deactivateShip,
  } = useGameStore();

  const handlePurchase = (shipId: string) => {
    const success = purchaseShip(shipId);
    if (success) {
      playSound("buyUpgrade");
    }
  };

  const handleUpgrade = (shipId: string) => {
    const success = upgradeShip(shipId);
    if (success) {
      playSound("buyUpgrade");
    }
  };

  const handleActivation = (shipId: string, isActive: boolean) => {
    if (isActive) {
      deactivateShip(shipId);
    } else {
      activateShip(shipId);
    }
    playSound("buttonClick");
  };

  // Grouper les vaisseaux par type
  const defenseShips = ships.filter((ship) => ship.type === "defense");
  const attackShips = ships.filter((ship) => ship.type === "attack");
  const miningShips = ships.filter((ship) => ship.type === "mining");

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
        <h1 className="text-2xl font-bold text-white mb-4">Hangar spatial</h1>

        {/* Vaisseaux de défense */}
        <div className="mb-6">
          <h2 className="text-xl text-space-highlight mb-2">
            Vaisseaux de défense
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defenseShips.map((ship) => (
              <ShipCard
                key={ship.id}
                ship={ship}
                isActive={activeShips.includes(ship.id)}
                onPurchase={() => handlePurchase(ship.id)}
                onUpgrade={() => handleUpgrade(ship.id)}
                onActivate={(isActive) => handleActivation(ship.id, isActive)}
              />
            ))}
          </div>
        </div>

        {/* Vaisseaux d'attaque */}
        <div className="mb-6">
          <h2 className="text-xl text-space-highlight mb-2">
            Vaisseaux d'attaque
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attackShips.map((ship) => (
              <ShipCard
                key={ship.id}
                ship={ship}
                isActive={activeShips.includes(ship.id)}
                onPurchase={() => handlePurchase(ship.id)}
                onUpgrade={() => handleUpgrade(ship.id)}
                onActivate={(isActive) => handleActivation(ship.id, isActive)}
              />
            ))}
          </div>
        </div>

        {/* Vaisseaux miniers */}
        <div className="mb-6">
          <h2 className="text-xl text-space-highlight mb-2">
            Vaisseaux miniers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {miningShips.map((ship) => (
              <ShipCard
                key={ship.id}
                ship={ship}
                isActive={activeShips.includes(ship.id)}
                onPurchase={() => handlePurchase(ship.id)}
                onUpgrade={() => handleUpgrade(ship.id)}
                onActivate={(isActive) => handleActivation(ship.id, isActive)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="hangar"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default Hangar;
