export interface Cell {
  value: number;
  revealed: boolean;
  flagged: boolean;
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface CellAction {
  type: 'reveal' | 'flag' | 'chord';
  position: GridPosition;
  cellsToReveal?: GridPosition[];
}

export interface GameState {
  grid: Cell[][];
  gameOver: boolean;
  gameWon: boolean;
  remainingFlags: number;
  time?: number;
  winTime?: number;
  gameStarted?: boolean;
  gameTime?: number;
  startTime?: number | null;
}

export type CellUpdateHandler = (row: number, col: number, action: 'reveal' | 'flag' | 'chord') => void; 