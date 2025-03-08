// src/components/ShipCard.tsx
import React from "react";
import { Ship } from "../store/gameStore";

interface ShipCardProps {
  ship: Ship;
  isActive: boolean;
  onPurchase: () => void;
  onUpgrade: () => void;
  onActivate: (isActive: boolean) => void;
}

const ShipCard: React.FC<ShipCardProps> = ({
  ship,
  isActive,
  onPurchase,
  onUpgrade,
  onActivate,
}) => {
  // Rendre les attributs du vaisseau
  const renderAttributes = () => {
    const attributes = [];

    if (ship.damage) {
      attributes.push(
        <div key="damage" className="flex justify-between">
          <span className="text-white">Dégâts</span>
          <span className="text-space-highlight">{ship.damage}</span>
        </div>
      );
    }

    if (ship.health) {
      attributes.push(
        <div key="health" className="flex justify-between">
          <span className="text-white">Santé</span>
          <span className="text-space-highlight">{ship.health}</span>
        </div>
      );
    }

    if (ship.fireRate) {
      attributes.push(
        <div key="fireRate" className="flex justify-between">
          <span className="text-white">Cadence de tir</span>
          <span className="text-space-highlight">
            {ship.fireRate.toFixed(1)}/s
          </span>
        </div>
      );
    }

    if (ship.production) {
      attributes.push(
        <div key="production" className="flex justify-between">
          <span className="text-white">
            Production ({ship.production.resource})
          </span>
          <span className="text-space-highlight">
            {ship.production.amount}/
            {(ship.production.interval / 1000).toFixed(0)}s
          </span>
        </div>
      );
    }

    return attributes;
  };

  // Rendre l'état du vaisseau
  const renderStatus = () => {
    if (!ship.unlocked) {
      return (
        <div className="text-yellow-500 text-sm mb-2">
          Se débloque au niveau{" "}
          {ship.id === "cruiser-1" ? 3 : ship.id === "destroyer-1" ? 8 : 5}
        </div>
      );
    }

    if (isActive) {
      return <div className="text-green-500 text-sm mb-2">Actif</div>;
    }

    return null;
  };

  // Rendre le bouton d'action principal
  const renderActionButton = () => {
    if (!ship.unlocked) {
      return (
        <button
          className="px-4 py-2 rounded-lg bg-gray-600 cursor-not-allowed"
          disabled
        >
          Verrouillé
        </button>
      );
    }

    if (!isActive) {
      return (
        <button
          className="px-4 py-2 rounded-lg bg-space-accent hover:bg-space-highlight"
          onClick={onPurchase}
        >
          Acheter ({ship.cost} ⓒ)
        </button>
      );
    }

    return (
      <button
        className="px-4 py-2 rounded-lg bg-space-highlight hover:bg-space-accent"
        onClick={onUpgrade}
      >
        Améliorer ({ship.cost * (ship.level + 1)} ⓒ)
      </button>
    );
  };

  // Rendre le bouton d'activation/désactivation
  const renderToggleButton = () => {
    if (!ship.unlocked || !isActive) return null;

    return (
      <button
        className={`px-4 py-2 rounded-lg ${
          isActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={() => onActivate(isActive)}
      >
        {isActive ? "Désactiver" : "Activer"}
      </button>
    );
  };

  return (
    <div className="bg-space-light-blue p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg text-white font-bold">
          {ship.name} <span className="text-space-gold">Niv. {ship.level}</span>
        </h3>
        {renderStatus()}
      </div>

      <div className="mb-4">{renderAttributes()}</div>

      <div className="flex justify-between">
        {renderActionButton()}
        {renderToggleButton()}
      </div>
    </div>
  );
};

export default ShipCard;
