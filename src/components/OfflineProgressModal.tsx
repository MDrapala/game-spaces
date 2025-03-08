// src/components/OfflineProgressModal.tsx
import React from "react";
import { useSound } from "../contexts/SoundContext";

interface OfflineProgressProps {
  rewards: {
    coins: number;
    exp: number;
    time: number;
  };
  onClose: () => void;
}

const OfflineProgressModal: React.FC<OfflineProgressProps> = ({
  rewards,
  onClose,
}) => {
  const { playSound } = useSound();

  const handleClose = () => {
    playSound("buttonClick");
    onClose();
  };

  // Formater le temps
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hours} heure${hours > 1 ? "s" : ""}`;
    }

    return `${hours} heure${hours > 1 ? "s" : ""} et ${mins} minute${
      mins > 1 ? "s" : ""
    }`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
      <div className="bg-space-blue p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl text-white font-bold mb-4">
          Progression hors ligne
        </h2>

        <p className="text-gray-300 mb-4">
          Pendant votre absence ({formatTime(rewards.time)}), votre flotte a
          continué à défendre et à collecter des ressources:
        </p>

        <div className="bg-space-dark p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white">Crédits gagnés:</span>
            <span className="text-space-gold font-bold">
              {rewards.coins.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-white">Expérience gagnée:</span>
            <span className="text-space-highlight font-bold">
              {rewards.exp.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          className="w-full py-3 bg-space-highlight hover:bg-space-accent text-white font-bold rounded-lg"
          onClick={handleClose}
        >
          Réclamer
        </button>
      </div>
    </div>
  );
};

export default OfflineProgressModal;
