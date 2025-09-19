import { GameState } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sun, Moon, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameStatusProps {
  gameState: GameState;
}

export const GameStatus = ({ gameState }: GameStatusProps) => {
  const { currentPlayer, gameStatus, capturedPieces, moveHistory } = gameState;

  const getCurrentPlayerInfo = () => {
    if (gameStatus === 'day-wins') return { label: 'Ban Ngày Thắng!', icon: Trophy, color: 'text-primary' };
    if (gameStatus === 'night-wins') return { label: 'Ban Đêm Thắng!', icon: Trophy, color: 'text-primary' };
    if (gameStatus === 'draw') return { label: 'Hòa!', icon: Trophy, color: 'text-muted-foreground' };
    
    if (currentPlayer === 'day') {
      return { label: 'Lượt Ban Ngày', icon: Sun, color: 'text-elements-kim' };
    } else {
      return { label: 'Lượt Ban Đêm', icon: Moon, color: 'text-player-night' };
    }
  };

  const playerInfo = getCurrentPlayerInfo();
  const PlayerIcon = playerInfo.icon;

  return (
    <div className="space-y-4">
      {/* Current Turn */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Trạng thái trận đấu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("flex items-center gap-2 text-lg font-semibold", playerInfo.color)}>
            <PlayerIcon className="w-6 h-6" />
            {playerInfo.label}
          </div>
          
          {gameStatus === 'playing' && (
            <div className="mt-2 text-sm text-muted-foreground">
              Số nước đi: {moveHistory.length}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Captured Pieces */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quân bị bắt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Day player captured pieces */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-elements-kim" />
              <span className="text-sm font-medium">Ban Ngày mất:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.day.length > 0 ? (
                capturedPieces.day.map((piece, index) => (
                  <Badge key={`day-${index}`} variant="secondary" className="text-xs">
                    {getElementName(piece.type)}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Chưa mất quân</span>
              )}
            </div>
          </div>

          {/* Night player captured pieces */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-player-night" />
              <span className="text-sm font-medium">Ban Đêm mất:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {capturedPieces.night.length > 0 ? (
                capturedPieces.night.map((piece, index) => (
                  <Badge key={`night-${index}`} variant="secondary" className="text-xs">
                    {getElementName(piece.type)}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">Chưa mất quân</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tỷ số</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sun className="w-4 h-4 text-elements-kim" />
                <span className="text-sm font-medium">Ban Ngày</span>
              </div>
              <div className="text-2xl font-bold text-elements-kim">
                {capturedPieces.night.length}
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Moon className="w-4 h-4 text-player-night" />
                <span className="text-sm font-medium">Ban Đêm</span>
              </div>
              <div className="text-2xl font-bold text-player-night">
                {capturedPieces.day.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getElementName = (type: string): string => {
  switch (type) {
    case 'kim': return 'Kim';
    case 'thuy': return 'Thủy'; 
    case 'moc': return 'Mộc';
    case 'hoa': return 'Hỏa';
    case 'tho': return 'Thổ';
    case 'chu': return 'Chủ';
    default: return type;
  }
};