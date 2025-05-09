import { useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface WinModalProps {
  timer: number;
  onRestart: () => void;
}

export default function WinModal({
  timer,
  onRestart,
}: WinModalProps) {
  const { data: session } = useSession();
  const timerRef = useRef<HTMLDivElement>(null);

  // Format time as mm:ss:ms
  const formattedTime = useMemo(() => {
    if (!timer) return '00:00:000';

    // Convert to total milliseconds
    const totalMs = Math.floor(timer);

    // Calculate minutes, seconds, and milliseconds
    const min = Math.floor(totalMs / 60000);
    const sec = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;

    // Format with leading zeros
    const minStr = String(min).padStart(2, '0');
    const secStr = String(sec).padStart(2, '0');
    const msStr = String(ms).padStart(3, '0');

    return `${minStr}:${secStr}:${msStr}`;
  }, [timer]);

  // Set the timer display once when component mounts
  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.textContent = formattedTime;
    }
  }, [formattedTime]);

  // Game result is already saved by the websocket server
  // No need to save it again here

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center max-w-lg w-full mx-4 animate-slideIn">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Victory!</h2>
        <div className="text-xl mb-4 font-mono bg-gray-100 px-4 py-2 rounded">
          Time: <span ref={timerRef}>00:00:000</span>
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
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
} 