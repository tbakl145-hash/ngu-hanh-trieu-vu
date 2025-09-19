import { GameState, Position, COLUMNS, ROWS } from '@/types/game';
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
    <div className="relative">
      {/* Board Container */}
      <div 
        className="relative w-[560px] h-[560px] mx-auto rounded-lg shadow-2xl"
        style={{ background: 'var(--gradient-board)' }}
      >
        {/* Grid Lines - Horizontal and Vertical */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 560">
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

          {/* Diagonal lines - only from odd rows (1,3,5,7) and specific columns (A,C,F,G) */}
          {ROWS.map((row, rowIndex) => 
            COLUMNS.map((col, colIndex) => {
              // Only draw diagonals from odd rows and specific columns (A, C, F, G)
              const isOddRow = row % 2 === 1;
              const isDiagonalCol = ['A', 'C', 'F', 'G'].includes(col);
              
              if (!isOddRow || !isDiagonalCol) {
                return null;
              }
              
              const x = 40 + colIndex * 80;
              const y = 40 + (ROWS.length - row) * 80; // Adjusted for correct positioning
              
              const lines = [];
              
              // Draw diagonals to adjacent squares (all 4 diagonal directions)
              const diagonalDirections = [
                [-1, -1], // Top-left
                [-1, 1],  // Top-right
                [1, -1],  // Bottom-left
                [1, 1]    // Bottom-right
              ];
              
              diagonalDirections.forEach(([deltaRow, deltaCol], index) => {
                const targetRow = row + deltaRow;
                const targetColIndex = colIndex + deltaCol;
                const targetCol = COLUMNS[targetColIndex];
                
                // Check if target position is within bounds
                if (targetRow >= 1 && targetRow <= 7 && targetColIndex >= 0 && targetColIndex < 7) {
                  const targetX = 40 + targetColIndex * 80;
                  const targetY = 40 + (ROWS.length - targetRow) * 80;
                  
                  lines.push(
                    <line
                      key={`diag-${row}-${col}-${index}`}
                      x1={x}
                      y1={y}
                      x2={targetX}
                      y2={targetY}
                      stroke="hsl(var(--grid-line))"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                  );
                }
              });
              
              return lines;
            })
          )}
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