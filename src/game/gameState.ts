export enum CellType {
  EMPTY = 0,
  WALL = 1,
}

export enum GameStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver',
  LEVEL_COMPLETE = 'levelComplete',
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Position = {
  x: number;
  y: number;
};

export type GhostType = 'blinky' | 'pinky' | 'inky' | 'clyde';

export interface Pacman {
  position: Position;
  direction: Direction;
  nextDirection: Direction;
  animation: number;
}

export interface Ghost {
  position: Position;
  direction: Direction;
  type: GhostType;
  mode: 'chase' | 'scatter' | 'frightened';
}

export interface GameState {
  maze: CellType[][];
  pacman: Pacman;
  ghosts: Ghost[];
  dots: Position[];
  powerPellets: Position[];
  score: number;
  lives: number;
  level: number;
  powerMode: boolean;
  powerModeTimer: number;
  status: GameStatus;
}

// Define the initial maze layout
const initialMaze: CellType[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Generate dots from the maze
function generateDots(maze: CellType[][]): Position[] {
  const dots: Position[] = [];
  
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      // Place dots in empty cells, excluding specific positions
      if (maze[y][x] === CellType.EMPTY) {
        // Skip ghost house and a few other strategic positions
        if (
          !(x >= 8 && x <= 10 && y >= 8 && y <= 10) && // Ghost area
          !(x === 9 && y === 7) // Pacman start position
        ) {
          dots.push({ x, y });
        }
      }
    }
  }
  
  return dots;
}

// Define power pellet positions
const powerPelletPositions: Position[] = [
  { x: 1, y: 3 },
  { x: 17, y: 3 },
  { x: 1, y: 17 },
  { x: 17, y: 17 }
];

// Initial game state
export const initialGameState: GameState = {
  maze: initialMaze,
  pacman: {
    position: { x: 9, y: 15 },
    direction: 'right',
    nextDirection: 'right',
    animation: 0
  },
  ghosts: [
    {
      position: { x: 8, y: 9 },
      direction: 'right',
      type: 'blinky',
      mode: 'chase'
    },
    {
      position: { x: 9, y: 9 },
      direction: 'up',
      type: 'pinky',
      mode: 'scatter'
    },
    {
      position: { x: 10, y: 9 },
      direction: 'left',
      type: 'inky',
      mode: 'scatter'
    },
    {
      position: { x: 9, y: 8 },
      direction: 'down',
      type: 'clyde',
      mode: 'scatter'
    }
  ],
  dots: generateDots(initialMaze),
  powerPellets: powerPelletPositions,
  score: 0,
  lives: 3,
  level: 1,
  powerMode: false,
  powerModeTimer: 0,
  status: GameStatus.PLAYING
};