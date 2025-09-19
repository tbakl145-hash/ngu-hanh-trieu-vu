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

          {/* Specific diagonal lines from edge to edge */}
          {(() => {
            const diagonalLines = [];
            
            // From left to right, bottom to top: 1-G, 3-E, 5-C, C-5, E-3
            const bottomToTopDiagonals = [
              { fromRow: 1, fromCol: 'A', toRow: 7, toCol: 'G' }, // 1-G
              { fromRow: 3, fromCol: 'A', toRow: 5, toCol: 'E' }, // 3-E  
              { fromRow: 5, fromCol: 'A', toRow: 3, toCol: 'C' }, // 5-C
              { fromRow: 3, fromCol: 'C', toRow: 5, toCol: 'A' }, // C-5 (reverse)
              { fromRow: 5, fromCol: 'E', toRow: 3, toCol: 'A' }, // E-3 (reverse)
            ];
            
            // From left to right, top to bottom: 3-C, 5-E, 7-G, C-3, E-5
            const topToBottomDiagonals = [
              { fromRow: 7, fromCol: 'A', toRow: 5, toCol: 'C' }, // 3-C (from top)
              { fromRow: 7, fromCol: 'C', toRow: 5, toCol: 'E' }, // 5-E (from top)
              { fromRow: 7, fromCol: 'E', toRow: 1, toCol: 'G' }, // 7-G (from top)
              { fromRow: 5, fromCol: 'C', toRow: 7, toCol: 'A' }, // C-3 (reverse)
              { fromRow: 5, fromCol: 'E', toRow: 7, toCol: 'C' }, // E-5 (reverse)
            ];
            
            const allDiagonals = [...bottomToTopDiagonals, ...topToBottomDiagonals];
            
            allDiagonals.forEach(({ fromRow, fromCol, toRow, toCol }, index) => {
              const fromX = 40 + COLUMNS.indexOf(fromCol) * 80;
              const fromY = 40 + (ROWS.length - fromRow) * 80;
              const toX = 40 + COLUMNS.indexOf(toCol) * 80;
              const toY = 40 + (ROWS.length - toRow) * 80;
              
              diagonalLines.push(
                <line
                  key={`diagonal-${index}`}
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="hsl(var(--grid-line))"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
              );
            });
            
            return diagonalLines;
          })()}
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