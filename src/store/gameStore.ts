// src/store/gameStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Types pour les ennemis
export type EnemyType = "small" | "medium" | "large" | "boss";

export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  value: number; // Montant d'argent gagné en le tuant
  expValue: number; // Expérience gagnée
  size: number;
  position: {
    x: number;
    y: number;
  };
  isBoss: boolean;
}

// Types pour les tourelles
export interface Turret {
  id: string;
  name: string;
  level: number;
  damage: number;
  fireRate: number; // Tirs par seconde
  cost: number; // Coût pour acheter
  upgradeCost: number; // Coût pour améliorer
  unlocked: boolean;
}

// Types pour les vaisseaux
export interface Spaceship {
  id: string;
  name: string;
  maxTurrets: number;
  health: number;
  gemCost: number; // Coût en gemmes pour débloquer
  unlocked: boolean;
  activeTurrets: string[]; // IDs des tourelles installées
}

// Types pour les missions
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: "kill" | "wave" | "upgrade" | "purchase";
  target: number;
  progress: number;
  reward: {
    coins: number;
    gems: number;
    exp: number;
  };
  completed: boolean;
  expiresAt: string; // Date d'expiration (fin de journée)
}

// Types pour les statistiques
export interface GameStats {
  totalKills: number;
  totalWavesCompleted: number;
  highestWave: number;
  coinsEarned: number;
  timeSpent: number;
  offlineProgress: {
    lastSeen: string;
    coinsPerMinute: number;
    expPerMinute: number;
  };
}

// État du jeu
export interface GameState {
  // Données joueur
  playerName: string;
  playerLevel: number;
  playerExp: number;
  expToNextLevel: number;
  coins: number;
  gems: number;

  // Vagues
  currentWave: number;
  currentEnemiesKilled: number;
  enemiesPerWave: number;
  waveInProgress: boolean;

  // Entités de jeu
  enemies: Enemy[];
  spaceships: Spaceship[];
  currentSpaceshipId: string; // Vaisseau actif
  turrets: Turret[];

  // Missions
  dailyMissions: Mission[];
  lastMissionsRefresh: string | null;

  // Statistiques
  stats: GameStats;

  // Actions
  initializeGame: () => void;
  startWave: () => void;
  completeWave: () => void;
  shootEnemy: (enemyId: string, damage: number) => void;
  upgradeTurret: (turretId: string) => boolean;
  purchaseTurret: (turretId: string) => boolean;
  purchaseSpaceship: (spaceshipId: string) => boolean;
  switchSpaceship: (spaceshipId: string) => void;
  installTurret: (turretId: string, spaceshipId: string) => boolean;
  removeTurret: (turretId: string, spaceshipId: string) => boolean;
  updateMissionProgress: (
    type: "kill" | "wave" | "upgrade" | "purchase",
    amount: number
  ) => void;
  claimMissionReward: (missionId: string) => boolean;
  addPlayerExp: (amount: number) => void;
  calculateOfflineProgress: (lastSeenTime: string) => {
    coins: number;
    exp: number;
    time: number;
  };
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  updateEnemyPositions: (deltaTime: number) => void;
  getCurrentActiveTurrets: () => Turret[];
  checkTurretUnlocks: (level: number) => void;
  clickAttack: (x: number, y: number) => void;
}

// Tourelles initiales
const initialTurrets: Turret[] = [
  {
    id: "basic-turret",
    name: "Tourelle basique",
    level: 1,
    damage: 10,
    fireRate: 1.0,
    cost: 100,
    upgradeCost: 50,
    unlocked: true,
  },
  {
    id: "rapid-turret",
    name: "Tourelle rapide",
    level: 1,
    damage: 5,
    fireRate: 3.0,
    cost: 500,
    upgradeCost: 250,
    unlocked: false,
  },
  {
    id: "heavy-turret",
    name: "Tourelle lourde",
    level: 1,
    damage: 30,
    fireRate: 0.5,
    cost: 1000,
    upgradeCost: 500,
    unlocked: false,
  },
  {
    id: "missile-launcher",
    name: "Lance-missiles",
    level: 1,
    damage: 50,
    fireRate: 0.3,
    cost: 2000,
    upgradeCost: 1000,
    unlocked: false,
  },
];

// Vaisseaux initiaux
const initialSpaceships: Spaceship[] = [
  {
    id: "starter-ship",
    name: "Vaisseau de départ",
    maxTurrets: 2,
    health: 100,
    gemCost: 0,
    unlocked: true,
    activeTurrets: ["basic-turret"],
  },
  {
    id: "advanced-ship",
    name: "Vaisseau avancé",
    maxTurrets: 3,
    health: 200,
    gemCost: 50,
    unlocked: false,
    activeTurrets: [],
  },
  {
    id: "commander-ship",
    name: "Vaisseau de commandement",
    maxTurrets: 4,
    health: 350,
    gemCost: 150,
    unlocked: false,
    activeTurrets: [],
  },
  {
    id: "battleship",
    name: "Cuirassé",
    maxTurrets: 6,
    health: 500,
    gemCost: 300,
    unlocked: false,
    activeTurrets: [],
  },
];

// Générer un nouvel ennemi
const createEnemy = (type: EnemyType | null, wave: number): Enemy => {
  const screenWidth = window.innerWidth;

  const types: Record<
    EnemyType,
    {
      health: number;
      speed: number;
      value: number;
      expValue: number;
      size: number;
    }
  > = {
    small: {
      health: Math.ceil(5 * Math.pow(1.1, wave)),
      speed: 2 + Math.min(wave * 0.1, 5),
      value: 1 + Math.floor(wave / 5),
      expValue: 5 + Math.floor(wave / 3),
      size: 0.6,
    },
    medium: {
      health: Math.ceil(15 * Math.pow(1.1, wave)),
      speed: 1.5 + Math.min(wave * 0.08, 4),
      value: 3 + Math.floor(wave / 3),
      expValue: 15 + Math.floor(wave / 2),
      size: 0.8,
    },
    large: {
      health: Math.ceil(40 * Math.pow(1.1, wave)),
      speed: 1 + Math.min(wave * 0.05, 3),
      value: 8 + Math.floor(wave * 0.8),
      expValue: 40 + Math.floor(wave * 1.2),
      size: 1.2,
    },
    boss: {
      health: Math.ceil(200 * Math.pow(1.1, wave)),
      speed: 0.5 + Math.min(wave * 0.03, 2),
      value: 50 + wave * 5,
      expValue: 200 + wave * 10,
      size: 2,
    },
  };

  // Déterminer le type d'ennemi en fonction de la vague
  const isBossWave = wave % 10 === 0 && wave > 0;
  let enemyType: EnemyType;

  if (isBossWave) {
    enemyType = "boss";
  } else if (type) {
    enemyType = type;
  } else {
    // Distribution selon la difficulté de la vague
    const rand = Math.random();
    if (rand < 0.5) {
      enemyType = "small";
    } else if (rand < 0.8) {
      enemyType = "medium";
    } else {
      enemyType = "large";
    }
  }

  const enemyData = types[enemyType];

  return {
    id: uuidv4(),
    type: enemyType,
    health: enemyData.health,
    maxHealth: enemyData.health,
    speed: enemyData.speed,
    value: enemyData.value,
    expValue: enemyData.expValue,
    size: enemyData.size,
    position: {
      x: screenWidth + Math.random() * 100, // Démarre hors écran à droite
      y: 100 + Math.random() * 200, // Position verticale aléatoire
    },
    isBoss: enemyType === "boss",
  };
};

// Générer une vague d'ennemis
const generateWave = (wave: number): Enemy[] => {
  const isBossWave = wave % 10 === 0 && wave > 0;
  const enemyCount = isBossWave ? 1 : 5 + Math.floor(wave / 2);
  const enemies: Enemy[] = [];

  if (isBossWave) {
    enemies.push(createEnemy("boss", wave));
  } else {
    for (let i = 0; i < enemyCount; i++) {
      enemies.push(createEnemy(null, wave));
    }
  }

  return enemies;
};

// Générer les missions journalières
const generateDailyMissions = (playerLevel: number): Mission[] => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Expire à la fin de la journée

  const missions: Mission[] = [
    {
      id: uuidv4(),
      title: "Extermination alien",
      description: `Détruire ${50 + Math.floor(playerLevel / 5) * 10} ennemis`,
      type: "kill",
      target: 50 + Math.floor(playerLevel / 5) * 10,
      progress: 0,
      reward: {
        coins: 500 + playerLevel * 100,
        gems: 1 + Math.floor(playerLevel / 10),
        exp: 200 + playerLevel * 50,
      },
      completed: false,
      expiresAt: today.toISOString(),
    },
    {
      id: uuidv4(),
      title: "Maître des vagues",
      description: `Compléter ${3 + Math.floor(playerLevel / 10)} vagues`,
      type: "wave",
      target: 3 + Math.floor(playerLevel / 10),
      progress: 0,
      reward: {
        coins: 750 + playerLevel * 150,
        gems: 2 + Math.floor(playerLevel / 8),
        exp: 350 + playerLevel * 70,
      },
      completed: false,
      expiresAt: today.toISOString(),
    },
    {
      id: uuidv4(),
      title: "Amélioration technologique",
      description: "Améliorer vos tourelles 5 fois",
      type: "upgrade",
      target: 5,
      progress: 0,
      reward: {
        coins: 1000 + playerLevel * 200,
        gems: 3 + Math.floor(playerLevel / 5),
        exp: 500 + playerLevel * 100,
      },
      completed: false,
      expiresAt: today.toISOString(),
    },
  ];

  return missions;
};

// Store principal du jeu
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Données joueur
      playerName: "Commandant",
      playerLevel: 1,
      playerExp: 0,
      expToNextLevel: 1000,
      coins: 500,
      gems: 5,

      // Vagues
      currentWave: 1,
      currentEnemiesKilled: 0,
      enemiesPerWave: 5,
      waveInProgress: false,

      // Entités de jeu
      enemies: [],
      spaceships: initialSpaceships,
      currentSpaceshipId: "starter-ship",
      turrets: initialTurrets,

      // Missions
      dailyMissions: [],
      lastMissionsRefresh: null,

      // Statistiques
      stats: {
        totalKills: 0,
        totalWavesCompleted: 0,
        highestWave: 1,
        coinsEarned: 0,
        timeSpent: 0,
        offlineProgress: {
          lastSeen: new Date().toISOString(),
          coinsPerMinute: 0,
          expPerMinute: 0,
        },
      },

      // Actions
      initializeGame: () => {
        const now = new Date();
        const lastRefresh = get().lastMissionsRefresh;

        // Vérifier si nous devons rafraîchir les missions journalières
        if (!lastRefresh || new Date(lastRefresh).getDate() !== now.getDate()) {
          set({
            dailyMissions: generateDailyMissions(get().playerLevel),
            lastMissionsRefresh: now.toISOString(),
          });
        }

        // Calculer les progrès hors ligne
        const lastSeen = get().stats.offlineProgress.lastSeen;
        if (lastSeen) {
          const offlineProgress = get().calculateOfflineProgress(lastSeen);
          if (offlineProgress.time > 0) {
            get().addCoins(offlineProgress.coins);
            get().addPlayerExp(offlineProgress.exp);

            // Mettre à jour le timestamp
            set((state) => ({
              stats: {
                ...state.stats,
                offlineProgress: {
                  ...state.stats.offlineProgress,
                  lastSeen: now.toISOString(),
                },
              },
            }));
          }
        }
      },

      // Démarrer une nouvelle vague
      startWave: () => {
        const currentWave = get().currentWave;
        set({
          enemies: generateWave(currentWave),
          waveInProgress: true,
          currentEnemiesKilled: 0,
        });
      },

      // Compléter une vague
      completeWave: () => {
        const { currentWave, stats } = get();
        const newWave = currentWave + 1;

        // Calculer la progression hors ligne
        const activeTurrets = get().getCurrentActiveTurrets();
        const damagePerSecond = activeTurrets.reduce((total, turret) => {
          return total + turret.damage * turret.fireRate;
        }, 0);

        // En moyenne, combien de pièces et d'XP par minute ?
        const avgEnemyValue = 3 + Math.floor(currentWave / 3);
        const avgEnemyExp = 15 + Math.floor(currentWave / 2);
        const enemiesPerMinute = Math.min(
          60,
          (damagePerSecond * 60) / (10 * Math.pow(1.1, currentWave))
        );

        set({
          currentWave: newWave,
          waveInProgress: false,
          currentEnemiesKilled: 0,
          stats: {
            ...stats,
            totalWavesCompleted: stats.totalWavesCompleted + 1,
            highestWave: Math.max(stats.highestWave, newWave),
            offlineProgress: {
              lastSeen: new Date().toISOString(),
              coinsPerMinute: enemiesPerMinute * avgEnemyValue,
              expPerMinute: enemiesPerMinute * avgEnemyExp,
            },
          },
        });

        // Mettre à jour les missions
        get().updateMissionProgress("wave", 1);
      },

      // Tirer sur un ennemi
      shootEnemy: (enemyId: string, damage: number) => {
        const { enemies, stats } = get();
        const enemy = enemies.find((e) => e.id === enemyId);

        if (!enemy) return;

        const newHealth = enemy.health - damage;

        if (newHealth <= 0) {
          // L'ennemi est détruit
          get().addCoins(enemy.value);
          get().addPlayerExp(enemy.expValue);

          set({
            enemies: enemies.filter((e) => e.id !== enemyId),
            currentEnemiesKilled: get().currentEnemiesKilled + 1,
            stats: {
              ...stats,
              totalKills: stats.totalKills + 1,
              coinsEarned: stats.coinsEarned + enemy.value,
            },
          });

          // Mettre à jour les missions
          get().updateMissionProgress("kill", 1);

          // Vérifier si la vague est terminée
          if (get().enemies.length === 0) {
            get().completeWave();
          }
        } else {
          // Mettre à jour la santé de l'ennemi
          set({
            enemies: enemies.map((e) =>
              e.id === enemyId ? { ...e, health: newHealth } : e
            ),
          });
        }
      },

      // Améliorer une tourelle
      upgradeTurret: (turretId: string) => {
        const { turrets, coins } = get();
        const turretIndex = turrets.findIndex((t) => t.id === turretId);

        if (turretIndex === -1) return false;

        const turret = turrets[turretIndex];
        const upgradeCost = turret.upgradeCost;

        if (coins < upgradeCost) return false;

        const updatedTurrets = [...turrets];
        updatedTurrets[turretIndex] = {
          ...turret,
          level: turret.level + 1,
          damage: Math.floor(turret.damage * 1.2),
          fireRate: turret.fireRate * 1.1,
          upgradeCost: Math.floor(upgradeCost * 1.5),
        };

        set({
          turrets: updatedTurrets,
          coins: coins - upgradeCost,
        });

        // Mettre à jour les missions
        get().updateMissionProgress("upgrade", 1);

        return true;
      },

      // Acheter une tourelle
      purchaseTurret: (turretId: string) => {
        const { turrets, coins } = get();
        const turretIndex = turrets.findIndex((t) => t.id === turretId);

        if (turretIndex === -1) return false;

        const turret = turrets[turretIndex];

        if (turret.unlocked || coins < turret.cost) return false;

        const updatedTurrets = [...turrets];
        updatedTurrets[turretIndex] = {
          ...turret,
          unlocked: true,
        };

        set({
          turrets: updatedTurrets,
          coins: coins - turret.cost,
        });

        return true;
      },

      // Acheter un vaisseau
      purchaseSpaceship: (spaceshipId: string) => {
        const { spaceships, gems } = get();
        const shipIndex = spaceships.findIndex((s) => s.id === spaceshipId);

        if (shipIndex === -1) return false;

        const spaceship = spaceships[shipIndex];

        if (spaceship.unlocked || gems < spaceship.gemCost) return false;

        const updatedSpaceships = [...spaceships];
        updatedSpaceships[shipIndex] = {
          ...spaceship,
          unlocked: true,
        };

        set({
          spaceships: updatedSpaceships,
          gems: gems - spaceship.gemCost,
        });

        return true;
      },

      // Changer de vaisseau
      switchSpaceship: (spaceshipId: string) => {
        const { spaceships } = get();
        const spaceship = spaceships.find((s) => s.id === spaceshipId);

        if (!spaceship || !spaceship.unlocked) return;

        set({ currentSpaceshipId: spaceshipId });
      },

      // Installer une tourelle sur le vaisseau actif
      installTurret: (turretId: string, spaceshipId: string) => {
        const { spaceships, turrets } = get();
        const shipIndex = spaceships.findIndex((s) => s.id === spaceshipId);

        if (shipIndex === -1) return false;

        const spaceship = spaceships[shipIndex];
        const turret = turrets.find((t) => t.id === turretId);

        if (!spaceship.unlocked || !turret || !turret.unlocked) return false;
        if (spaceship.activeTurrets.includes(turretId)) return true; // Déjà installée
        if (spaceship.activeTurrets.length >= spaceship.maxTurrets)
          return false;

        const updatedSpaceships = [...spaceships];
        updatedSpaceships[shipIndex] = {
          ...spaceship,
          activeTurrets: [...spaceship.activeTurrets, turretId],
        };

        set({ spaceships: updatedSpaceships });

        return true;
      },

      // Enlever une tourelle du vaisseau actif
      removeTurret: (turretId: string, spaceshipId: string) => {
        const { spaceships } = get();
        const shipIndex = spaceships.findIndex((s) => s.id === spaceshipId);

        if (shipIndex === -1) return false;

        const spaceship = spaceships[shipIndex];

        if (!spaceship.activeTurrets.includes(turretId)) return false;

        const updatedSpaceships = [...spaceships];
        updatedSpaceships[shipIndex] = {
          ...spaceship,
          activeTurrets: spaceship.activeTurrets.filter(
            (id) => id !== turretId
          ),
        };

        set({ spaceships: updatedSpaceships });

        return true;
      },

      // Mise à jour de la progression des missions
      updateMissionProgress: (type, amount) => {
        const { dailyMissions } = get();

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
        const { dailyMissions } = get();
        const mission = dailyMissions.find((m) => m.id === missionId);

        if (!mission || !mission.completed) return false;

        // Ajouter les récompenses
        get().addCoins(mission.reward.coins);
        get().addGems(mission.reward.gems);
        get().addPlayerExp(mission.reward.exp);

        // Retirer la mission
        set({
          dailyMissions: dailyMissions.filter((m) => m.id !== missionId),
        });

        return true;
      },

      // Ajouter de l'expérience au joueur
      addPlayerExp: (amount: number) => {
        const { playerExp, playerLevel, expToNextLevel } = get();
        const newExp = playerExp + amount;

        // Si on monte de niveau
        if (newExp >= expToNextLevel) {
          const remainingExp = newExp - expToNextLevel;
          const newLevel = playerLevel + 1;
          const nextLevelExp = Math.floor(expToNextLevel * 1.2);

          set({
            playerLevel: newLevel,
            playerExp: remainingExp,
            expToNextLevel: nextLevelExp,
          });

          // Bonus de niveau
          get().addCoins(newLevel * 100);

          // Vérifier si on débloque de nouvelles tourelles
          get().checkTurretUnlocks(newLevel);
        } else {
          set({ playerExp: newExp });
        }
      },

      // Vérifier les déblocages de tourelles selon le niveau
      checkTurretUnlocks: (level: number) => {
        const { turrets } = get();
        const updatedTurrets = [...turrets];

        // Débloquer des tourelles selon le niveau
        if (
          level >= 3 &&
          !turrets.find((t) => t.id === "rapid-turret")?.unlocked
        ) {
          const index = turrets.findIndex((t) => t.id === "rapid-turret");
          if (index !== -1) {
            updatedTurrets[index] = {
              ...updatedTurrets[index],
              unlocked: true,
            };
          }
        }

        if (
          level >= 7 &&
          !turrets.find((t) => t.id === "heavy-turret")?.unlocked
        ) {
          const index = turrets.findIndex((t) => t.id === "heavy-turret");
          if (index !== -1) {
            updatedTurrets[index] = {
              ...updatedTurrets[index],
              unlocked: true,
            };
          }
        }

        if (
          level >= 12 &&
          !turrets.find((t) => t.id === "missile-launcher")?.unlocked
        ) {
          const index = turrets.findIndex((t) => t.id === "missile-launcher");
          if (index !== -1) {
            updatedTurrets[index] = {
              ...updatedTurrets[index],
              unlocked: true,
            };
          }
        }

        set({ turrets: updatedTurrets });
      },

      // Obtenir les tourelles actives sur le vaisseau courant
      getCurrentActiveTurrets: () => {
        const { currentSpaceshipId, spaceships, turrets } = get();
        const currentShip = spaceships.find((s) => s.id === currentSpaceshipId);

        if (!currentShip) return [];

        return currentShip.activeTurrets
          .map((turretId) => {
            return turrets.find((t) => t.id === turretId);
          })
          .filter((t) => t !== undefined) as Turret[];
      },

      // Calculer les progrès hors ligne
      calculateOfflineProgress: (lastSeenTime: string) => {
        const lastSeen = new Date(lastSeenTime);
        const now = new Date();
        const diffMs = now.getTime() - lastSeen.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        const { offlineProgress } = get().stats;

        // Limite de temps offline (max 24h)
        const cappedMinutes = Math.min(diffMinutes, 24 * 60);

        return {
          coins: Math.floor(offlineProgress.coinsPerMinute * cappedMinutes),
          exp: Math.floor(offlineProgress.expPerMinute * cappedMinutes),
          time: cappedMinutes,
        };
      },

      // Ajouter des pièces
      addCoins: (amount: number) => {
        set((state) => ({ coins: state.coins + amount }));
      },

      // Ajouter des gemmes
      addGems: (amount: number) => {
        set((state) => ({ gems: state.gems + amount }));
      },

      // Mettre à jour la position des ennemis
      updateEnemyPositions: (deltaTime: number) => {
        const { enemies } = get();

        if (enemies.length === 0) return;

        const updatedEnemies = enemies.map((enemy) => {
          // Déplacer les ennemis de droite à gauche
          return {
            ...enemy,
            position: {
              ...enemy.position,
              x: enemy.position.x - enemy.speed * 60 * deltaTime,
            },
          };
        });

        // Vérifier si des ennemis ont atteint le bord gauche de l'écran
        const enemiesOnScreen = updatedEnemies.filter(
          (enemy) => enemy.position.x > -50
        );

        set({ enemies: enemiesOnScreen });

        // Si tous les ennemis sont détruits ou hors écran, terminer la vague
        if (enemiesOnScreen.length === 0 && get().waveInProgress) {
          get().completeWave();
        }
      },

      // Attaque par clic
      clickAttack: (x: number, y: number) => {
        const { enemies } = get();

        // Si aucun ennemi, on sort immédiatement
        if (enemies.length === 0) return;

        // Trouver l'ennemi le plus proche explicitement
        let closestIndex = -1;
        let closestDistance = Infinity;

        for (let i = 0; i < enemies.length; i++) {
          const dx = enemies[i].position.x - x;
          const dy = enemies[i].position.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50 && distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }

        // Si on a trouvé un ennemi à portée
        if (closestIndex !== -1) {
          // Obtenir la tourelle active la plus puissante pour les dégâts du clic
          const activeTurrets = get().getCurrentActiveTurrets();
          const highestDamage =
            activeTurrets.length > 0
              ? Math.max(...activeTurrets.map((t) => t.damage))
              : 10; // Dégâts par défaut si aucune tourelle

          // Utiliser directement l'ennemi trouvé à son index
          const targetId = enemies[closestIndex].id;
          get().shootEnemy(targetId, highestDamage);
        }
      },
    }),
    {
      name: "space-idle-storage",
      partialize: (state) => ({
        playerName: state.playerName,
        playerLevel: state.playerLevel,
        playerExp: state.playerExp,
        expToNextLevel: state.expToNextLevel,
        coins: state.coins,
        gems: state.gems,
        currentWave: state.currentWave,
        spaceships: state.spaceships,
        currentSpaceshipId: state.currentSpaceshipId,
        turrets: state.turrets,
        dailyMissions: state.dailyMissions,
        lastMissionsRefresh: state.lastMissionsRefresh,
        stats: state.stats,
      }),
    }
  )
);
