'use client';

import { useSession } from 'next-auth/react';
import Game from '@/components/Game';
import { SignInButton } from '@/components/SignInButton';

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex w-full h-full items-center justify-center">
      {session ? (
        <Game />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-8">Welcome to Minesweeper</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md text-center">
            Test your puzzle-solving skills with the classic Minesweeper game. Sign in to play and compete on the leaderboard!
          </p>
          <SignInButton />
        </div>
      )}
    </main>
  );
}