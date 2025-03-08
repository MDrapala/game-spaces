import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import GameScreen from "./pages/GameScreen";
import Hangar from "./pages/Hangar";
import Missions from "./pages/Missions";
import Upgrades from "./pages/Upgrades";
import Shop from "./pages/Shop";
import Settings from "./pages/Settings";
import { useGameStore } from "./store/gameStore";
import { SoundProvider } from "./contexts/SoundContext";
import "./App.css";

function App() {
  const initializeGame = useGameStore((state) => state.initializeGame);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <SoundProvider>
      <BrowserRouter>
        <div className="app-container bg-space-dark min-h-screen text-white">
          <Routes>
            <Route path="/" element={<GameScreen />} />
            <Route path="/hangar" element={<Hangar />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/upgrades" element={<Upgrades />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SoundProvider>
  );
}

export default App;
