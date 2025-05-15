import React from 'react';
import { Ghost } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white p-8 min-h-[500px]">
      <h2 className="text-5xl font-bold mb-6 text-red-500 animate-pulse">GAME OVER</h2>
      
      <div className="flex items-center justify-center mb-4">
        <Ghost className="text-red-500" size={48} />
      </div>
      
      <p className="text-2xl mb-6">Your Score: <span className="text-yellow-400 font-bold">{score}</span></p>
      
      <button 
        onClick={onRestart}
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full text-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;