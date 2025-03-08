// src/contexts/SoundContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Howl } from "howler";

// Types pour les sons
type SoundType =
  | "click"
  | "hit"
  | "explosion"
  | "levelUp"
  | "buyUpgrade"
  | "waveComplete"
  | "buttonClick";

interface SoundContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  playSound: (sound: SoundType) => void;
}

// Création du contexte
const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Sources des sons (à remplacer par vos fichiers réels)
const SOUND_SOURCES: Record<SoundType, string> = {
  click:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  hit: "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  explosion:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  levelUp:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  buyUpgrade:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  waveComplete:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
  buttonClick:
    "data:audio/wav;base64,UklGRl9CAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVtCAACA",
};

// Provider pour le contexte de son
export const SoundProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const savedMute = localStorage.getItem("spaceclicker-muted");
    return savedMute ? JSON.parse(savedMute) : false;
  });

  const [volume, setVolumeState] = useState<number>(() => {
    const savedVolume = localStorage.getItem("spaceclicker-volume");
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  const [sounds, setSounds] = useState<Record<SoundType, Howl | null>>({
    click: null,
    hit: null,
    explosion: null,
    levelUp: null,
    buyUpgrade: null,
    waveComplete: null,
    buttonClick: null,
  });

  // Initialiser les sons
  useEffect(() => {
    const loadedSounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;

    Object.entries(SOUND_SOURCES).forEach(([key, src]) => {
      loadedSounds[key as SoundType] = new Howl({
        src: [src],
        volume: volume,
        mute: isMuted,
      });
    });

    setSounds(loadedSounds);

    // Nettoyage
    return () => {
      Object.values(loadedSounds).forEach((sound) => {
        sound.unload();
      });
    };
  }, []);

  // Mettre à jour le volume et l'état muet des sons
  useEffect(() => {
    Object.values(sounds).forEach((sound) => {
      if (sound) {
        sound.volume(volume);
        sound.mute(isMuted);
      }
    });

    localStorage.setItem("spaceclicker-muted", JSON.stringify(isMuted));
    localStorage.setItem("spaceclicker-volume", volume.toString());
  }, [isMuted, volume, sounds]);

  // Fonction pour activer/désactiver le son
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Fonction pour définir le volume
  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume))); // Limiter entre 0 et 1
  };

  // Fonction pour jouer un son
  const playSound = (sound: SoundType) => {
    if (!isMuted && sounds[sound]) {
      sounds[sound]?.play();
    }
  };

  return (
    <SoundContext.Provider
      value={{ isMuted, volume, toggleMute, setVolume, playSound }}
    >
      {children}
    </SoundContext.Provider>
  );
};

// Hook pour utiliser le contexte de son
export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
