import React, { memo, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/utils/time';

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
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const timerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = Date.now() - (timer * 1000);

    const updateTimer = () => {
      if (timerRef.current) {
        let elapsed;
        if (finalTime) {
          elapsed = finalTime;
        } else {
          elapsed = (Date.now() - startTimeRef.current) / 1000;
        }
        timerRef.current.textContent = formatTime(elapsed);
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

  // Handle navigation to stats with loading state
  const navigateToStats = () => {
    setNavigating(true);
    router.push('/stats');
  };

  // Prefetch the stats page
  useEffect(() => {
    router.prefetch('/stats');
  }, [router]);

  return (
    <div className="ml-8 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center min-w-[200px]">
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
        <button
          onClick={navigateToStats}
          disabled={navigating}
          className={`w-full px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg text-center
            ${navigating
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'} 
            transition-all duration-200`}
        >
          {navigating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Stats...
            </span>
          ) : (
            "📊 View Stats"
          )}
        </button>
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