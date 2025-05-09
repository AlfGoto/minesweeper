import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import Script from 'next/script';
import { revalidatePath } from 'next/cache';

// Types for our API responses
interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage: string | null;
  time: number;
  date: string;
}

interface UserStats {
  userId: string;
  userName: string;
  userImage: string | null;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  fastestWin: number;
  averageWinTime: number;
  bombsExploded: number;
  noFlagWins: number;
  timePlayed: number;
  averageGameTime: number;
  recentGames: any[];
}

// Format time as xxmin xxs xxxms
const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return '0min 0s 0ms';

  // Convert to total milliseconds
  const totalMs = Math.floor(milliseconds);

  // Calculate minutes, seconds, and milliseconds
  const min = Math.floor(totalMs / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);
  const ms = Math.floor(totalMs % 1000);

  return `${min}min ${sec}s ${ms}ms`;
};

// Format time as xxmin xxs (no milliseconds)
const formatTimeNoMs = (milliseconds: number): string => {
  if (!milliseconds) return '0min 0s';

  // Convert to total milliseconds
  const totalMs = Math.floor(milliseconds);

  // Calculate minutes, seconds
  const min = Math.floor(totalMs / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);

  return `${min}min ${sec}s`;
};

// Helper function to add cache-busting parameter
const cacheKey = () => `_t=${Date.now()}`;

// Add revalidation logic to ensure fresh data on each visit
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/leaderboard?limit=10&${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

async function fetchUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/stats/${userId}?${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching stats for user ${userId}:`, error);
    return null;
  }
}

// Fetch both the top 10 leaderboard and the user's context in the leaderboard
async function fetchUserLeaderboardContext(userId: string): Promise<LeaderboardEntry[]> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/leaderboard/context/${userId}?${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return []; // Return empty if endpoint doesn't exist yet
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching leaderboard context for user ${userId}:`, error);
    return [];
  }
}

// Fetch user's personal best games
async function fetchUserBestGames(userId: string): Promise<any[]> {
  try {
    // Use the dedicated bestgames endpoint
    const apiUrl = `${process.env.API_URL}/bestgames/${userId}?limit=5&${cacheKey()}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return [];
    }

    const games = await response.json();
    return games;
  } catch (error) {
    console.error(`Error fetching best games for user ${userId}:`, error);
    return [];
  }
}

export default async function StatsPage() {
  // Ensure the page is revalidated on each visit
  revalidatePath('/stats');

  const session = await getServerSession();
  const userId = session?.user?.email;

  // Fetch all data in parallel
  const [leaderboard, userStats, userLeaderboardContext, userBestGames] = await Promise.all([
    fetchLeaderboard(),
    userId ? fetchUserStats(userId) : null,
    userId ? fetchUserLeaderboardContext(userId) : [],
    userId ? fetchUserBestGames(userId) : []
  ]);

  // Only show user context if user is not in top 10
  const showUserContext = userId && userLeaderboardContext.length > 0 &&
    !leaderboard.some(entry => entry.userId === userId);

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

          {/* Leaderboard Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">🏆 Fastest Times Leaderboard</h2>
            </div>

            {leaderboard.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry) => (
                      <tr key={`${entry.rank}-${entry.userId}`} className={entry.userId === session?.user?.email ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {entry.rank === 1 ? '🥇' :
                                entry.rank === 2 ? '🥈' :
                                  entry.rank === 3 ? '🥉' : entry.rank}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {entry.userImage && (
                              <div className="flex-shrink-0 h-8 w-8 relative">
                                <Image
                                  src={entry.userImage}
                                  alt={entry.userName || 'Player'}
                                  fill
                                  className="rounded-full object-cover"
                                  sizes="32px"
                                />
                              </div>
                            )}
                            <div className="font-medium text-gray-900">
                              {entry.userId === session?.user?.email ? `${entry.userName} (You)` : entry.userName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(entry.time)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No leaderboard data available yet. Win a game to get on the leaderboard!</p>
              </div>
            )}
          </div>

          {/* User Context Section - Show if user is not in top 10 */}
          {showUserContext && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Your Position</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userLeaderboardContext.map((entry) => (
                      <tr key={`${entry.rank}-${entry.userId}`} className={entry.userId === session?.user?.email ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="font-medium">{entry.rank}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {entry.userImage && (
                              <div className="flex-shrink-0 h-8 w-8 relative">
                                <Image
                                  src={entry.userImage}
                                  alt={entry.userName || 'Player'}
                                  fill
                                  className="rounded-full object-cover"
                                  sizes="32px"
                                />
                              </div>
                            )}
                            <div className="font-medium text-gray-900">
                              {entry.userId === session?.user?.email ? `${entry.userName} (You)` : entry.userName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatTime(entry.time)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* User Stats Section */}
          {userStats ? (
            <div>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">📊 Your Statistics</h2>

              {/* User header with image */}
              <div className="flex items-center space-x-3 mb-6">
                {userStats.userImage && (
                  <div className="h-12 w-12 relative">
                    <Image
                      src={userStats.userImage}
                      alt={userStats.userName || 'Player'}
                      fill
                      className="rounded-full object-cover"
                      sizes="48px"
                    />
                  </div>
                )}
                <div className="text-xl font-semibold">{userStats.userName}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg shadow">
                  <div className="text-blue-800 text-sm font-medium uppercase">Games Played</div>
                  <div className="text-3xl font-bold mt-1">{userStats.totalGames}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow">
                  <div className="text-green-800 text-sm font-medium uppercase">Win Rate</div>
                  <div className="text-3xl font-bold mt-1">{userStats.winRate}%</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {userStats.wins} wins / {userStats.losses} losses
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg shadow">
                  <div className="text-purple-800 text-sm font-medium uppercase">Best Time</div>
                  <div className="text-3xl font-bold mt-1">{formatTime(userStats.fastestWin)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Avg: {formatTime(userStats.averageWinTime)}
                  </div>
                </div>
              </div>

              {/* Additional stats */}
              <h3 className="text-xl font-semibold mb-3">Detailed Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {userStats.bombsExploded > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg shadow">
                    <div className="text-red-800 text-sm font-medium uppercase">Bombs Exploded</div>
                    <div className="text-3xl font-bold mt-1">{userStats.bombsExploded}</div>
                  </div>
                )}

                {userStats.noFlagWins > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg shadow">
                    <div className="text-yellow-800 text-sm font-medium uppercase">No-Flag Wins</div>
                    <div className="text-3xl font-bold mt-1">{userStats.noFlagWins}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Wins without placing flags
                    </div>
                  </div>
                )}

                {userStats.timePlayed > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-lg shadow">
                    <div className="text-indigo-800 text-sm font-medium uppercase">Time Played</div>
                    <div className="text-3xl font-bold mt-1">{formatTimeNoMs(userStats.timePlayed)}</div>
                    {userStats.averageGameTime > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        Avg Game: {formatTime(userStats.averageGameTime)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Personal Best Times Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">🏆 Your Personal Best Times</h3>
                {userBestGames.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userBestGames.map((game, index) => (
                          <tr key={index} className={index === 0 ? 'bg-yellow-50' : ''}>
                            <td className="px-4 py-2 whitespace-nowrap font-medium">
                              {index === 0 ? '🥇' :
                                index === 1 ? '🥈' :
                                  index === 2 ? '🥉' : `#${index + 1}`}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {formatTime(game.time)}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {new Date(game.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                {game.noFlagWin && (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    No Flags
                                  </span>
                                )}
                                {game.usedFlags > 0 && (
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    {game.usedFlags} Flags
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                    <p>Win some games to see your best times here!</p>
                  </div>
                )}
              </div>

              {/* Recent Games */}
              {userStats.recentGames.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Recent Games</h3>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userStats.recentGames.map((game, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${game.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {game.status === 'success' ? 'Win' : 'Loss'}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap font-medium">
                              {game.status === 'success' ? formatTime(game.time) : '-'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {new Date(game.date).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Your Statistics</h2>
              {session?.user ? (
                <p className="text-gray-600">Play some games to see your statistics here!</p>
              ) : (
                <p className="text-gray-600">Sign in to see your personal statistics</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 