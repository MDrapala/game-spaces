// src/contexts/SoundContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Définir l'interface pour le navigateur avec webkitAudioContext
interface WindowWithWebkitAudio extends Window {
  webkitAudioContext: typeof AudioContext;
}

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

  // Fonction pour créer un son avec Web Audio API
  const playSoundEffect = (type: SoundType) => {
    if (isMuted) return;

    try {
      // Créer un contexte audio avec le bon typage
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as WindowWithWebkitAudio).webkitAudioContext;
      const audioContext = new AudioContextClass();

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Régler le volume global
      gainNode.gain.value = volume;

      // Différentes fréquences et durées selon le type de son
      switch (type) {
        case "click":
          oscillator.type = "sine";
          oscillator.frequency.value = 440; // La
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case "hit":
          oscillator.type = "sine";
          oscillator.frequency.value = 659; // Mi
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.15);
          break;
        case "explosion":
          oscillator.type = "sawtooth";
          oscillator.frequency.value = 220; // La grave
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case "levelUp":
          // Son ascendant
          oscillator.type = "square";
          oscillator.frequency.value = 440;
          oscillator.start();
          oscillator.frequency.linearRampToValueAtTime(
            880,
            audioContext.currentTime + 0.5
          );
          oscillator.stop(audioContext.currentTime + 0.5);
          break;
        case "buyUpgrade":
          oscillator.type = "sine";
          oscillator.frequency.value = 523; // Do
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case "waveComplete":
          oscillator.type = "sine";
          oscillator.frequency.value = 784; // Sol
          oscillator.start();
          oscillator.frequency.linearRampToValueAtTime(
            1047,
            audioContext.currentTime + 0.3
          ); // Do aigu
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case "buttonClick":
          oscillator.type = "sine";
          oscillator.frequency.value = 392; // Sol grave
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.08);
          break;
        default:
          oscillator.type = "sine";
          oscillator.frequency.value = 440;
          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du son:", error);
    }
  };

  // Mettre à jour le volume et l'état muet dans le stockage local
  useEffect(() => {
    localStorage.setItem("spaceclicker-muted", JSON.stringify(isMuted));
    localStorage.setItem("spaceclicker-volume", volume.toString());
  }, [isMuted, volume]);

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
    playSoundEffect(sound);
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
