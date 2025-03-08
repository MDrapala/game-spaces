// src/store/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Types
export type EnemyType = "basic" | "medium" | "advanced";

export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  value: number;
  size: number;
  position: {
    x: number;
    y: number;
  };
}

export interface Reward {
  credits: number;
  minerals: number;
  energy: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: Reward;
  type: "destroy" | "wave" | "credits";
  completed: boolean;
}

export interface GameStats {
  totalClicks: number;
  enemiesDestroyed: number;
  wavesCompleted: number;
  creditsEarned: number;
  timeSpent: number;
}

export interface Ship {
  id: string;
  name: string;
  type: "defense" | "attack" | "mining";
  level: number;
  cost: number;
  damage?: number;
  fireRate?: number;
  health?: number;
  production?: {
    resource: "credits" | "minerals" | "energy";
    amount: number;
    interval: number;
  };
  unlocked: boolean;
}

export interface GameState {
  // État du joueur
  playerLevel: number;
  playerXp: number;
  playerXpToNextLevel: number;

  // Ressources
  credits: number;
  minerals: number;
  energy: number;

  // État du jeu
  enemies: Enemy[];
  currentWave: number;
  waveInProgress: boolean;
  waveCompleted: number;

  // Amélioration automatiques
  autoClickers: number;
  autoClickerDamage: number;
  autoClickInterval: number;

  // Améliorations de clics manuels
  clickDamage: number;
  clickMultiplier: number;

  // Vaisseaux
  ships: Ship[];
  activeShips: string[];

  // Missions
  dailyMissions: Mission[];
  lastMissionRefresh: string | null;

  // Statistiques
  stats: GameStats;

  // Actions
  initializeGame: () => void;
  startWave: () => void;
  clickAttack: (x: number, y: number) => void;
  updateEnemies: () => void;
  completeWave: () => void;
  purchaseUpgrade: (
    type: "clickDamage" | "clickMultiplier" | "autoClicker",
    level?: number
  ) => boolean;
  updateMissionProgress: (
    type: "destroy" | "wave" | "credits",
    amount: number
  ) => void;
  claimMissionReward: (missionId: string) => boolean;
  addExperience: (amount: number) => void;
  purchaseShip: (shipId: string) => boolean;
  upgradeShip: (shipId: string) => boolean;
  activateShip: (shipId: string) => void;
  deactivateShip: (shipId: string) => void;
}

// Générer un nouvel ennemi
const createEnemy = (type: EnemyType | null, wave: number): Enemy => {
  const types: Record<
    EnemyType,
    { health: number; speed: number; value: number; size: number }
  > = {
    basic: {
      health: 2 + Math.floor(wave / 5),
      speed: 1 + wave * 0.1,
      value: 10 + wave * 2,
      size: 1,
    },
    medium: {
      health: 4 + Math.floor(wave / 3),
      speed: 0.8 + wave * 0.08,
      value: 25 + wave * 3,
      size: 1.2,
    },
    advanced: {
      health: 8 + Math.floor(wave / 2),
      speed: 0.6 + wave * 0.06,
      value: 50 + wave * 5,
      size: 1.5,
    },
  };

  const enemyType =
    type ||
    (Math.random() > 0.8
      ? "advanced"
      : Math.random() > 0.6
      ? "medium"
      : "basic");
  const enemyData = types[enemyType];

  return {
    id: uuidv4(),
    type: enemyType,
    health: enemyData.health,
    maxHealth: enemyData.health,
    speed: enemyData.speed,
    value: enemyData.value,
    size: enemyData.size,
    position: {
      x: 100 + Math.random() * 400, // Position aléatoire horizontale
      y: -50, // Commence hors écran en haut
    },
  };
};

// Générer une vague d'ennemis
const generateWave = (wave: number): Enemy[] => {
  const enemyCount = 5 + Math.floor(wave * 1.5);
  const enemies: Enemy[] = [];

  for (let i = 0; i < enemyCount; i++) {
    // Plus on avance dans les vagues, plus on a de chance d'avoir des ennemis avancés
    const advancedChance = Math.min(0.1 + wave * 0.02, 0.4);
    const mediumChance = Math.min(0.3 + wave * 0.03, 0.6);

    const rand = Math.random();
    let type: EnemyType = "basic";

    if (rand < advancedChance) {
      type = "advanced";
    } else if (rand < mediumChance) {
      type = "medium";
    }

    enemies.push(createEnemy(type, wave));
  }

  return enemies;
};

// Missions journalières
const generateDailyMissions = (): Mission[] => {
  const missions: Mission[] = [
    {
      id: uuidv4(),
      title: "Détruire des vaisseaux ennemis",
      description: "Détruire un certain nombre de vaisseaux ennemis",
      target: 50 + Math.floor(Math.random() * 50),
      progress: 0,
      reward: {
        credits: 500 + Math.floor(Math.random() * 300),
        minerals: Math.floor(Math.random() * 200),
        energy: 100 + Math.floor(Math.random() * 100),
      },
      type: "destroy",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Compléter des vagues",
      description: "Compléter un certain nombre de vagues d'attaque",
      target: 3 + Math.floor(Math.random() * 5),
      progress: 0,
      reward: {
        credits: 800 + Math.floor(Math.random() * 400),
        minerals: 200 + Math.floor(Math.random() * 150),
        energy: Math.floor(Math.random() * 200),
      },
      type: "wave",
      completed: false,
    },
    {
      id: uuidv4(),
      title: "Collecter des ressources",
      description: "Collecter une certaine quantité de crédits",
      target: 2000 + Math.floor(Math.random() * 3000),
      progress: 0,
      reward: {
        credits: Math.floor(Math.random() * 500),
        minerals: 300 + Math.floor(Math.random() * 200),
        energy: 300 + Math.floor(Math.random() * 200),
      },
      type: "credits",
      completed: false,
    },
  ];

  return missions;
};

// Vaisseaux initiaux
const initialShips: Ship[] = [
  {
    id: "defender-1",
    name: "Défenseur",
    type: "defense",
    level: 1,
    cost: 500,
    damage: 1,
    fireRate: 1.0,
    health: 100,
    unlocked: true,
  },
  {
    id: "cruiser-1",
    name: "Croiseur",
    type: "attack",
    level: 1,
    cost: 1200,
    damage: 3,
    fireRate: 0.8,
    health: 200,
    unlocked: false,
  },
  {
    id: "destroyer-1",
    name: "Destructeur",
    type: "attack",
    level: 1,
    cost: 3000,
    damage: 5,
    fireRate: 1.2,
    health: 350,
    unlocked: false,
  },
  {
    id: "miner-1",
    name: "Mineur",
    type: "mining",
    level: 1,
    cost: 800,
    health: 80,
    production: {
      resource: "minerals",
      amount: 10,
      interval: 5000, // 5 secondes
    },
    unlocked: false,
  },
  {
    id: "collector-1",
    name: "Collecteur",
    type: "mining",
    level: 1,
    cost: 800,
    health: 80,
    production: {
      resource: "credits",
      amount: 5,
      interval: 3000, // 3 secondes
    },
    unlocked: false,
  },
  {
    id: "generator-1",
    name: "Générateur",
    type: "mining",
    level: 1,
    cost: 1000,
    health: 80,
    production: {
      resource: "energy",
      amount: 5,
      interval: 4000, // 4 secondes
    },
    unlocked: false,
  },
];

// Store principal du jeu
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // État du joueur
      playerLevel: 1,
      playerXp: 0,
      playerXpToNextLevel: 1000,

      // Ressources
      credits: 500,
      minerals: 200,
      energy: 100,

      // État du jeu
      enemies: [],
      currentWave: 1,
      waveInProgress: false,
      waveCompleted: 0,

      // Amélioration automatiques
      autoClickers: 0,
      autoClickerDamage: 1,
      autoClickInterval: 1000,

      // Améliorations de clics manuels
      clickDamage: 1,
      clickMultiplier: 1,

      // Vaisseaux
      ships: initialShips,
      activeShips: [],

      // Missions
      dailyMissions: [],
      lastMissionRefresh: null,

      // Statistiques
      stats: {
        totalClicks: 0,
        enemiesDestroyed: 0,
        wavesCompleted: 0,
        creditsEarned: 0,
        timeSpent: 0,
      },

      // Actions
      initializeGame: () => {
        const now = new Date();
        const lastRefresh = get().lastMissionRefresh;

        // Vérifier si nous devons rafraîchir les missions journalières
        if (!lastRefresh || new Date(lastRefresh).getDate() !== now.getDate()) {
          set({
            dailyMissions: generateDailyMissions(),
            lastMissionRefresh: now.toISOString(),
          });
        }
      },

      // Démarrer une nouvelle vague
      startWave: () => {
        const currentWave = get().currentWave;
        set({
          enemies: generateWave(currentWave),
          waveInProgress: true,
        });
      },

      // Cliquer sur l'écran pour attaquer
      clickAttack: (x: number, y: number) => {
        const enemies = get().enemies;
        const clickDamage = get().clickDamage * get().clickMultiplier;
        const stats = { ...get().stats };

        // Mise à jour des statistiques
        stats.totalClicks++;

        // Chercher l'ennemi le plus proche du clic
        let closestEnemy: Enemy | null = null;
        let closestDistance = Infinity;

        enemies.forEach((enemy) => {
          const distance = Math.sqrt(
            Math.pow(enemy.position.x - x, 2) +
              Math.pow(enemy.position.y - y, 2)
          );

          // Si on est dans un rayon de 50px de l'ennemi
          if (distance < 50 * enemy.size && distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = enemy;
          }
        });

        // Si on a trouvé un ennemi proche, on lui inflige des dégâts
        if (closestEnemy) {
          const updatedEnemies = enemies
            .map((enemy) => {
              if (enemy.id === closestEnemy!.id) {
                const newHealth = enemy.health - clickDamage;

                // Si l'ennemi est détruit
                if (newHealth <= 0) {
                  // Ajouter les récompenses
                  set({
                    credits: get().credits + enemy.value,
                    stats: {
                      ...stats,
                      enemiesDestroyed: stats.enemiesDestroyed + 1,
                      creditsEarned: stats.creditsEarned + enemy.value,
                    },
                  });

                  // Mettre à jour les missions
                  get().updateMissionProgress("destroy", 1);
                  get().updateMissionProgress("credits", enemy.value);

                  // Ajouter de l'XP
                  get().addExperience(enemy.value / 2);

                  // Retirer l'ennemi de la liste
                  return null;
                }

                // Sinon, on met à jour sa santé
                return {
                  ...enemy,
                  health: newHealth,
                };
              }

              return enemy;
            })
            .filter(Boolean) as Enemy[]; // Retirer les ennemis détruits (null)

          set({ enemies: updatedEnemies });

          // Vérifier si la vague est terminée
          if (updatedEnemies.length === 0) {
            get().completeWave();
          }
        }
      },

      // Mettre à jour la position des ennemis (appelé par la boucle de jeu)
      updateEnemies: () => {
        const enemies = get().enemies;

        if (enemies.length === 0 && get().waveInProgress) {
          get().completeWave();
          return;
        }

        const updatedEnemies = enemies.map((enemy) => {
          // Déplacer l'ennemi vers le bas
          return {
            ...enemy,
            position: {
              ...enemy.position,
              y: enemy.position.y + enemy.speed,
            },
          };
        });

        set({ enemies: updatedEnemies });
      },

      // Compléter une vague
      completeWave: () => {
        const currentWave = get().currentWave;
        const stats = { ...get().stats };

        // Bonus de complétion de vague
        const waveBonus = 100 + currentWave * 20;

        set({
          currentWave: currentWave + 1,
          waveInProgress: false,
          waveCompleted: get().waveCompleted + 1,
          credits: get().credits + waveBonus,
          stats: {
            ...stats,
            wavesCompleted: stats.wavesCompleted + 1,
            creditsEarned: stats.creditsEarned + waveBonus,
          },
        });

        // Mettre à jour les missions
        get().updateMissionProgress("wave", 1);
        get().updateMissionProgress("credits", waveBonus);

        // Ajouter de l'XP
        get().addExperience(waveBonus);
      },

      // Acheter une amélioration
      purchaseUpgrade: (
        type: "clickDamage" | "clickMultiplier" | "autoClicker",
        level: number = 1
      ) => {
        const { credits, clickDamage, clickMultiplier, autoClickers } = get();

        let cost = 0;

        switch (type) {
          case "clickDamage":
            cost = 200 * (clickDamage + level);
            if (credits >= cost) {
              set({
                credits: credits - cost,
                clickDamage: clickDamage + level,
              });
              return true;
            }
            break;

          case "clickMultiplier":
            cost = 500 * clickMultiplier;
            if (credits >= cost) {
              set({
                credits: credits - cost,
                clickMultiplier: clickMultiplier + 0.1,
              });
              return true;
            }
            break;

          case "autoClicker":
            cost = 300 * (autoClickers + 1);
            if (credits >= cost) {
              set({
                credits: credits - cost,
                autoClickers: autoClickers + 1,
              });
              return true;
            }
            break;
        }

        return false;
      },

      // Mettre à jour la progression des missions
      updateMissionProgress: (
        type: "destroy" | "wave" | "credits",
        amount: number
      ) => {
        const dailyMissions = [...get().dailyMissions];

        const updatedMissions = dailyMissions.map((mission) => {
          if (mission.type === type && !mission.completed) {
            const newProgress = mission.progress + amount;

            // Si la mission est complétée
            if (newProgress >= mission.target) {
              return {
                ...mission,
                progress: mission.target,
                completed: true,
              };
            }

            // Sinon, on met à jour la progression
            return {
              ...mission,
              progress: newProgress,
            };
          }

          return mission;
        });

        set({ dailyMissions: updatedMissions });
      },

      // Réclamer la récompense d'une mission
      claimMissionReward: (missionId: string) => {
        const dailyMissions = [...get().dailyMissions];
        const mission = dailyMissions.find((m) => m.id === missionId);

        if (mission && mission.completed) {
          // Ajouter les récompenses
          set({
            credits: get().credits + mission.reward.credits,
            minerals: get().minerals + mission.reward.minerals,
            energy: get().energy + mission.reward.energy,
            dailyMissions: dailyMissions.filter((m) => m.id !== missionId),
          });

          return true;
        }

        return false;
      },

      // Ajouter de l'expérience
      addExperience: (amount: number) => {
        const { playerXp, playerXpToNextLevel, playerLevel } = get();
        const newXp = playerXp + amount;

        // Si on monte de niveau
        if (newXp >= playerXpToNextLevel) {
          const newLevel = playerLevel + 1;
          const nextLevelXp = playerXpToNextLevel * 1.5;

          set({
            playerLevel: newLevel,
            playerXp: newXp - playerXpToNextLevel,
            playerXpToNextLevel: nextLevelXp,
            // Bonus de niveau
            credits: get().credits + newLevel * 100,
            minerals: get().minerals + newLevel * 20,
            energy: get().energy + newLevel * 20,
          });

          // Débloquer des vaisseaux en fonction du niveau
          const ships = [...get().ships];
          const updatedShips = ships.map((ship) => {
            if (!ship.unlocked) {
              if (
                (ship.id === "cruiser-1" && newLevel >= 3) ||
                (ship.id === "destroyer-1" && newLevel >= 8) ||
                (ship.id === "miner-1" && newLevel >= 2) ||
                (ship.id === "collector-1" && newLevel >= 4) ||
                (ship.id === "generator-1" && newLevel >= 5)
              ) {
                return { ...ship, unlocked: true };
              }
            }
            return ship;
          });

          set({ ships: updatedShips });
        } else {
          set({ playerXp: newXp });
        }
      },

      // Acheter un vaisseau
      purchaseShip: (shipId: string) => {
        const ships = [...get().ships];
        const ship = ships.find((s) => s.id === shipId);

        if (ship && ship.unlocked && !get().activeShips.includes(shipId)) {
          if (get().credits >= ship.cost) {
            set({
              credits: get().credits - ship.cost,
              activeShips: [...get().activeShips, shipId],
            });
            return true;
          }
        }

        return false;
      },

      // Améliorer un vaisseau
      upgradeShip: (shipId: string) => {
        const ships = [...get().ships];
        const shipIndex = ships.findIndex((s) => s.id === shipId);

        if (shipIndex !== -1) {
          const ship = ships[shipIndex];
          const upgradeCost = ship.cost * (ship.level + 1);

          if (get().credits >= upgradeCost) {
            // Améliorer les statistiques du vaisseau
            const upgradedShip = { ...ship };

            upgradedShip.level += 1;
            upgradedShip.cost = upgradeCost;

            if (upgradedShip.damage) {
              upgradedShip.damage = Math.ceil(upgradedShip.damage * 1.2);
            }

            if (upgradedShip.health) {
              upgradedShip.health = Math.ceil(upgradedShip.health * 1.2);
            }

            if (upgradedShip.fireRate) {
              upgradedShip.fireRate = parseFloat(
                (upgradedShip.fireRate * 1.1).toFixed(2)
              );
            }

            if (upgradedShip.production) {
              upgradedShip.production = {
                ...upgradedShip.production,
                amount: Math.ceil(upgradedShip.production.amount * 1.3),
              };
            }

            ships[shipIndex] = upgradedShip;

            set({
              credits: get().credits - upgradeCost,
              ships,
            });

            return true;
          }
        }

        return false;
      },

      // Activer un vaisseau
      activateShip: (shipId: string) => {
        if (!get().activeShips.includes(shipId)) {
          set({
            activeShips: [...get().activeShips, shipId],
          });
        }
      },

      // Désactiver un vaisseau
      deactivateShip: (shipId: string) => {
        set({
          activeShips: get().activeShips.filter((id) => id !== shipId),
        });
      },
    }),
    {
      name: "space-clicker-storage", // Nom du stockage localStorage
      partialize: (state) => ({
        playerLevel: state.playerLevel,
        playerXp: state.playerXp,
        playerXpToNextLevel: state.playerXpToNextLevel,
        credits: state.credits,
        minerals: state.minerals,
        energy: state.energy,
        currentWave: state.currentWave,
        waveCompleted: state.waveCompleted,
        autoClickers: state.autoClickers,
        autoClickerDamage: state.autoClickerDamage,
        autoClickInterval: state.autoClickInterval,
        clickDamage: state.clickDamage,
        clickMultiplier: state.clickMultiplier,
        ships: state.ships,
        activeShips: state.activeShips,
        dailyMissions: state.dailyMissions,
        lastMissionRefresh: state.lastMissionRefresh,
        stats: state.stats,
      }),
    }
  )
);
