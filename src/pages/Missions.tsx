// src/pages/Missions.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import MissionCard from "../components/MissionCard";
import NavigationBar from "../components/NavigationBar";

const Missions: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();

  const {
    dailyMissions,
    claimMissionReward,
    playerLevel,
    credits,
    minerals,
    energy,
  } = useGameStore();

  const handleClaimReward = (missionId: string) => {
    const success = claimMissionReward(missionId);
    if (success) {
      playSound("levelUp");
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
        <h1 className="text-2xl font-bold text-white mb-4">
          Missions journalières
        </h1>

        {dailyMissions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {dailyMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onClaimReward={() => handleClaimReward(mission.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-space-light-blue rounded-lg">
            <p className="text-xl text-white">
              Toutes les missions ont été complétées !
            </p>
            <p className="text-space-highlight mt-2">
              Revenez demain pour de nouvelles missions.
            </p>
          </div>
        )}
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="missions"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default Missions;
