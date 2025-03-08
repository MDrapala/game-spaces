// src/pages/Settings.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import NavigationBar from "../components/NavigationBar";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { playerLevel, credits, minerals, energy, stats } = useGameStore();

  const { isMuted, volume, toggleMute, setVolume, playSound } = useSound();

  // Gérer le changement de volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Jouer un son de test
  const handleTestSound = () => {
    playSound("buttonClick");
  };

  // Fonction pour exporter les données (RGPD)
  const handleExportData = () => {
    // Récupérer les données du localStorage
    const gameData = localStorage.getItem("space-clicker-storage");

    if (gameData) {
      // Créer un blob avec les données
      const blob = new Blob([gameData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Créer un lien de téléchargement
      const a = document.createElement("a");
      a.href = url;
      a.download = "space-clicker-data.json";
      document.body.appendChild(a);
      a.click();

      // Nettoyer
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Fonction pour réinitialiser les données
  const handleResetData = () => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible."
      )
    ) {
      localStorage.removeItem("space-clicker-storage");
      window.location.reload();
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
        <h1 className="text-2xl font-bold text-white mb-4">Paramètres</h1>

        {/* Paramètres audio */}
        <div className="bg-space-light-blue p-4 rounded-lg mb-4">
          <h2 className="text-xl text-white mb-2">Audio</h2>

          <div className="flex items-center mb-2">
            <label className="text-white mr-4">Son:</label>
            <button
              className={`px-4 py-2 rounded-lg ${
                isMuted ? "bg-red-500" : "bg-green-500"
              }`}
              onClick={toggleMute}
            >
              {isMuted ? "Désactivé" : "Activé"}
            </button>

            <button
              className="ml-4 px-4 py-2 rounded-lg bg-space-accent"
              onClick={handleTestSound}
            >
              Tester
            </button>
          </div>

          <div className="flex items-center">
            <label className="text-white mr-4">Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-64"
            />
            <span className="text-white ml-2">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-space-light-blue p-4 rounded-lg mb-4">
          <h2 className="text-xl text-white mb-2">Statistiques</h2>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-white">Niveau du joueur</div>
            <div className="text-space-highlight">{playerLevel}</div>

            <div className="text-white">Clics totaux</div>
            <div className="text-space-highlight">{stats.totalClicks}</div>

            <div className="text-white">Ennemis détruits</div>
            <div className="text-space-highlight">{stats.enemiesDestroyed}</div>

            <div className="text-white">Vagues complétées</div>
            <div className="text-space-highlight">{stats.wavesCompleted}</div>

            <div className="text-white">Crédits gagnés</div>
            <div className="text-space-highlight">{stats.creditsEarned}</div>

            <div className="text-white">Temps de jeu</div>
            <div className="text-space-highlight">
              {Math.floor(stats.timeSpent / 60)} min {stats.timeSpent % 60} sec
            </div>
          </div>
        </div>

        {/* Gestion des données */}
        <div className="bg-space-light-blue p-4 rounded-lg">
          <h2 className="text-xl text-white mb-2">Données du jeu</h2>

          <div className="flex flex-col space-y-2">
            <button
              className="px-4 py-2 rounded-lg bg-space-accent"
              onClick={handleExportData}
            >
              Exporter mes données (RGPD)
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-red-500"
              onClick={handleResetData}
            >
              Réinitialiser mes données
            </button>
          </div>

          <p className="text-white text-sm mt-2">
            Conformément au RGPD, vous pouvez exporter toutes vos données de jeu
            à tout moment. La réinitialisation supprimera définitivement toutes
            vos données.
          </p>
        </div>
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="settings"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default Settings;
