// src/components/BottomMenu.tsx
import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";

const BottomMenu: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"turrets" | "ships" | "upgrades">(
    "turrets"
  );
  const { playSound } = useSound();

  const {
    turrets,
    spaceships,
    currentSpaceshipId,
    purchaseTurret,
    upgradeTurret,
    purchaseSpaceship,
    switchSpaceship,
    installTurret,
    removeTurret,
    coins,
    gems,
  } = useGameStore();

  // Filtrer les tourelles débloquées et non débloquées
  const unlockedTurrets = turrets.filter((turret) => turret.unlocked);
  const lockedTurrets = turrets.filter((turret) => !turret.unlocked);

  // Filtrer les vaisseaux débloqués et non débloqués
  const unlockedSpaceships = spaceships.filter((ship) => ship.unlocked);
  const lockedSpaceships = spaceships.filter((ship) => !ship.unlocked);

  // Obtenir le vaisseau actuel
  const currentShip = spaceships.find((ship) => ship.id === currentSpaceshipId);

  // Vérifier si une tourelle est installée sur le vaisseau actuel
  const isTurretInstalled = (turretId: string) => {
    return currentShip?.activeTurrets.includes(turretId) || false;
  };

  // Gérer l'amélioration d'une tourelle
  const handleUpgradeTurret = (turretId: string) => {
    const success = upgradeTurret(turretId);
    if (success) {
      playSound("buyUpgrade");
    } else {
      playSound("buttonClick"); // Son d'erreur
    }
  };

  // Gérer l'achat d'une tourelle
  const handlePurchaseTurret = (turretId: string) => {
    const success = purchaseTurret(turretId);
    if (success) {
      playSound("buyUpgrade");
    } else {
      playSound("buttonClick"); // Son d'erreur
    }
  };

  // Gérer l'achat d'un vaisseau
  const handlePurchaseSpaceship = (spaceshipId: string) => {
    const success = purchaseSpaceship(spaceshipId);
    if (success) {
      playSound("buyUpgrade");
    } else {
      playSound("buttonClick"); // Son d'erreur
    }
  };

  // Gérer le changement de vaisseau
  const handleSwitchSpaceship = (spaceshipId: string) => {
    switchSpaceship(spaceshipId);
    playSound("buttonClick");
  };

  // Gérer l'installation/retrait de tourelle
  const handleToggleTurret = (turretId: string) => {
    if (!currentShip) return;

    if (isTurretInstalled(turretId)) {
      const success = removeTurret(turretId, currentShip.id);
      if (success) playSound("buttonClick");
    } else {
      const success = installTurret(turretId, currentShip.id);
      if (success) playSound("buttonClick");
      else playSound("buttonClick"); // Son d'erreur
    }
  };

  return (
    <div className="bg-gray-800 p-2 shadow-lg">
      {/* Onglets */}
      <div className="flex border-b border-gray-700 mb-2">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "turrets"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("turrets")}
        >
          Tourelles
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "ships"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("ships")}
        >
          Vaisseaux
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "upgrades"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("upgrades")}
        >
          Améliorations
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="h-40 overflow-y-auto">
        {activeTab === "turrets" && (
          <div className="grid grid-cols-2 gap-2">
            {/* Tourelles débloquées */}
            {unlockedTurrets.map((turret) => (
              <div key={turret.id} className="bg-gray-700 p-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{turret.name}</h3>
                  <span className="text-sm text-yellow-400">
                    Niv. {turret.level}
                  </span>
                </div>

                <div className="mt-1 text-sm text-gray-300">
                  <div>Dégâts: {turret.damage}</div>
                  <div>Tir/s: {turret.fireRate.toFixed(1)}</div>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      coins >= turret.upgradeCost
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    onClick={() => handleUpgradeTurret(turret.id)}
                    disabled={coins < turret.upgradeCost}
                  >
                    // Suite de BottomMenu.tsx Améliorer ({turret.upgradeCost})
                  </button>

                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      isTurretInstalled(turret.id)
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => handleToggleTurret(turret.id)}
                  >
                    {isTurretInstalled(turret.id) ? "Retirer" : "Installer"}
                  </button>
                </div>
              </div>
            ))}

            {/* Tourelles verrouillées */}
            {lockedTurrets.map((turret) => (
              <div
                key={turret.id}
                className="bg-gray-700 p-2 rounded-lg opacity-70"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{turret.name}</h3>
                  <span className="text-sm text-red-400">Verrouillée</span>
                </div>

                <div className="mt-1 text-sm text-gray-300">
                  <div>Dégâts: {turret.damage}</div>
                  <div>Tir/s: {turret.fireRate.toFixed(1)}</div>
                </div>

                <div className="mt-2">
                  <button
                    className={`w-full px-2 py-1 text-xs rounded ${
                      coins >= turret.cost
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    onClick={() => handlePurchaseTurret(turret.id)}
                    disabled={coins < turret.cost}
                  >
                    Débloquer ({turret.cost})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ships" && (
          <div className="grid grid-cols-1 gap-2">
            {/* Vaisseau actuel */}
            {currentShip && (
              <div className="bg-blue-700 p-2 rounded-lg mb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{currentShip.name}</h3>
                  <span className="bg-green-500 px-2 py-0.5 rounded text-xs text-white">
                    Actif
                  </span>
                </div>

                <div className="mt-1 text-sm text-white">
                  <div>
                    Emplacements: {currentShip.activeTurrets.length}/
                    {currentShip.maxTurrets}
                  </div>
                  <div>Santé: {currentShip.health}</div>
                </div>
              </div>
            )}

            {/* Vaisseaux débloqués */}
            {unlockedSpaceships
              .filter((ship) => ship.id !== currentSpaceshipId)
              .map((ship) => (
                <div key={ship.id} className="bg-gray-700 p-2 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">{ship.name}</h3>
                  </div>

                  <div className="mt-1 text-sm text-gray-300">
                    <div>Emplacements: {ship.maxTurrets}</div>
                    <div>Santé: {ship.health}</div>
                  </div>

                  <div className="mt-2">
                    <button
                      className="w-full px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSwitchSpaceship(ship.id)}
                    >
                      Activer
                    </button>
                  </div>
                </div>
              ))}

            {/* Vaisseaux verrouillés */}
            {lockedSpaceships.map((ship) => (
              <div
                key={ship.id}
                className="bg-gray-700 p-2 rounded-lg opacity-70"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{ship.name}</h3>
                  <span className="text-sm text-red-400">Verrouillé</span>
                </div>

                <div className="mt-1 text-sm text-gray-300">
                  <div>Emplacements: {ship.maxTurrets}</div>
                  <div>Santé: {ship.health}</div>
                </div>

                <div className="mt-2">
                  <button
                    className={`w-full px-2 py-1 text-xs rounded ${
                      gems >= ship.gemCost
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    onClick={() => handlePurchaseSpaceship(ship.id)}
                    disabled={gems < ship.gemCost}
                  >
                    Débloquer ({ship.gemCost} 💎)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "upgrades" && (
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-gray-700 p-2 rounded-lg">
              <h3 className="text-white font-medium">Améliorations globales</h3>
              <p className="text-sm text-gray-300 mb-2">
                Les améliorations et déblocages seront disponibles bientôt!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomMenu;
