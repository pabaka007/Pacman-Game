import React from 'react';
import { CellType, Direction, Ghost } from '../game/gameState';
import { Ghost as GhostIcon } from 'lucide-react';

interface CellProps {
  type: CellType;
  isPacman: boolean;
  pacmanDirection?: Direction;
  ghost?: Ghost | undefined;
  hasDot: boolean;
  hasPowerPellet: boolean;
  frightened: boolean;
}

const Cell: React.FC<CellProps> = ({ 
  type, 
  isPacman, 
  pacmanDirection = 'right', 
  ghost, 
  hasDot, 
  hasPowerPellet,
  frightened
}) => {
  // Determine cell background based on type
  let cellClass = "w-full h-full flex items-center justify-center";
  
  if (type === CellType.WALL) {
    cellClass += " bg-blue-900";
  }

  // Render Pacman
  if (isPacman) {
    let pacmanRotation = 0;
    
    // Determine rotation based on direction
    switch(pacmanDirection) {
      case 'right': pacmanRotation = 0; break;
      case 'down': pacmanRotation = 90; break;
      case 'left': pacmanRotation = 180; break;
      case 'up': pacmanRotation = 270; break;
    }
    
    return (
      <div className={cellClass}>
        <div 
          className="text-yellow-400 text-2xl animate-pulse"
          style={{ transform: `rotate(${pacmanRotation}deg)` }}
        >
          ᗧ
        </div>
      </div>
    );
  }
  
  // Render Ghost
  if (ghost) {
    let ghostColor = "text-red-500";
    
    // Assign colors based on ghost type
    switch(ghost.type) {
      case 'blinky': ghostColor = "text-red-500"; break;
      case 'pinky': ghostColor = "text-pink-500"; break;
      case 'inky': ghostColor = "text-cyan-500"; break;
      case 'clyde': ghostColor = "text-orange-500"; break;
    }
    
    // If frightened, make ghost blue
    if (frightened) {
      ghostColor = "text-blue-400";
    }
    
    return (
      <div className={cellClass}>
        <GhostIcon className={`${ghostColor} w-full h-full`} />
      </div>
    );
  }
  
  // Render dots and power pellets
  if (hasPowerPellet) {
    return (
      <div className={cellClass}>
        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
      </div>
    );
  }
  
  if (hasDot) {
    return (
      <div className={cellClass}>
        <div className="w-1.5 h-1.5 bg-yellow-100 rounded-full"></div>
      </div>
    );
  }
  
  // Empty cell
  return <div className={cellClass}></div>;
};

export default Cell;