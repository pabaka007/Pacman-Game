import { CellType, Direction, GameState, GameStatus, Position } from './gameState';

// Update the game state based on the current state
export function updateGameState(state: GameState): GameState {
  // If game is over or level complete, return state unchanged
  if (state.status === GameStatus.GAME_OVER || state.status === GameStatus.LEVEL_COMPLETE) {
    return state;
  }
  
  // Create a new state object to avoid mutating the original state
  const newState = { ...state };
  
  // Update power mode timer if active
  if (newState.powerMode) {
    newState.powerModeTimer -= 1;
    if (newState.powerModeTimer <= 0) {
      newState.powerMode = false;
      // Reset ghost modes
      newState.ghosts = newState.ghosts.map(ghost => ({
        ...ghost,
        mode: 'chase' as const
      }));
    }
  }
  
  // Move Pacman
  newState.pacman = movePacman(newState);
  
  // Check for dot collection
  newState.dots = newState.dots.filter(dot => {
    if (dot.x === newState.pacman.position.x && dot.y === newState.pacman.position.y) {
      // Increase score when collecting a dot
      newState.score += 10;
      return false;
    }
    return true;
  });
  
  // Check for power pellet collection
  newState.powerPellets = newState.powerPellets.filter(pellet => {
    if (pellet.x === newState.pacman.position.x && pellet.y === newState.pacman.position.y) {
      // Activate power mode
      newState.powerMode = true;
      newState.powerModeTimer = 20; // Last for 20 game ticks
      newState.score += 50;
      
      // Set all ghosts to frightened mode
      newState.ghosts = newState.ghosts.map(ghost => ({
        ...ghost,
        mode: 'frightened' as const
      }));
      
      return false;
    }
    return true;
  });
  
  // Move ghosts
  newState.ghosts = newState.ghosts.map(ghost => moveGhost(ghost, newState));
  
  // Check for ghost collisions
  newState.ghosts.forEach(ghost => {
    if (ghost.position.x === newState.pacman.position.x && ghost.position.y === newState.pacman.position.y) {
      if (newState.powerMode) {
        // Pacman eats ghost when in power mode
        newState.score += 200;
        
        // Reset ghost position (simplified for this MVP)
        ghost.position = { x: 9, y: 9 };
        ghost.mode = 'scatter';
      } else {
        // Ghost catches Pacman
        newState.lives -= 1;
        
        if (newState.lives <= 0) {
          newState.status = GameStatus.GAME_OVER;
        } else {
          // Reset positions
          newState.pacman.position = { x: 9, y: 15 };
          newState.pacman.direction = 'right';
          newState.pacman.nextDirection = 'right';
        }
      }
    }
  });
  
  // Check if all dots and power pellets are collected
  if (newState.dots.length === 0 && newState.powerPellets.length === 0) {
    newState.status = GameStatus.LEVEL_COMPLETE;
  }
  
  return newState;
}

// Move Pacman based on direction and check for collisions
function movePacman(state: GameState) {
  const pacman = { ...state.pacman };
  
  // Try to change direction if requested
  if (pacman.nextDirection !== pacman.direction) {
    const nextPosition = getNextPosition(pacman.position, pacman.nextDirection);
    
    // Check if the next position is valid (not a wall)
    if (isValidPosition(nextPosition, state.maze)) {
      pacman.direction = pacman.nextDirection;
    }
  }
  
  // Move in the current direction
  const nextPosition = getNextPosition(pacman.position, pacman.direction);
  
  // Update position if valid
  if (isValidPosition(nextPosition, state.maze)) {
    pacman.position = nextPosition;
  }
  
  return pacman;
}

// Move ghost based on its mode and target
function moveGhost(ghost: any, state: GameState) {
  const newGhost = { ...ghost };
  
  // Simple ghost AI for MVP
  // In a real implementation, each ghost would have its own targeting strategy
  
  // Get all valid moves (excluding walls)
  const possibleMoves: Direction[] = ['up', 'down', 'left', 'right'].filter(dir => {
    const nextPos = getNextPosition(ghost.position, dir as Direction);
    return isValidPosition(nextPos, state.maze);
  }) as Direction[];
  
  // Remove the opposite of the current direction (ghosts don't turn around)
  // Unless they have no other choice
  if (possibleMoves.length > 1) {
    const oppositeDirection = getOppositeDirection(ghost.direction);
    const filteredMoves = possibleMoves.filter(dir => dir !== oppositeDirection);
    
    if (filteredMoves.length > 0) {
      // If in frightened mode, choose random direction
      if (ghost.mode === 'frightened') {
        const randomIndex = Math.floor(Math.random() * filteredMoves.length);
        newGhost.direction = filteredMoves[randomIndex];
      } else {
        // Simple targeting: Move in the direction of Pacman
        // This is a very simplified AI, real Pacman ghosts have more complex behavior
        let bestDirection = filteredMoves[0];
        let bestDistance = calculateDistance(
          getNextPosition(ghost.position, filteredMoves[0]), 
          state.pacman.position
        );
        
        for (let i = 1; i < filteredMoves.length; i++) {
          const nextPos = getNextPosition(ghost.position, filteredMoves[i]);
          const distance = calculateDistance(nextPos, state.pacman.position);
          
          // If scatter mode, maximize distance (run away), otherwise minimize (chase)
          if ((ghost.mode === 'scatter' && distance > bestDistance) || 
              (ghost.mode === 'chase' && distance < bestDistance)) {
            bestDistance = distance;
            bestDirection = filteredMoves[i];
          }
        }
        
        newGhost.direction = bestDirection;
      }
    } else {
      // If somehow we filtered all moves, use any valid move
      newGhost.direction = possibleMoves[0];
    }
  } else if (possibleMoves.length === 1) {
    // Only one way to go
    newGhost.direction = possibleMoves[0];
  }
  
  // Move in the chosen direction
  newGhost.position = getNextPosition(ghost.position, newGhost.direction);
  
  return newGhost;
}

// Helper function to check if a position is valid (not a wall)
function isValidPosition(position: Position, maze: CellType[][]): boolean {
  // Check bounds
  if (position.y < 0 || position.y >= maze.length || 
      position.x < 0 || position.x >= maze[0].length) {
    return false;
  }
  
  // Check if the position is a wall
  return maze[position.y][position.x] !== CellType.WALL;
}

// Helper function to get the next position based on the current position and direction
function getNextPosition(position: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':
      return { x: position.x, y: position.y - 1 };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
  }
}

// Helper function to get the opposite direction
function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
}

// Helper function to calculate Manhattan distance between two positions
function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}