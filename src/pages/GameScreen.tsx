// src/pages/GameScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../store/gameStore";
import { useSound } from "../contexts/SoundContext";
import NavigationBar from "../components/NavigationBar";
import EnemyShip from "../components/EnemyShip";
import PlayerBase from "../components/PlayerBase";
import WaveIndicator from "../components/WaveIndicator";
import ResourceBar from "../components/ResourceBar";

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Récupérer l'état du jeu avec la structure existante
  const {
    enemies,
    currentWave,
    waveInProgress,
    startWave,
    shootEnemy,
    updateEnemyPositions,
    playerLevel,
    coins,
    gems,
    spaceships,
    currentSpaceshipId,
    clickAttack,
  } = useGameStore();

  // Trouver le vaisseau actuel
  const currentShip = spaceships.find((s) => s.id === currentSpaceshipId);
  // Obtenir l'énergie (santé du vaisseau)
  const energy = currentShip ? currentShip.health : 0;

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
    const gameLoop = (time: number) => {
      // Convertir en secondes
      const now = time / 1000;
      const deltaTime =
        lastTimeRef.current === 0 ? 0 : now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Mettre à jour les ennemis avec la fonction existante
      if (waveInProgress && deltaTime > 0) {
        updateEnemyPositions(deltaTime);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = 0;
    };
  }, [waveInProgress, updateEnemyPositions]);

  // Démarrer une vague automatiquement si aucune n'est en cours
  useEffect(() => {
    if (!waveInProgress && enemies.length === 0) {
      const timeout = setTimeout(() => {
        startWave();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [waveInProgress, enemies, startWave]);

  // Système de tir automatique des tourelles
  useEffect(() => {
    if (!waveInProgress || enemies.length === 0) return;

    // Récupérer les tourelles actives
    const activeTurrets = useGameStore.getState().getCurrentActiveTurrets();

    // Créer un intervalle pour chaque tourelle
    const intervals = activeTurrets.map((turret) => {
      // Calculer l'intervalle en millisecondes basé sur le taux de tir
      const fireInterval = 1000 / turret.fireRate;

      return setInterval(() => {
        if (enemies.length > 0) {
          // Trouver l'ennemi le plus avancé (plus proche du côté gauche)
          const target = [...enemies].sort(
            (a, b) => a.position.x - b.position.x
          )[0];

          if (target) {
            shootEnemy(target.id, turret.damage);
            playSound("hit");
          }
        }
      }, fireInterval);
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [waveInProgress, enemies, shootEnemy, playSound]);

  // Gestionnaire de clic sur le canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      clickAttack(x, y);
      playSound("click");
    }
  };

  // Fonction pour gérer le clic sur un ennemi spécifique
  const handleEnemyClick = (enemyId: string) => {
    const enemy = enemies.find((e) => e.id === enemyId);
    if (enemy) {
      clickAttack(enemy.position.x, enemy.position.y);
      playSound("hit");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Barre de ressources */}
      <ResourceBar
        credits={coins}
        minerals={gems}
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
            onClick={() => handleEnemyClick(enemy.id)}
          />
        ))}
      </div>

      {/* Barre de navigation */}
      <NavigationBar
        currentPage=""
        onNavigate={(page) => navigate(`/${page}`)}
      />
    </div>
  );
};

export default GameScreen;
