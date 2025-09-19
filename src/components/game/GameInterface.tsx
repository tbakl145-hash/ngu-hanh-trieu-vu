import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { useGameState } from '@/hooks/useGameState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Info, Mountain, Droplets, TreePine, Flame, Circle, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

// Component hiển thị quân cờ và chú thích
const PieceGuide = ({ type, name, description, playerType = 'day' }) => {
  const getIcon = () => {
    switch (type) {
      case 'kim':
        return <Mountain className="w-3 h-3 text-elements-kim" />;
      case 'thuy':
        return <Droplets className="w-3 h-3 text-elements-thuy" />;
      case 'moc':
        return <TreePine className="w-3 h-3 text-elements-moc" />;
      case 'hoa':
        return <Flame className="w-3 h-3 text-elements-hoa" />;
      case 'chu':
        return (
          <div className="w-3 h-3 rounded-full"
               style={{ background: 'var(--gradient-master)' }} />
        );
      case 'tho':
        return <Circle className="w-3 h-3 text-elements-tho" />;
      default:
        return <Circle className="w-3 h-3" />;
    }
  };

  const playerBg = playerType === 'day' ? 'bg-player-day' : 'bg-player-night';
  const borderColor = playerType === 'day' ? 'border-game-border' : 'border-player-night';

  return (
    <div className="flex items-center gap-2">
      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-sm ${playerBg} ${borderColor}`}>
        {getIcon()}
      </div>
      <div>
        <div className="font-medium text-xs">{name}</div>
        <div className="text-[10px] text-muted-foreground">{description}</div>
      </div>
    </div>
  );
};

export const GameInterface = () => {
  const { gameState, handleSquareClick, resetGame } = useGameState();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-game-background">
      {/* Enhanced Header - Fixed */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="container mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-primary/10 transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-4">
                {/* Enhanced Logo with Mid-Autumn Theme */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-xl animate-moon-glow">
                    <div className="w-8 h-8 rounded-full bg-gradient-master animate-pulse-soft"></div>
                  </div>
                  {/* Lantern decorations */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-elements-hoa to-elements-kim animate-lantern-sway"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-br from-elements-thuy to-elements-moc animate-star-twinkle"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl lg:text-3xl mobile-header-title font-bold bg-gradient-to-r from-primary via-elements-kim to-primary bg-clip-text text-transparent tracking-wide">
                      Cờ Ngũ Hành
                    </h1>
                    {/* Mid-Autumn Festival decorations */}
                    <div className="hidden sm:flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 animate-moon-glow opacity-80"></div>
                      <span className="text-xs text-primary/70 font-medium">🏮</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      Five Elements Chess - Mid-Autumn Festival
                    </p>
                    <div className="hidden sm:flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-primary/60 animate-star-twinkle"></div>
                      <span className="text-xs text-primary/70 font-medium">Traditional Vietnamese Game</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Game Status Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-primary">Game Active</span>
              </div>

              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="hidden sm:flex hover:bg-primary/10 border-primary/30 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Ván mới
              </Button>
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="sm:hidden hover:bg-primary/10 border-primary/30 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Layout */}
      <div className="flex h-[calc(100vh-80px)] max-w-7xl mx-auto ultra-wide-container">
        {/* Enhanced Left Panel - Game Status & Quick Info */}
        <div className={`
          ${leftPanelOpen ? 'w-96 xl:w-[420px]' : 'w-12'}
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-card/95 via-card/90 to-card/80 backdrop-blur-xl border-r border-primary/20 flex-shrink-0 shadow-xl
          ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-40 w-96 shadow-2xl animate-slide-in-left' : 'hidden lg:flex'}
          lg:relative lg:flex rounded-r-2xl overflow-hidden
        `}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-elements-kim/5"></div>
          <div className="flex flex-col h-full relative z-10">
            {/* Enhanced Panel Toggle */}
            <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-gradient-to-r from-primary/10 to-elements-kim/10 rounded-tr-2xl">
              <div className={`flex items-center gap-2 ${leftPanelOpen ? 'block' : 'hidden'}`}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-elements-kim flex items-center justify-center animate-pulse-soft">
                  <Info className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-primary to-elements-kim bg-clip-text text-transparent">
                  Trạng thái game
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className="hidden lg:flex hover:bg-primary/20 h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
              >
                {leftPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden hover:bg-destructive/20 h-8 w-8 p-0 rounded-full transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Enhanced Panel Content */}
            <div className={`flex-1 p-5 space-y-5 ${leftPanelOpen ? 'block' : 'hidden'} overflow-hidden`}>
              <div className="h-full flex flex-col space-y-5">
                {/* Game Status with Enhanced Design */}
                <div className="flex-shrink-0">
                  <div className="p-5 bg-gradient-to-br from-primary/10 to-elements-kim/10 rounded-xl border border-primary/20 shadow-lg">
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-primary flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-elements-kim flex items-center justify-center">
                          <span className="text-white text-xs">⚡</span>
                        </div>
                        Trạng thái trận đấu
                      </h3>
                    </div>
                    <GameStatus gameState={gameState} />
                  </div>
                </div>

                {/* Enhanced Quick Rules */}
                <Card className="flex-1 min-h-0 shadow-lg border-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm">
                  <CardHeader className="pb-4 px-5 pt-5">
                    <CardTitle className="text-base font-bold text-primary flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-elements-kim flex items-center justify-center">
                        <Circle className="w-3 h-3 text-white" />
                      </div>
                      Luật chơi cơ bản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 text-sm space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:bg-primary/15 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-elements-kim mt-1 flex-shrink-0 animate-pulse-soft"></div>
                          <div>
                            <div className="font-bold text-primary mb-1">Mục tiêu chính</div>
                            <div className="text-muted-foreground">Bắt được quân Chủ đối phương để giành chiến thắng</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-r from-elements-moc/10 to-elements-moc/5 border border-elements-moc/20 hover:bg-elements-moc/15 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-elements-moc to-elements-thuy mt-1 flex-shrink-0 animate-pulse-soft"></div>
                          <div>
                            <div className="font-bold text-elements-moc mb-1">Cách di chuyển</div>
                            <div className="text-muted-foreground">Mỗi lượt chỉ được di chuyển 1 bước theo đường đã vẽ sẵn</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-r from-elements-hoa/10 to-elements-hoa/5 border border-elements-hoa/20 hover:bg-elements-hoa/15 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-elements-hoa to-elements-tho mt-1 flex-shrink-0 animate-pulse-soft"></div>
                          <div>
                            <div className="font-bold text-elements-hoa mb-1">Quy tắc khắc chế</div>
                            <div className="text-muted-foreground">Kim → Mộc → Thổ → Thủy → Hỏa → Kim</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-r from-elements-tho/10 to-elements-tho/5 border border-elements-tho/20 hover:bg-elements-tho/15 transition-all duration-200">
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-master mt-1 flex-shrink-0 animate-pulse-soft"></div>
                          <div>
                            <div className="font-bold text-elements-tho mb-1">Quân Chủ đặc biệt</div>
                            <div className="text-muted-foreground">Có thể khắc chế tất cả các quân đối phương</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Center - Game Board */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 overflow-hidden mobile-board-container">
          <div className="w-full max-w-[600px] tablet-board-size large-screen-board aspect-square relative mobile-board-size">
            {/* Board Container with Enhanced Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-elements-kim/5 rounded-2xl animate-pulse-soft"></div>
            <div className="relative z-10 p-2 rounded-2xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-primary/10 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <GameBoard
                gameState={gameState}
                onSquareClick={handleSquareClick}
              />
            </div>
            {/* Mid-Autumn Festival Floating Elements */}
            <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 animate-moon-glow opacity-70 flex items-center justify-center text-xs">🌕</div>
            <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-pink-400 animate-lantern-sway opacity-70 flex items-center justify-center text-xs">🏮</div>
            <div className="absolute top-4 -right-2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 animate-star-twinkle opacity-60" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-4 -left-2 w-3 h-3 rounded-full bg-gradient-to-br from-orange-300 to-red-400 animate-star-twinkle opacity-60" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>

        {/* Enhanced Right Panel - Ngũ Hành Guide */}
        <div className={`
          ${rightPanelOpen ? 'w-96 xl:w-[420px] animate-slide-in-right' : 'w-12'}
          transition-all duration-300 ease-in-out
          bg-gradient-to-b from-card/95 via-card/90 to-card/80 backdrop-blur-xl border-l border-primary/20 flex-shrink-0 shadow-xl
          hidden lg:flex rounded-l-2xl overflow-hidden
        `}>
          <div className="absolute inset-0 bg-gradient-to-bl from-elements-thuy/5 via-transparent to-elements-moc/5"></div>
          <div className="flex flex-col h-full relative z-10">
            {/* Enhanced Panel Toggle */}
            <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-gradient-to-l from-elements-thuy/10 to-elements-moc/10 rounded-tl-2xl">
              <div className={`flex items-center gap-2 ${rightPanelOpen ? 'block' : 'hidden'}`}>
                <div className="w-6 h-6 rounded-full bg-gradient-master flex items-center justify-center animate-pulse-soft">
                  <Circle className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-elements-thuy to-elements-moc bg-clip-text text-transparent">
                  Hướng dẫn Ngũ Hành
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                className="hover:bg-primary/20 h-8 w-8 p-0 rounded-full transition-all duration-200 hover:scale-110"
              >
                {rightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>

            {/* Enhanced Panel Content */}
            <div className={`flex-1 p-5 ${rightPanelOpen ? 'block' : 'hidden'} overflow-hidden`}>
              <div className="h-full flex flex-col space-y-5">
                {/* Enhanced Ngũ Hành Guide */}
                <Card className="flex-shrink-0 shadow-lg border-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm">
                  <CardHeader className="pb-4 px-5 pt-5">
                    <CardTitle className="text-base font-bold text-primary flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-master flex items-center justify-center animate-pulse-soft">
                        <Info className="w-4 h-4 text-white" />
                      </div>
                      Quân cờ và Ngũ Hành
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 text-sm space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {/* Enhanced Piece Guides with better layout */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/15 to-elements-kim/15 border border-primary/30 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-master flex items-center justify-center shadow-md animate-pulse-soft">
                            <div className="w-5 h-5 rounded-full bg-gradient-master"></div>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-primary text-base">Quân Chủ</div>
                            <div className="text-muted-foreground text-sm">Khắc chế tất cả quân đối phương</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-elements-kim/15 to-elements-kim/10 border border-elements-kim/30 hover:shadow-lg transition-all duration-200">
                          <div className="flex flex-col items-center text-center gap-2">
                            <Mountain className="w-6 h-6 text-elements-kim" />
                            <div>
                              <div className="font-bold text-elements-kim text-sm">Kim</div>
                              <div className="text-xs text-muted-foreground">Khắc Mộc</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-r from-elements-thuy/15 to-elements-thuy/10 border border-elements-thuy/30 hover:shadow-lg transition-all duration-200">
                          <div className="flex flex-col items-center text-center gap-2">
                            <Droplets className="w-6 h-6 text-elements-thuy" />
                            <div>
                              <div className="font-bold text-elements-thuy text-sm">Thủy</div>
                              <div className="text-xs text-muted-foreground">Khắc Hỏa</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-r from-elements-moc/15 to-elements-moc/10 border border-elements-moc/30 hover:shadow-lg transition-all duration-200">
                          <div className="flex flex-col items-center text-center gap-2">
                            <TreePine className="w-6 h-6 text-elements-moc" />
                            <div>
                              <div className="font-bold text-elements-moc text-sm">Mộc</div>
                              <div className="text-xs text-muted-foreground">Khắc Thổ</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-gradient-to-r from-elements-hoa/15 to-elements-hoa/10 border border-elements-hoa/30 hover:shadow-lg transition-all duration-200">
                          <div className="flex flex-col items-center text-center gap-2">
                            <Flame className="w-6 h-6 text-elements-hoa" />
                            <div>
                              <div className="font-bold text-elements-hoa text-sm">Hỏa</div>
                              <div className="text-xs text-muted-foreground">Khắc Kim</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-gradient-to-r from-elements-tho/15 to-elements-tho/10 border border-elements-tho/30 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-elements-tho to-elements-tho/70 flex items-center justify-center shadow-md animate-pulse-soft">
                            <Circle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-elements-tho text-base">Thổ (Trung tâm)</div>
                            <div className="text-muted-foreground text-sm">Khắc chế Thủy, sinh Kim</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Tương khắc & Tương sinh */}
                <div className="flex-1 min-h-0 grid grid-cols-1 gap-4 overflow-y-auto custom-scrollbar">
                  {/* Enhanced Tương khắc */}
                  <Card className="shadow-lg border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10 backdrop-blur-sm">
                    <CardHeader className="pb-3 px-4 pt-4">
                      <CardTitle className="text-sm font-bold text-destructive flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-destructive to-destructive/70 flex items-center justify-center animate-pulse-soft">
                          <span className="text-white text-xs">⚔</span>
                        </div>
                        Tương khắc
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-kim/10 hover:bg-elements-kim/20 transition-all duration-200">
                          <Mountain className="w-4 h-4 text-elements-kim animate-pulse-soft" />
                          <span className="text-xs font-bold text-destructive">→</span>
                          <TreePine className="w-4 h-4 text-elements-moc" />
                          <span className="text-xs text-muted-foreground font-medium">Kim khắc Mộc</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-moc/10 hover:bg-elements-moc/20 transition-all duration-200">
                          <TreePine className="w-4 h-4 text-elements-moc animate-pulse-soft" />
                          <span className="text-xs font-bold text-destructive">→</span>
                          <Circle className="w-4 h-4 text-elements-tho" />
                          <span className="text-xs text-muted-foreground font-medium">Mộc khắc Thổ</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-tho/10 hover:bg-elements-tho/20 transition-all duration-200">
                          <Circle className="w-4 h-4 text-elements-tho animate-pulse-soft" />
                          <span className="text-xs font-bold text-destructive">→</span>
                          <Droplets className="w-4 h-4 text-elements-thuy" />
                          <span className="text-xs text-muted-foreground font-medium">Thổ khắc Thủy</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-thuy/10 hover:bg-elements-thuy/20 transition-all duration-200">
                          <Droplets className="w-4 h-4 text-elements-thuy animate-pulse-soft" />
                          <span className="text-xs font-bold text-destructive">→</span>
                          <Flame className="w-4 h-4 text-elements-hoa" />
                          <span className="text-xs text-muted-foreground font-medium">Thủy khắc Hỏa</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-hoa/10 hover:bg-elements-hoa/20 transition-all duration-200">
                          <Flame className="w-4 h-4 text-elements-hoa animate-pulse-soft" />
                          <span className="text-xs font-bold text-destructive">→</span>
                          <Mountain className="w-4 h-4 text-elements-kim" />
                          <span className="text-xs text-muted-foreground font-medium">Hỏa khắc Kim</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Tương sinh */}
                  <Card className="shadow-lg border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10 backdrop-blur-sm">
                    <CardHeader className="pb-3 px-4 pt-4">
                      <CardTitle className="text-sm font-bold text-green-600 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center animate-pulse-soft">
                          <span className="text-white text-xs">♻</span>
                        </div>
                        Tương sinh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 text-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-hoa/10 hover:bg-elements-hoa/20 transition-all duration-200">
                          <Flame className="w-4 h-4 text-elements-hoa animate-pulse-soft" />
                          <span className="text-xs font-bold text-green-600">⇒</span>
                          <Circle className="w-4 h-4 text-elements-tho" />
                          <span className="text-xs text-muted-foreground font-medium">Hỏa sinh Thổ</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-tho/10 hover:bg-elements-tho/20 transition-all duration-200">
                          <Circle className="w-4 h-4 text-elements-tho animate-pulse-soft" />
                          <span className="text-xs font-bold text-green-600">⇒</span>
                          <Mountain className="w-4 h-4 text-elements-kim" />
                          <span className="text-xs text-muted-foreground font-medium">Thổ sinh Kim</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-kim/10 hover:bg-elements-kim/20 transition-all duration-200">
                          <Mountain className="w-4 h-4 text-elements-kim animate-pulse-soft" />
                          <span className="text-xs font-bold text-green-600">⇒</span>
                          <Droplets className="w-4 h-4 text-elements-thuy" />
                          <span className="text-xs text-muted-foreground font-medium">Kim sinh Thủy</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-thuy/10 hover:bg-elements-thuy/20 transition-all duration-200">
                          <Droplets className="w-4 h-4 text-elements-thuy animate-pulse-soft" />
                          <span className="text-xs font-bold text-green-600">⇒</span>
                          <TreePine className="w-4 h-4 text-elements-moc" />
                          <span className="text-xs text-muted-foreground font-medium">Thủy sinh Mộc</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-elements-moc/10 hover:bg-elements-moc/20 transition-all duration-200">
                          <TreePine className="w-4 h-4 text-elements-moc animate-pulse-soft" />
                          <span className="text-xs font-bold text-green-600">⇒</span>
                          <Flame className="w-4 h-4 text-elements-hoa" />
                          <span className="text-xs text-muted-foreground font-medium">Mộc sinh Hỏa</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Bottom Panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/98 via-background/95 to-background/90 backdrop-blur-xl border-t border-primary/20 z-30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"></div>
        <div className="p-4 relative z-10">
          <div className="flex justify-center gap-4 text-xs">
            <div className="text-center bg-gradient-to-r from-primary/10 to-elements-kim/10 rounded-xl px-4 py-3 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
              <div className="font-bold text-primary mb-2 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-master animate-pulse-soft"></div>
                Khắc chế:
              </div>
              <div className="text-muted-foreground font-medium">Kim→Mộc→Thổ→Thủy→Hỏa→Kim</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-md z-30 animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};