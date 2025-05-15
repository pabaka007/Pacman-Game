import React from 'react';
import { GameState } from '../game/gameState';
import Cell from './Cell';

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { maze, pacman, ghosts, dots, powerPellets } = gameState;
  
  return (
    <div 
      className="grid bg-black border-2 border-blue-600"
      style={{ 
        gridTemplateColumns: `repeat(${maze[0].length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${maze.length}, minmax(0, 1fr))`,
        aspectRatio: `${maze[0].length} / ${maze.length}`,
        maxWidth: '100%',
        margin: '0 auto'
      }}
    >
      {maze.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          // Check for entities at this position
          const isPacman = pacman.position.x === colIndex && pacman.position.y === rowIndex;
          
          const ghost = ghosts.find(g => g.position.x === colIndex && g.position.y === rowIndex);
          
          const hasDot = dots.some(dot => dot.x === colIndex && dot.y === rowIndex);
          
          const hasPowerPellet = powerPellets.some(
            pellet => pellet.x === colIndex && pellet.y === rowIndex
          );

          return (
            <Cell 
              key={`${rowIndex}-${colIndex}`}
              type={cell}
              isPacman={isPacman}
              pacmanDirection={isPacman ? pacman.direction : undefined}
              ghost={ghost}
              hasDot={hasDot}
              hasPowerPellet={hasPowerPellet}
              frightened={gameState.powerMode}
            />
          );
        })
      )}
    </div>
  );
};

export default GameBoard;