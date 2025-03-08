// src/components/NavigationBar.tsx
import React from "react";
import { useSound } from "../contexts/SoundContext";

type NavPage =
  | "game"
  | "hangar"
  | "missions"
  | "upgrades"
  | "shop"
  | "settings";

interface NavigationBarProps {
  currentPage: NavPage;
  onNavigate: (page: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentPage,
  onNavigate,
}) => {
  const { playSound } = useSound();

  const handleNavigate = (page: string) => {
    if (page !== currentPage) {
      playSound("buttonClick");
      onNavigate(page);
    }
  };

  const navItems: { id: NavPage; label: string; icon: string }[] = [
    { id: "game", label: "Jeu", icon: "🚀" },
    { id: "hangar", label: "Hangar", icon: "🛠️" },
    { id: "missions", label: "Missions", icon: "📋" },
    { id: "upgrades", label: "Améliorations", icon: "⚡" },
    { id: "shop", label: "Boutique", icon: "🛒" },
    { id: "settings", label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <div className="bg-space-blue p-2 flex justify-around items-center">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center p-2 rounded-lg ${
            currentPage === item.id
              ? "bg-space-light-blue"
              : "hover:bg-space-light-blue hover:bg-opacity-50"
          }`}
          onClick={() => handleNavigate(item.id)}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-xs text-white">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NavigationBar;
