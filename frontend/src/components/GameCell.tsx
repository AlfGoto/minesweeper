import React, { memo, useEffect, useRef, useState } from 'react';
import { Cell } from '@/types/game';

interface GameCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  isBombAnimation: boolean;
  isWinAnimation: boolean;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (e: React.MouseEvent, row: number, col: number) => void;
  disabled?: boolean;
}

const getCellColor = (cell: Cell, rowIndex: number, colIndex: number) => {
  if (!cell.revealed) {
    // Checkerboard pattern for unrevealed cells
    return (rowIndex + colIndex) % 2 === 0 ? 'cell-limegreen' : 'cell-lightgreen';
  }

  if (cell.value === -1) return 'bg-red-500';
  // Checkerboard pattern for revealed cells using new classes
  return (rowIndex + colIndex) % 2 === 0 ? 'gray' : 'silver';
};

const getNumberColor = (value: number) => {
  const colors = [
    'text-transparent', // 0
    'text-blue-600',    // 1
    'text-green-600',   // 2
    'text-red-600',     // 3
    'text-purple-600',  // 4
    'text-yellow-600',  // 5
    'text-pink-600',    // 6
    'text-orange-600',  // 7
    'text-gray-600',    // 8
  ];
  return colors[value] || 'text-black';
};

// Memoized cell content function
const getCellContent = (cell: Cell): string => {
  if (!cell.revealed) {
    return '';
  }
  if (cell.value === -1) return '💣';
  if (cell.value === 0) return '';
  return cell.value.toString();
};

const GameCell = ({
  cell,
  rowIndex,
  colIndex,
  isBombAnimation,
  isWinAnimation,
  onCellClick,
  onCellRightClick,
  disabled = false,
}: GameCellProps) => {
  // Track mouse button states
  const [leftMouseDown, setLeftMouseDown] = useState(false);
  const [rightMouseDown, setRightMouseDown] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Cell CSS classes
  const cellClasses = `
    relative w-[30px] h-[30px] 
    ${getCellColor(cell, rowIndex, colIndex)} 
    flex items-center justify-center 
    text-xs font-bold 
    ${getNumberColor(cell.value)} 
    overflow-hidden cell-base ${disabled ? 'cursor-default' : 'cursor-pointer'}
    ${cell.flagged && !cell.revealed ? 'cell-flagged' : ''}
    ${leftMouseDown && rightMouseDown ? 'cell-chord-active' : ''}
  `;

  // Random delay for animations
  const randomDelay = React.useMemo(() => Math.random(), []);

  // Effect to handle chord action when both buttons are pressed
  useEffect(() => {
    if (!disabled && leftMouseDown && rightMouseDown && cell.revealed && cell.value > 0) {
      onCellClick(rowIndex, colIndex);
    }
  }, [leftMouseDown, rightMouseDown, cell, rowIndex, colIndex, onCellClick, disabled]);

  // Left click handler
  const handleLeftClick = (e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    setLeftMouseDown(true);

    // Only process click if right button is not down
    if (!rightMouseDown) {
      onCellClick(rowIndex, colIndex);
    }
  };

  // Right click handler - specifically for flag toggling
  const handleRightClick = (e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();

    setRightMouseDown(true);

    // Only process if left button is not down
    if (!leftMouseDown && !cell.revealed) {
      // Call the parent handler to toggle flag
      onCellRightClick(e, rowIndex, colIndex);
    }

    return false;
  };

  // Mouse down handler - route to specific handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();

    if (e.button === 0) {
      handleLeftClick(e);
    } else if (e.button === 2) {
      handleRightClick(e);
    }
  };

  // Mouse up handler
  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setLeftMouseDown(false);
    }
    if (e.button === 2) {
      setRightMouseDown(false);
    }
  };

  // Prevent context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        setLeftMouseDown(false);
      }
      if (e.button === 2) {
        setRightMouseDown(false);
      }
    };

    // Prevent context menu globally
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
      return false;
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('contextmenu', preventContextMenu);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('contextmenu', preventContextMenu);
    };
  }, []);

  return (
    <div
      className={cellClasses}
      style={{
        '--row': rowIndex,
        '--col': colIndex,
        '--random-delay': randomDelay
      } as React.CSSProperties}
      onContextMenu={handleContextMenu}
    >
      <button
        ref={buttonRef}
        className={`absolute inset-0 w-full h-full ${disabled ? 'cursor-default' : 'cursor-pointer'} z-10 ${disabled ? 'pointer-events-none' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        data-row={rowIndex}
        data-col={colIndex}
        disabled={disabled}
      />

      {/* Cell content */}
      <div
        className={`w-full text-[20px] h-full flex items-center justify-center cell-content ${cell.revealed ? 'cell-revealed' : ''}`}
      >
        {getCellContent(cell)}
      </div>

      {/* Flag element - separate from cell content for animation */}
      {cell.flagged && !cell.revealed && (
        <div className="absolute inset-0 flex items-center justify-center text-[20px] z-5 animate-fall">
          🚩
        </div>
      )}

      {/* Bomb indicator (invisible) for animation targeting */}
      {cell.value === -1 && (
        <div className="sr-only" data-is-bomb="true"></div>
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(GameCell); 