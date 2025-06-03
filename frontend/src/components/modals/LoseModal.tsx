import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { formatTime } from '@/utils/time';

interface LoseModalProps {
  timer: number;
  onRestart: () => void;
}

export default function LoseModal({
  timer,
  onRestart,
}: LoseModalProps) {
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timerRef.current) {
      timerRef.current.textContent = formatTime(timer);
    }
  }, [timer]);

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