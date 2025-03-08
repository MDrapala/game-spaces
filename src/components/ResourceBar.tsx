// src/components/ResourceBar.tsx
import React from "react";

interface ResourceBarProps {
  credits: number;
  minerals: number;
  energy: number;
  playerLevel: number;
}

const ResourceBar: React.FC<ResourceBarProps> = ({
  credits,
  minerals,
  energy,
  playerLevel,
}) => {
  return (
    <div className="bg-space-blue p-2 flex justify-between items-center">
      {/* Niveau du joueur */}
      <div className="bg-space-light-blue px-3 py-1 rounded-lg flex items-center">
        <div className="text-white font-bold">Niv. {playerLevel}</div>
      </div>

      {/* Ressources */}
      <div className="flex space-x-4">
        {/* Crédits */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-space-gold rounded-full mr-2"></div>
          <span className="text-white">{credits.toLocaleString()}</span>
        </div>

        {/* Minerais */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-space-highlight rounded-full mr-2"></div>
          <span className="text-white">{minerals.toLocaleString()}</span>
        </div>

        {/* Énergie */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-space-energy rounded-full mr-2"></div>
          <span className="text-white">{energy.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ResourceBar;
