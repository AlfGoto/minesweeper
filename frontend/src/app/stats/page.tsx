import React, { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import Script from 'next/script';
import { revalidatePath } from 'next/cache';
import { UserStatsSection } from '@/components/stats/UserStats';
import { LeaderboardSection } from '@/components/stats/LeaderBoard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export default async function StatsPage() {
  // Ensure the page is revalidated on each visit
  revalidatePath('/stats');

  const session = await getServerSession();
  const userId = session?.user?.email;

  return (
    <>
      <Script
        id="stats-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Table',
            'about': 'Minesweeper Game Leaderboard',
            'description': 'Leaderboard showing the fastest completion times in the Minesweeper game',
            'isPartOf': {
              '@type': 'WebApplication',
              'name': 'Minesweeper Game'
            }
          })
        }}
      />
      <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Minesweeper Statistics</h1>
            <div className="flex gap-2">
              {session?.user && (
                <Link
                  href="/api/auth/signout"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-colors"
                >
                  Logout
                </Link>
              )}
              <Link
                href="/"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition-colors"
              >
                Back to Game
              </Link>
            </div>
          </div>

          <Suspense fallback={<div className="mb-8"><div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4 pb-2 border-b border-gray-100"></div><div className="h-96 bg-gray-50 rounded-lg animate-pulse"></div></div>}>
            <LeaderboardSection />
          </Suspense>

          {userId && (
            <Suspense fallback={<div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6 pb-2 border-b border-gray-100"></div>}>
              <UserStatsSection userId={userId} />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
} 