import React, { memo, useMemo } from 'react';
import GameCell from './GameCell';
import { Cell } from '@/types/game';

interface GameBoardProps {
  grid: Cell[][];
  bombAnimation: boolean;
  winAnimation: boolean;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

const GameBoard = ({
  grid,
  bombAnimation,
  winAnimation,
  onCellClick,
  onCellRightClick,
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div
        className={`grid w-[600px] h-[600px] ${bombAnimation ? 'bomb-animation' : ''} ${winAnimation ? 'win-animation' : ''}`}
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
              onCellClick={onCellClick}
              onCellRightClick={onCellRightClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(GameBoard); 