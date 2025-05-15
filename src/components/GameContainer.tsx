import React, { useState } from 'react';
import StartScreen from './StartScreen';
import Game from './Game';
import GameOverScreen from './GameOverScreen';

export type GameState = 'start' | 'playing' | 'gameOver';

const GameContainer: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const endGame = (finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
  };

  const restartGame = () => {
    setGameState('start');
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-blue-500">
      <header className="bg-black py-4 px-6 border-b-4 border-blue-500">
        <h1 className="text-4xl font-bold text-yellow-400 text-center tracking-wider">PACMAN</h1>
      </header>

      <div className="relative">
        {gameState === 'start' && <StartScreen onStart={startGame} />}
        {gameState === 'playing' && <Game onGameOver={endGame} />}
        {gameState === 'gameOver' && <GameOverScreen score={score} onRestart={restartGame} />}
      </div>
    </div>
  );
};

export default GameContainer;