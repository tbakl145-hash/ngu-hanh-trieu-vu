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

  const getValidMoves = useCallback((piece: GamePiece, board: (GamePiece | null)[][]): Position[] => {
    const validMoves: Position[] = [];
    const { row, col } = piece.position;
    const colIndex = COLUMNS.indexOf(col);
    
    // Define specific diagonal connections from the board
    const diagonalConnections = [
      // Main long diagonals
      { from: { row: 1, col: 'A' }, to: { row: 7, col: 'G' } },
      { from: { row: 7, col: 'A' }, to: { row: 1, col: 'G' } },
      
      // Shorter diagonals from left edge
      { from: { row: 3, col: 'A' }, to: { row: 7, col: 'E' } },
      { from: { row: 5, col: 'A' }, to: { row: 7, col: 'C' } },
      
      // Shorter diagonals from right edge
      { from: { row: 1, col: 'G' }, to: { row: 5, col: 'C' } },
      { from: { row: 1, col: 'G' }, to: { row: 3, col: 'E' } },
      
      // Additional diagonals from bottom edge
      { from: { row: 1, col: 'C' }, to: { row: 5, col: 'G' } },
      { from: { row: 1, col: 'E' }, to: { row: 3, col: 'G' } },
      
      // Additional diagonals from top edge
      { from: { row: 7, col: 'C' }, to: { row: 3, col: 'A' } },
      { from: { row: 7, col: 'E' }, to: { row: 5, col: 'A' } },
    ];
    
    // Check if two positions are connected by a diagonal line
    const areConnectedDiagonally = (pos1: Position, pos2: Position): boolean => {
      return diagonalConnections.some(connection => 
        (connection.from.row === pos1.row && connection.from.col === pos1.col &&
         connection.to.row === pos2.row && connection.to.col === pos2.col) ||
        (connection.to.row === pos1.row && connection.to.col === pos1.col &&
         connection.from.row === pos2.row && connection.from.col === pos2.col)
      );
    };
    
    // All pieces can move horizontally and vertically (along grid lines)
    const orthogonalDirections = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];
    
    // Check orthogonal moves (always available)
    orthogonalDirections.forEach(([deltaRow, deltaCol]) => {
      const newRow = row + deltaRow;
      const newColIndex = colIndex + deltaCol;
      
      // Check bounds
      if (newRow >= 1 && newRow <= 7 && newColIndex >= 0 && newColIndex < 7) {
        const newCol = COLUMNS[newColIndex];
        const targetSquare = board[newRow - 1][newColIndex];
        
        // Can move to empty square or capture enemy piece
        if (!targetSquare || targetSquare.player !== piece.player) {
          // Check if this piece can capture the target (if any)
          if (targetSquare && !canCapture(piece, targetSquare)) {
            return; // Cannot capture this piece
          }
          
          validMoves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    // Check diagonal moves along specific diagonal lines only
    ROWS.forEach(targetRow => {
      COLUMNS.forEach(targetCol => {
        const targetPosition = { row: targetRow, col: targetCol };
        
        // Skip current position and orthogonal moves (already checked)
        if ((targetRow === row && targetCol === col) ||
            (targetRow === row || targetCol === col)) {
          return;
        }
        
        // Check if this is a valid diagonal connection
        if (areConnectedDiagonally(piece.position, targetPosition)) {
          const targetColIndex = COLUMNS.indexOf(targetCol);
          const targetSquare = board[targetRow - 1][targetColIndex];
          
          // Can move to empty square or capture enemy piece
          if (!targetSquare || targetSquare.player !== piece.player) {
            // Check if this piece can capture the target (if any)
            if (targetSquare && !canCapture(piece, targetSquare)) {
              return; // Cannot capture this piece
            }
            
            validMoves.push(targetPosition);
          }
        }
      });
    });
    
    // Pieces can also stay in place (do nothing)
    validMoves.push({ row, col });
    
    return validMoves;
  }, []);

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