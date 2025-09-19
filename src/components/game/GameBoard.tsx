import { GameState, Position, COLUMNS, ROWS, ROWS_TO_DIAGONALS, COLUMNS_TO_DIAGONALS } from '@/types/game';
import { GamePiece } from './GamePiece';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
}

export const GameBoard = ({ gameState, onSquareClick }: GameBoardProps) => {
  const { board, selectedPiece, validMoves } = gameState;

  const isValidMove = (position: Position): boolean => {
    return validMoves.some(move => 
      move.row === position.row && move.col === position.col
    );
  };

  const isCenter = (position: Position): boolean => {
    return position.row === 4 && position.col === 'D';
  };

  const getPieceAt = (position: Position) => {
    const colIndex = COLUMNS.indexOf(position.col);
    const rowIndex = position.row - 1;
    return board[rowIndex][colIndex];
  };

  return (
    <div className="relative w-full flex justify-center">
      {/* Board Container */}
      <div
        className="relative w-full max-w-[560px] aspect-square rounded-lg shadow-2xl"
        style={{ background: 'var(--gradient-board)' }}
      >
        {/* Grid Lines - Horizontal and Vertical */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 560" preserveAspectRatio="xMidYMid meet">
          {/* Horizontal lines */}
          {ROWS.map((row, index) => (
            <line
              key={`h-${row}`}
              x1="40"
              y1={40 + index * 80}
              x2="520"
              y2={40 + index * 80}
              stroke="hsl(var(--grid-line))"
              strokeWidth="2"
            />
          ))}
          
          {/* Vertical lines */}
          {COLUMNS.map((col, index) => (
            <line
              key={`v-${col}`}
              x1={40 + index * 80}
              y1="40"
              x2={40 + index * 80}
              y2="520"
              stroke="hsl(var(--grid-line))"
              strokeWidth="2"
            />
          ))}

          {/* Diagonal lines */}
          <line x1="520" y1="40" x2="40" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="200" y1="40" x2="40" y2="200" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="360" y1="40" x2="40" y2="360" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="520" y1="360" x2="360" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="520" y1="200" x2="200" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />

          <line x1="40" y1="40" x2="520" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="40" y1="200" x2="360" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="520" y1="360" x2="200" y2="40" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="360" y1="40" x2="520" y2="200" stroke="hsl(var(--grid-line))" strokeWidth="2" />
          <line x1="40" y1="360" x2="200" y2="520" stroke="hsl(var(--grid-line))" strokeWidth="2" />


        </svg>

        {/* Row and Column Labels */}
        {COLUMNS.map((col, index) => (
          <div
            key={`col-${col}`}
            className="absolute text-lg font-bold text-game-border"
            style={{
              left: `${40 + index * 80 - 8}px`,
              bottom: '8px',
            }}
          >
            {col}
          </div>
        ))}
        
        {ROWS.map((row, index) => (
          <div
            key={`row-${row}`}
            className="absolute text-lg font-bold text-game-border"
            style={{
              left: '8px',
              top: `${40 + (ROWS.length - 1 - index) * 80 - 12}px`,
            }}
          >
            {row}
          </div>
        ))}

        {/* Game Squares */}
        {ROWS.map((row) =>
          COLUMNS.map((col) => {
            const position = { row, col };
            const piece = getPieceAt(position);
            const isValidMoveSquare = isValidMove(position);
            const isCenterSquare = isCenter(position);
            
            return (
              <div
                key={`${col}${row}`}
                className={cn(
                  "absolute w-16 h-16 flex items-center justify-center cursor-pointer",
                  "transition-all duration-200 rounded-full",
                  isCenterSquare && "bg-game-center shadow-lg",
                  isValidMoveSquare && !piece && "bg-state-valid opacity-60 animate-pulse",
                  !isCenterSquare && !piece && "hover:bg-muted/30"
                )}
                style={{
                  left: `${40 + COLUMNS.indexOf(col) * 80 - 32}px`,
                  top: `${40 + (ROWS.length - row) * 80 - 32}px`,
                }}
                onClick={() => onSquareClick(position)}
              >
                {piece && (
                  <GamePiece
                    piece={piece}
                    isSelected={selectedPiece?.id === piece.id}
                    isValidMove={isValidMoveSquare}
                    onClick={() => onSquareClick(position)}
                  />
                )}
                
                {/* Center universe marker */}
                {isCenterSquare && !piece && (
                  <div className="w-6 h-6 rounded-full bg-primary animate-pulse shadow-lg" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};