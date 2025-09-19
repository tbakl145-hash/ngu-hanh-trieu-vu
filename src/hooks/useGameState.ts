import { useState, useCallback } from 'react';
import { 
  GameState, 
  GamePiece, 
  Position, 
  PlayerType, 
  PieceType,
  ElementType,
  INITIAL_POSITIONS,
  COLUMNS,
  ROWS,
  DESTRUCTION_CYCLE,
  GENERATION_CYCLE
} from '@/types/game';

const createInitialBoard = (): (GamePiece | null)[][] => {
  const board: (GamePiece | null)[][] = Array(7).fill(null).map(() => Array(7).fill(null));
  
  Object.entries(INITIAL_POSITIONS).forEach(([positionStr, pieceData]) => {
    const col = positionStr[0];
    const row = parseInt(positionStr[1]);
    const colIndex = COLUMNS.indexOf(col);
    const rowIndex = row - 1;
    
    const piece: GamePiece = {
      id: `${pieceData.player}-${pieceData.type}-${positionStr}`,
      type: pieceData.type,
      player: pieceData.player,
      position: { row, col },
      isAlive: true,
    };
    
    board[rowIndex][colIndex] = piece;
  });
  
  return board;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createInitialBoard(),
    currentPlayer: 'day', // Day player goes first
    selectedPiece: null,
    validMoves: [],
    capturedPieces: { day: [], night: [] },
    gameStatus: 'playing',
    moveHistory: [],
  });

  // Helper function to check if two positions are connected by a drawn diagonal line
  const isConnectedByDiagonal = useCallback((from: Position, to: Position): boolean => {
    const fromColIndex = COLUMNS.indexOf(from.col);
    const toColIndex = COLUMNS.indexOf(to.col);
    const fromRow = from.row;
    const toRow = to.row;

    // Check if it's a horizontal or vertical move (allowed on grid lines)
    if (fromRow === toRow || fromColIndex === toColIndex) {
      return true;
    }

    // Check if it's a diagonal move on one of the drawn diagonal lines
    const rowDiff = toRow - fromRow;
    const colDiff = toColIndex - fromColIndex;

    // Must be a diagonal move (equal row and column difference)
    if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
      return false;
    }

    // Check each drawn diagonal line to see if both positions lie on it
    const diagonalLines = [
      // Main diagonal (top-right to bottom-left): G1 to A7
      { start: { row: 1, col: 'G' }, end: { row: 7, col: 'A' } },
      // Anti-diagonal (top-left to bottom-right): A1 to G7
      { start: { row: 1, col: 'A' }, end: { row: 7, col: 'G' } },
      // Shorter diagonals
      { start: { row: 1, col: 'C' }, end: { row: 3, col: 'A' } },
      { start: { row: 1, col: 'E' }, end: { row: 5, col: 'A' } },
      { start: { row: 5, col: 'G' }, end: { row: 7, col: 'E' } },
      { start: { row: 3, col: 'G' }, end: { row: 7, col: 'C' } },
      { start: { row: 1, col: 'A' }, end: { row: 5, col: 'E' } },
      { start: { row: 3, col: 'A' }, end: { row: 7, col: 'E' } },
      { start: { row: 1, col: 'E' }, end: { row: 3, col: 'G' } },
      { start: { row: 5, col: 'A' }, end: { row: 7, col: 'C' } },
    ];

    for (const line of diagonalLines) {
      const startColIndex = COLUMNS.indexOf(line.start.col);
      const endColIndex = COLUMNS.indexOf(line.end.col);

      // Check if both positions lie on this diagonal line
      if (isOnDiagonalLine(from, line.start, line.end) && isOnDiagonalLine(to, line.start, line.end)) {
        return true;
      }
    }

    return false;
  }, []);

  // Helper function to check if a position lies on a diagonal line between two points
  const isOnDiagonalLine = useCallback((pos: Position, start: Position, end: Position): boolean => {
    const posColIndex = COLUMNS.indexOf(pos.col);
    const startColIndex = COLUMNS.indexOf(start.col);
    const endColIndex = COLUMNS.indexOf(end.col);

    // Check if the position is within the bounds of the line
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(startColIndex, endColIndex);
    const maxCol = Math.max(startColIndex, endColIndex);

    if (pos.row < minRow || pos.row > maxRow || posColIndex < minCol || posColIndex > maxCol) {
      return false;
    }

    // Check if the position lies on the diagonal line
    const rowDiff = pos.row - start.row;
    const colDiff = posColIndex - startColIndex;
    const lineRowDiff = end.row - start.row;
    const lineColDiff = endColIndex - startColIndex;

    // For a diagonal line, the ratio should be the same
    if (lineRowDiff === 0 && lineColDiff === 0) {
      return pos.row === start.row && posColIndex === startColIndex;
    }

    if (lineRowDiff === 0) {
      return pos.row === start.row;
    }

    if (lineColDiff === 0) {
      return posColIndex === startColIndex;
    }

    return rowDiff * lineColDiff === colDiff * lineRowDiff;
  }, []);

  const getValidMoves = useCallback((piece: GamePiece, board: (GamePiece | null)[][]): Position[] => {
    const validMoves: Position[] = [];
    const { row, col } = piece.position;
    const colIndex = COLUMNS.indexOf(col);

    // Check all possible moves (1 step in any direction)
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    directions.forEach(([deltaRow, deltaCol]) => {
      const newRow = row + deltaRow;
      const newColIndex = colIndex + deltaCol;

      // Check bounds
      if (newRow >= 1 && newRow <= 7 && newColIndex >= 0 && newColIndex < 7) {
        const newCol = COLUMNS[newColIndex];
        const newPosition = { row: newRow, col: newCol };

        // Check if this move is connected by a drawn line (horizontal, vertical, or diagonal)
        if (isConnectedByDiagonal(piece.position, newPosition)) {
          const targetSquare = board[newRow - 1][newColIndex];

          // Can move to empty square or capture enemy piece
          if (!targetSquare || targetSquare.player !== piece.player) {
            // Check if this piece can capture the target (if any)
            if (targetSquare && !canCapture(piece, targetSquare)) {
              return; // Cannot capture this piece
            }

            validMoves.push(newPosition);
          }
        }
      }
    });

    // Pieces can also stay in place (do nothing)
    validMoves.push({ row, col });

    return validMoves;
  }, [isConnectedByDiagonal]);

  const canCapture = (attacker: GamePiece, target: GamePiece): boolean => {
    // Master pieces can capture any piece of the opposite color
    if (attacker.type === 'chu') {
      return attacker.player !== target.player;
    }
    
    // Master pieces cannot be captured by regular pieces
    if (target.type === 'chu') {
      return false;
    }
    
    // Regular pieces can only capture according to destruction cycle
    // Both pieces must be element types (not chu) at this point
    const attackerElement = attacker.type as ElementType;
    const targetElement = target.type as ElementType;
    return DESTRUCTION_CYCLE[attackerElement] === targetElement;
  };

  const selectPiece = useCallback((piece: GamePiece) => {
    if (piece.player !== gameState.currentPlayer) return;
    
    const validMoves = getValidMoves(piece, gameState.board);
    
    setGameState(prev => ({
      ...prev,
      selectedPiece: piece,
      validMoves,
    }));
  }, [gameState.currentPlayer, gameState.board, getValidMoves]);

  const movePiece = useCallback((to: Position) => {
    if (!gameState.selectedPiece) return;
    
    const { selectedPiece, board } = gameState;
    const fromColIndex = COLUMNS.indexOf(selectedPiece.position.col);
    const fromRowIndex = selectedPiece.position.row - 1;
    const toColIndex = COLUMNS.indexOf(to.col);
    const toRowIndex = to.row - 1;
    
    const newBoard = board.map(row => [...row]);
    const targetPiece = newBoard[toRowIndex][toColIndex];
    
    // Check if it's a valid move
    const isValidMove = gameState.validMoves.some(move => 
      move.row === to.row && move.col === to.col
    );
    
    if (!isValidMove) return;
    
    // Capture logic
    let capturedPiece: GamePiece | undefined;
    if (targetPiece && targetPiece.player !== selectedPiece.player) {
      if (canCapture(selectedPiece, targetPiece)) {
        capturedPiece = { ...targetPiece, isAlive: false };
        
        // Check win condition
        if (targetPiece.type === 'chu') {
          setGameState(prev => ({
            ...prev,
            gameStatus: selectedPiece.player === 'day' ? 'day-wins' : 'night-wins',
          }));
          return;
        }
      } else {
        return; // Cannot capture
      }
    }
    
    // Move the piece
    const movedPiece = { ...selectedPiece, position: to };
    newBoard[fromRowIndex][fromColIndex] = null;
    newBoard[toRowIndex][toColIndex] = movedPiece;
    
    // Update captured pieces
    const newCapturedPieces = { ...gameState.capturedPieces };
    if (capturedPiece) {
      const capturedPlayer = capturedPiece.player;
      newCapturedPieces[capturedPlayer] = [...newCapturedPieces[capturedPlayer], capturedPiece];
    }
    
    // Switch turns
    const nextPlayer: PlayerType = gameState.currentPlayer === 'day' ? 'night' : 'day';
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedPiece: null,
      validMoves: [],
      capturedPieces: newCapturedPieces,
      moveHistory: [...prev.moveHistory, {
        from: selectedPiece.position,
        to,
        piece: selectedPiece,
        capturedPiece,
        timestamp: Date.now(),
      }],
    }));
  }, [gameState, canCapture]);

  const handleSquareClick = useCallback((position: Position) => {
    const colIndex = COLUMNS.indexOf(position.col);
    const rowIndex = position.row - 1;
    const clickedPiece = gameState.board[rowIndex][colIndex];
    
    if (gameState.selectedPiece) {
      // If clicking on a valid move, move the piece
      const isValidMove = gameState.validMoves.some(move => 
        move.row === position.row && move.col === position.col
      );
      
      if (isValidMove) {
        movePiece(position);
      } else if (clickedPiece && clickedPiece.player === gameState.currentPlayer) {
        // Select a different piece of the same player
        selectPiece(clickedPiece);
      } else {
        // Deselect
        setGameState(prev => ({
          ...prev,
          selectedPiece: null,
          validMoves: [],
        }));
      }
    } else if (clickedPiece && clickedPiece.player === gameState.currentPlayer) {
      // Select piece
      selectPiece(clickedPiece);
    }
  }, [gameState, selectPiece, movePiece]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentPlayer: 'day',
      selectedPiece: null,
      validMoves: [],
      capturedPieces: { day: [], night: [] },
      gameStatus: 'playing',
      moveHistory: [],
    });
  }, []);

  return {
    gameState,
    handleSquareClick,
    resetGame,
  };
};