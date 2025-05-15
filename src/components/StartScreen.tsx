import React from 'react';
import { Ghost } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white p-8 min-h-[500px]">
      <div className="text-yellow-400 text-8xl mb-6">
        <div className="animate-pulse">
          ᗧ···ᗣ···ᗣ
        </div>
      </div>
      
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">HOW TO PLAY</h2>
        <ul className="text-lg space-y-2">
          <li><span className="text-yellow-400">•</span> Use arrow keys to move Pacman</li>
          <li><span className="text-yellow-400">•</span> Eat all dots to complete the level</li>
          <li><span className="text-yellow-400">•</span> Avoid ghosts or game over!</li>
          <li><span className="text-yellow-400">•</span> Eat power pellets to hunt ghosts</li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <Ghost size={32} className="text-red-500" />
        <Ghost size={32} className="text-pink-500" />
        <Ghost size={32} className="text-cyan-500" />
        <Ghost size={32} className="text-orange-500" />
      </div>

      <button 
        onClick={onStart}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50"
      >
        START GAME
      </button>
    </div>
  );
};

export default StartScreen;