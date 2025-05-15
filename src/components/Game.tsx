import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import { useKeyPress } from '../hooks/useKeyPress';
import { Direction, GameStatus, initialGameState } from '../game/gameState';
import { updateGameState } from '../game/gameLogic';
import ScoreBoard from './ScoreBoard';

interface GameProps {
  onGameOver: (score: number) => void;
}

const Game: React.FC<GameProps> = ({ onGameOver }) => {
  const [gameState, setGameState] = useState(initialGameState);
  const [isPaused, setIsPaused] = useState(false);

  // Set up key press handlers
  const upPressed = useKeyPress('ArrowUp');
  const downPressed = useKeyPress('ArrowDown');
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');
  const spacePressed = useKeyPress(' ');

  // Handle directional input
  useEffect(() => {
    let newDirection: Direction | null = null;
    
    if (upPressed) newDirection = 'up';
    else if (downPressed) newDirection = 'down';
    else if (leftPressed) newDirection = 'left';
    else if (rightPressed) newDirection = 'right';
    
    if (newDirection) {
      setGameState(prevState => ({
        ...prevState,
        pacman: {
          ...prevState.pacman,
          nextDirection: newDirection
        }
      }));
    }
  }, [upPressed, downPressed, leftPressed, rightPressed]);

  // Handle pause
  useEffect(() => {
    if (spacePressed) {
      setIsPaused(prev => !prev);
    }
  }, [spacePressed]);

  // Main game loop
  useEffect(() => {
    if (isPaused) return;
    
    const gameLoop = setInterval(() => {
      setGameState(prevState => {
        const newState = updateGameState(prevState);
        
        // Check if game over
        if (newState.status === GameStatus.GAME_OVER) {
          clearInterval(gameLoop);
          onGameOver(newState.score);
        }
        
        // Check if level complete
        if (newState.status === GameStatus.LEVEL_COMPLETE) {
          // Handle level completion (not implemented in this MVP)
        }
        
        return newState;
      });
    }, 200); // Game tick speed
    
    return () => clearInterval(gameLoop);
  }, [isPaused, onGameOver]);

  return (
    <div className="relative bg-black p-4">
      <ScoreBoard score={gameState.score} lives={gameState.lives} level={gameState.level} />
      
      <div className="relative">
        {isPaused && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
            <div className="text-white text-4xl font-bold">PAUSED</div>
          </div>
        )}
        <GameBoard gameState={gameState} />
      </div>
      
      <div className="mt-4 text-white text-sm text-center">
        <p>Use arrow keys to move • Press SPACE to pause</p>
      </div>
    </div>
  );
};

export default Game;