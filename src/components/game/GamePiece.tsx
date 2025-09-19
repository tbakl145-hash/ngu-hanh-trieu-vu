import { GamePiece as GamePieceType } from '@/types/game';
import { Mountain, Droplets, TreePine, Flame, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GamePieceProps {
  piece: GamePieceType;
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const PieceIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'kim':
      return <Mountain className={cn("w-6 h-6", className)} />;
    case 'thuy':
      return <Droplets className={cn("w-6 h-6", className)} />;
    case 'moc':
      return <TreePine className={cn("w-6 h-6", className)} />;
    case 'hoa':
      return <Flame className={cn("w-6 h-6", className)} />;
    case 'chu':
      return (
        <div className={cn("w-6 h-6 rounded-full", className)} 
             style={{ background: 'var(--gradient-master)' }} />
      );
    default:
      return <Circle className={cn("w-6 h-6", className)} />;
  }
};

export const GamePiece = ({ piece, isSelected, isValidMove, onClick }: GamePieceProps) => {
  const getElementColor = (type: string) => {
    switch (type) {
      case 'kim': return 'text-elements-kim';
      case 'thuy': return 'text-elements-thuy';
      case 'moc': return 'text-elements-moc';
      case 'hoa': return 'text-elements-hoa';
      case 'tho': return 'text-elements-tho';
      case 'chu': return 'text-primary';
      default: return 'text-foreground';
    }
  };

  const playerBg = piece.player === 'day' ? 'bg-player-day' : 'bg-player-night';
  const borderColor = piece.player === 'day' ? 'border-game-border' : 'border-player-night';

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-12 h-12 rounded-full border-2 flex items-center justify-center",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "shadow-lg hover:shadow-xl",
        playerBg,
        borderColor,
        isSelected && "ring-4 ring-state-selected ring-offset-2 scale-110",
        isValidMove && "ring-2 ring-state-valid ring-offset-1",
        "cursor-pointer"
      )}
    >
      <PieceIcon 
        type={piece.type} 
        className={cn(
          getElementColor(piece.type),
          "drop-shadow-sm",
          piece.type === 'chu' && "animate-pulse"
        )} 
      />
      
      {/* Piece glow effect */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full bg-state-selected opacity-30 animate-pulse" />
      )}
    </button>
  );
};