// src/pages/GameScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import ResourceBar from "../components/ResourceBar";
import EnemyShip from "../components/EnemyShip";
import PlayerBase from "../components/PlayerBase";
import WaveIndicator from "../components/WaveIndicator";
import NavigationBar from "../components/NavigationBar";

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>(0);

  // Récupérer l'état du jeu
  const {
    enemies,
    currentWave,
    waveInProgress,
    startWave,
    clickAttack,
    updateEnemies,
    playerLevel,
    credits,
    minerals,
    energy,
  } = useGameStore();

  // Mettre à jour les dimensions du canvas
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Boucle de jeu principale
  useEffect(() => {
    let lastTime = 0;
    const gameLoop = (time: number) => {
      // Convertir en secondes
      const now = time / 1000;
      const deltaTime = now - lastTime;
      lastTime = now;

      // Mettre à jour les ennemis
      if (waveInProgress && deltaTime > 0) {
        updateEnemies();
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [waveInProgress, updateEnemies]);

  // Démarrer une vague automatiquement si aucune n'est en cours
  useEffect(() => {
    if (!waveInProgress && enemies.length === 0) {
      const timeout = setTimeout(() => {
        startWave();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [waveInProgress, enemies, startWave]);

  // Gestionnaire de clic sur l'écran
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      clickAttack(x, y);
      playSound("click");
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

      {/* Canvas de jeu */}
      <div
        ref={canvasRef}
        className="game-canvas bg-space-dark flex-1 relative overflow-hidden"
        onClick={handleCanvasClick}
      >
        {/* Étoiles */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="star absolute"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}

        {/* Indicateur de vague */}
        <WaveIndicator currentWave={currentWave} />

        {/* Base du joueur */}
        <PlayerBase x={dimensions.width / 2} y={dimensions.height - 80} />

        {/* Affichage des ennemis */}
        {enemies.map((enemy) => (
          <EnemyShip
            key={enemy.id}
            enemy={enemy}
            onClick={() => clickAttack(enemy.position.x, enemy.position.y)}
          />
        ))}
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage="game"
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default GameScreen;
