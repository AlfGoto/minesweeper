'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useGameLogic from '@/hooks/useGameLogic';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import LoseModal from './modals/LoseModal';
import WinModal from './modals/WinModal';

/**
 * Main Game component
 * This component is now much simpler, primarily coordinating the UI components
 * while the actual game logic is handled by the useGameLogic hook
 */
export default function Game() {
  // Get user session
  const { data: session } = useSession();

  // Get user info
  const userId = session?.user?.email || session?.user?.id || 'anonymous';
  const userName = session?.user?.name || userId;
  const userImage = session?.user?.image || null;

  // Use the game logic hook
  const {
    clientGrid,
    gameOver,
    gameWon,
    timer,
    finalTime,
    showLoseModal,
    showWinModal,
    bombAnimation,
    winAnimation,
    handleRestart,
    handleCellClick,
    handleRightClick,
    formatTimer
  } = useGameLogic({
    userId,
    userName,
    userImage
  });

  // Prevent context menu globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);


  return (
    <div
      className="flex flex-row items-start justify-center w-full min-h-screen bg-gray-100 p-4"
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {/* Game Board Component */}
      <div
        className="flex flex-col items-center"
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        {clientGrid.length > 0 ? (
          <GameBoard
            grid={clientGrid}
            bombAnimation={bombAnimation}
            winAnimation={winAnimation}
            onCellClick={handleCellClick}
            onCellRightClick={handleRightClick}
            gameOver={gameOver}
            gameWon={gameWon}
          />
        ) : (
          // Loading state
          <div className="p-4 bg-white rounded-lg shadow-lg w-[600px] h-[600px] flex items-center justify-center">
            <div className="text-2xl font-bold text-gray-500">Loading game...</div>
          </div>
        )}
      </div>

      {/* Game Controls Component */}
      <GameControls
        timer={timer}
        finalTime={finalTime}
        gameOver={gameOver}
        gameWon={gameWon}
        onRestart={handleRestart}
      />

      {/* Game Modals */}
      {showLoseModal && (
        <LoseModal
          timer={finalTime ?? 0}
          onRestart={handleRestart}
        />
      )}
      {showWinModal && (
        <WinModal
          timer={finalTime ?? 0}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
} 