// src/components/MissionCard.tsx
import React from "react";
import { Mission } from "../store/gameStore";

interface MissionCardProps {
  mission: Mission;
  onClaimReward: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onClaimReward,
}) => {
  // Calculer le pourcentage de progression
  const progressPercent = Math.min(
    100,
    (mission.progress / mission.target) * 100
  );

  return (
    <div className="bg-space-light-blue p-4 rounded-lg">
      <h3 className="text-lg text-white font-bold mb-2">{mission.title}</h3>
      <p className="text-gray-300 mb-4">{mission.description}</p>

      {/* Barre de progression */}
      <div className="w-full h-4 bg-space-blue rounded-full mb-2">
        <div
          className="h-full bg-space-highlight rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="text-white mb-4">
        Progression: {mission.progress} / {mission.target} (
        {Math.floor(progressPercent)}%)
      </div>

      {/* Récompenses */}
      <div className="mb-4">
        <h4 className="text-white font-bold mb-1">Récompenses:</h4>
        <div className="flex space-x-4">
          {mission.reward.credits > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-gold rounded-full mr-1"></div>
              <span className="text-white">{mission.reward.credits}</span>
            </div>
          )}

          {mission.reward.minerals > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-highlight rounded-full mr-1"></div>
              <span className="text-white">{mission.reward.minerals}</span>
            </div>
          )}

          {mission.reward.energy > 0 && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-space-energy rounded-full mr-1"></div>
              <span className="text-white">{mission.reward.energy}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de réclamation */}
      <button
        className={`w-full px-4 py-2 rounded-lg ${
          mission.completed
            ? "bg-space-gold hover:bg-yellow-500 text-space-dark font-bold"
            : "bg-gray-600 cursor-not-allowed"
        }`}
        disabled={!mission.completed}
        onClick={onClaimReward}
      >
        {mission.completed ? "Réclamer la récompense" : "Mission en cours"}
      </button>
    </div>
  );
};

export default MissionCard;
