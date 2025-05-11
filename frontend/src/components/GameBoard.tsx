import React, { memo, useMemo } from 'react';
import GameCell from './GameCell';
import { Cell } from '@/types/game';

interface GameBoardProps {
  grid: Cell[][];
  bombAnimation: boolean;
  winAnimation: boolean;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void;
  gameOver?: boolean;
  gameWon?: boolean;
}

const GameBoard = ({
  grid,
  bombAnimation,
  winAnimation,
  onCellClick,
  onCellRightClick,
  gameOver = false,
  gameWon = false,
}: GameBoardProps) => {
  // For grid dimensions
  const width = grid[0]?.length || 20;

  // Optimize win animation by only animating a subset of cells
  // This significantly reduces the performance impact
  const shouldAnimateCell = useMemo(() => {
    if (!winAnimation) return () => false;

    // Create a checkerboard pattern of cells to animate
    // This reduces the number of animated cells by 75%
    return (row: number, col: number) => {
      return (row + col) % 4 === 0;
    };
  }, [winAnimation]);

  // Create wrapped handlers that prevent clicks when game is over
  const handleCellClick = (row: number, col: number) => {
    if (gameOver || gameWon) return;
    onCellClick(row, col);
  };

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    if (gameOver || gameWon) return;
    onCellRightClick(e, row, col);
  };

  // Determine game state class
  const gameStateClass = (gameOver || gameWon) ? 'pointer-events-none' : '';
  const animationClasses = [
    bombAnimation ? 'bomb-animation' : '',
    winAnimation ? 'win-animation' : '',
    gameStateClass
  ].filter(Boolean).join(' ');

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div
        className={`grid w-[600px] h-[600px] ${animationClasses}`}
        style={{ gridTemplateColumns: `repeat(${width}, 30px)` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              isBombAnimation={bombAnimation}
              isWinAnimation={winAnimation && shouldAnimateCell(rowIndex, colIndex)}
              onCellClick={handleCellClick}
              onCellRightClick={handleCellRightClick}
              disabled={gameOver || gameWon}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(GameBoard); 