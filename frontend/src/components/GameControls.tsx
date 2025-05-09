import React, { memo, useEffect, useRef } from 'react';
import Link from 'next/link';

interface GameControlsProps {
  timer: number;
  finalTime: number | null;
  gameOver: boolean;
  gameWon: boolean;
  onRestart: () => void;
}

const GameControls = ({
  timer,
  finalTime,
  gameOver,
  gameWon,
  onRestart,
}: GameControlsProps) => {
  // Use refs for timer display and interval
  const timerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Simple function to format time as mm:ss (without milliseconds for better performance)
  const formatTimeSimple = (milliseconds: number): string => {
    // First determine if it's in seconds or milliseconds
    const totalMs = milliseconds < 1000 ? Math.floor(milliseconds * 1000) : Math.floor(milliseconds);

    // Calculate minutes and seconds (no milliseconds)
    const min = Math.floor(totalMs / 60000);
    const sec = Math.floor((totalMs % 60000) / 1000);

    return `${min}min ${sec}s`;
  };

  // Detailed format with milliseconds (only used when game ends)
  const formatTimeDetailed = (milliseconds: number): string => {
    // First determine if it's in seconds or milliseconds
    const totalMs = milliseconds < 1000 ? Math.floor(milliseconds * 1000) : Math.floor(milliseconds);

    // Calculate minutes, seconds, and milliseconds
    const min = Math.floor(totalMs / 60000);
    const sec = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor(totalMs % 1000);

    return `${min}min ${sec}s ${ms}ms`;
  };

  // Setup timer with setInterval
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set initial time reference
    startTimeRef.current = Date.now() - (timer * 1000);

    // Update function to directly manipulate DOM
    const updateTimer = () => {
      if (timerRef.current) {
        // Calculate elapsed time, handling conversion consistently
        let elapsed;
        if (finalTime) {
          // finalTime is likely in milliseconds or seconds, use our formatter to handle it
          elapsed = finalTime;
          // Use detailed format with milliseconds for final time
          timerRef.current.textContent = formatTimeDetailed(elapsed);
        } else {
          // For active games, calculate ms since start
          elapsed = (Date.now() - startTimeRef.current);
          // Convert to seconds to be consistent with other time values
          elapsed = elapsed / 1000;
          // Use simple format without milliseconds during gameplay for better performance
          timerRef.current.textContent = formatTimeSimple(elapsed);
        }
      }
    };

    // Initial update
    updateTimer();

    // Don't run interval if game is over
    if (!gameOver && !gameWon) {
      // Set up interval to update time every 100ms
      intervalRef.current = setInterval(updateTimer, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer, finalTime, gameOver, gameWon]);

  // Handle restart when user clicks the button
  const handleRestart = () => {
    // Reset start time reference
    startTimeRef.current = Date.now();

    // Update display immediately
    if (timerRef.current) {
      timerRef.current.textContent = '0min 0s';
    }

    // Call the original restart function
    onRestart();
  };

  return (
    <div className="ml-8 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center min-w-[200px]">
      <h3 className="text-xl font-bold mb-4">Game Controls</h3>
      <button
        onClick={handleRestart}
        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform mb-6"
      >
        Restart Game
      </button>
      <div className="w-full space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Time</div>
          <div ref={timerRef} className="font-mono text-lg font-bold whitespace-nowrap overflow-hidden">0min 0s</div>
        </div>
        <Link
          href="/stats"
          className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform text-center"
        >
          📊 View Stats
        </Link>
        {gameWon && (
          <div className="bg-green-100 p-3 rounded-lg text-green-700 font-bold">
            🎉 Victory!
          </div>
        )}
        {gameOver && !gameWon && (
          <div className="bg-red-100 p-3 rounded-lg text-red-700 font-bold">
            💥 Game Over
          </div>
        )}
      </div>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(GameControls); 