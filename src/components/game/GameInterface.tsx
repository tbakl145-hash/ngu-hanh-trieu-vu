import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Info } from 'lucide-react';

export const GameInterface = () => {
  const { gameState, handleSquareClick, resetGame } = useGameState();

  return (
    <div className="min-h-screen bg-game-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              Cờ Ngũ Hành
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Trò chơi trí tuệ Âm Dương Ngũ Hành - Five Elements Chess
            </p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <GameBoard 
                gameState={gameState} 
                onSquareClick={handleSquareClick} 
              />
            </Card>
          </div>

          {/* Game Status & Controls */}
          <div className="space-y-4">
            <GameStatus gameState={gameState} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Điều khiển
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={resetGame} 
                  variant="outline" 
                  className="w-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Ván mới
                </Button>
              </CardContent>
            </Card>

            {/* Game Rules Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Luật chơi cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <strong>Mục tiêu:</strong> Bắt được quân Chủ đối phương
                </div>
                <div>
                  <strong>Di chuyển:</strong> 1 bước theo mọi hướng
                </div>
                <div>
                  <strong>Khắc chế:</strong> Kim → Mộc → Thổ → Thủy → Hỏa → Kim
                </div>
                <div>
                  <strong>Quân Chủ:</strong> Khắc chế tất cả quân đối phương
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};