import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface LoseModalProps {
  timer: number;
  onRestart: () => void;
}

export default function LoseModal({
  timer,
  onRestart,
}: LoseModalProps) {
  const { data: session } = useSession();
  const timerRef = useRef<HTMLDivElement>(null);

  // Format time as mm:ss.ms
  const formatTime = (time: number): string => {
    if (!time || time < 0.001) return '0min 0s 0ms';

    // First determine if time is in seconds or milliseconds
    // If time is small (less than 1000), it's likely in seconds, otherwise it's in ms
    const totalMs = time < 1000 ? Math.floor(time * 1000) : Math.floor(time);

    // Calculate minutes, seconds, and milliseconds
    const min = Math.floor(totalMs / 60000);
    const sec = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor(totalMs % 1000);

    return `${min}min ${sec}s ${ms}ms`;
  };

  // Set the timer display once when component mounts
  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.textContent = formatTime(timer);
    }
  }, [timer, formatTime]);

  // Game result is already saved by the websocket server
  // No need to save it again here

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center max-w-lg w-full mx-4 animate-slideIn">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
        <div className="text-xl mb-4 font-mono bg-gray-100 px-4 py-2 rounded">
          Time: <span ref={timerRef}>0min 0s 0ms</span>
        </div>
        <div className="mb-6">
          <button
            onClick={onRestart}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 text-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-transform"
          >
            Play Again
          </button>
        </div>
        <div className="w-full">
          <Link
            href="/stats"
            className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md text-center"
          >
            View Stats
          </Link>
        </div>
      </div>
    </div>
  );
} 