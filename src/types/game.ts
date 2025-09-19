// Five Elements Chess Game Types

export type ElementType = 'kim' | 'thuy' | 'moc' | 'hoa' | 'tho';
export type PlayerType = 'day' | 'night'; // Ban ngày (trắng) vs Ban đêm (đen)
export type PieceType = ElementType | 'chu'; // Chu = Master piece

export interface Position {
  row: number; // 1-7
  col: string; // A-G
}

export interface GamePiece {
  id: string;
  type: PieceType;
  player: PlayerType;
  position: Position;
  isAlive: boolean;
}

export interface GameState {
  board: (GamePiece | null)[][];
  currentPlayer: PlayerType;
  selectedPiece: GamePiece | null;
  validMoves: Position[];
  capturedPieces: {
    day: GamePiece[];
    night: GamePiece[];
  };
  gameStatus: 'playing' | 'day-wins' | 'night-wins' | 'draw';
  moveHistory: GameMove[];
}

export interface GameMove {
  from: Position;
  to: Position;
  piece: GamePiece;
  capturedPiece?: GamePiece;
  regeneratedPiece?: GamePiece;
  timestamp: number;
}

// Five Elements Cycles
export const DESTRUCTION_CYCLE: Record<ElementType, ElementType> = {
  kim: 'moc',    // Kim khắc Mộc (Metal cuts Wood)
  moc: 'tho',    // Mộc khắc Thổ (Wood depletes Earth) 
  tho: 'thuy',   // Thổ khắc Thủy (Earth absorbs Water)
  thuy: 'hoa',   // Thủy khắc Hỏa (Water extinguishes Fire)
  hoa: 'kim',    // Hỏa khắc Kim (Fire melts Metal)
};

export const GENERATION_CYCLE: Record<ElementType, ElementType> = {
  hoa: 'tho',    // Hỏa sinh Thổ (Fire creates Earth/ash)
  tho: 'kim',    // Thổ sinh Kim (Earth creates Metal)
  kim: 'thuy',   // Kim sinh Thủy (Metal collects Water)
  thuy: 'moc',   // Thủy sinh Mộc (Water nourishes Wood)
  moc: 'hoa',    // Mộc sinh Hỏa (Wood feeds Fire)
};

// Board constants
export const BOARD_SIZE = 7;
export const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const ROWS = [1, 2, 3, 4, 5, 6, 7];
export const CENTER_POSITION = { row: 4, col: 'D' }; // Red center square

// Initial piece positions
export const INITIAL_POSITIONS: Record<string, { type: PieceType; player: PlayerType }> = {
  // Day player (white pieces) - bottom
  'A1': { type: 'thuy', player: 'day' },
  'B1': { type: 'kim', player: 'day' },
  'C1': { type: 'tho', player: 'day' }, // Actually this should be normal piece, but master goes to D1
  'D1': { type: 'chu', player: 'day' },  // Master
  'E1': { type: 'tho', player: 'day' },  // Actually this should be normal piece
  'F1': { type: 'kim', player: 'day' },
  'G1': { type: 'thuy', player: 'day' },
  'A2': { type: 'moc', player: 'day' },
  'C2': { type: 'hoa', player: 'day' },
  'E2': { type: 'hoa', player: 'day' },
  'G2': { type: 'moc', player: 'day' },

  // Night player (black pieces) - top  
  'A7': { type: 'thuy', player: 'night' },
  'B7': { type: 'kim', player: 'night' },
  'C7': { type: 'tho', player: 'night' },
  'D7': { type: 'chu', player: 'night' }, // Master
  'E7': { type: 'tho', player: 'night' },
  'F7': { type: 'kim', player: 'night' },
  'G7': { type: 'thuy', player: 'night' },
  'A6': { type: 'moc', player: 'night' },
  'C6': { type: 'hoa', player: 'night' },
  'E6': { type: 'hoa', player: 'night' },
  'G6': { type: 'moc', player: 'night' },
};