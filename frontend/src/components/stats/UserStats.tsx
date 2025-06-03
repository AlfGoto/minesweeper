import {
  fetchUserStats,
  fetchUserLeaderboardContext,
  fetchUserBestGames,
} from "@/app/stats/api";
import { formatTime } from "@/utils/time";
import Image from "next/image";
import { PersonnalBestTimes } from "./PersonnalBestTimes";
import { RecentGames } from "./RecentGames";

export async function UserStatsSection({ userId }: { userId: string }) {
  const [userStats, userLeaderboardContext, userBestGames] = await Promise.all([
    fetchUserStats(userId),
    fetchUserLeaderboardContext(userId),
    fetchUserBestGames(userId),
  ]);

  if (!userStats) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Your Statistics</h2>
        <p className="text-gray-600">
          Play some games to see your statistics here!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">
        📊 Your Statistics
      </h2>

      {/* User header with image */}
      <div className="flex items-center space-x-3 mb-6">
        {userStats.userImage && (
          <div className="h-12 w-12 relative">
            <Image
              src={userStats.userImage}
              alt={userStats.userName || "Player"}
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
          <div className="text-blue-800 text-sm font-medium uppercase">
            🎮 Games Played
          </div>
          <div className="text-3xl font-bold mt-1">{userStats.totalGames}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-green-800 text-sm font-medium uppercase">
            🏆 Win Rate
          </div>
          <div className="text-3xl font-bold mt-1">{userStats.winRate}%</div>
          <div className="text-sm text-gray-600 mt-1">
            {userStats.wins} wins / {userStats.losses} losses
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <div className="text-purple-800 text-sm font-medium uppercase">
            ⏱️ Best Time
          </div>
          <div className="text-3xl font-bold mt-1">
            {formatTime(userStats.fastestWin)}
          </div>
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
            <div className="text-red-800 text-sm font-medium uppercase">
              💣 Bombs Exploded
            </div>
            <div className="text-3xl font-bold mt-1">
              {userStats.bombsExploded}
            </div>
          </div>
        )}

        {userStats.noFlagWins > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-yellow-800 text-sm font-medium uppercase">
              🚫 No-Flag Wins
            </div>
            <div className="text-3xl font-bold mt-1">
              {userStats.noFlagWins}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Wins without placing flags
            </div>
          </div>
        )}

        {userStats.timePlayed > 0 && (
          <div className="bg-indigo-50 p-4 rounded-lg shadow">
            <div className="text-indigo-800 text-sm font-medium uppercase">
              ⏰ Time Played
            </div>
            <div className="text-3xl font-bold mt-1">
              {formatTime(userStats.timePlayed)}
            </div>
            {userStats.averageGameTime > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                Avg Game: {formatTime(userStats.averageGameTime)}
              </div>
            )}
          </div>
        )}

        {userStats.totalCellsRevealed > 0 && (
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-green-800 text-sm font-medium uppercase">
              🔍 Cells Revealed
            </div>
            <div className="text-3xl font-bold mt-1">
              {userStats.totalCellsRevealed.toLocaleString()}
            </div>
          </div>
        )}

        {userStats.totalFlagsUsed > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-yellow-800 text-sm font-medium uppercase">
              🚩 Flags Placed
            </div>
            <div className="text-3xl font-bold mt-1">
              {userStats.totalFlagsUsed.toLocaleString()}
            </div>
          </div>
        )}

        {userStats.restartedGames > 0 && (
          <div className="bg-orange-50 p-4 rounded-lg shadow">
            <div className="text-orange-800 text-sm font-medium uppercase">
              🔄 Game Restarts
            </div>
            <div className="text-3xl font-bold mt-1">
              {userStats.restartedGames}
            </div>
          </div>
        )}
      </div>

      <PersonnalBestTimes userBestGames={userBestGames} />

      <RecentGames userStats={userStats} />
    </div>
  );
}
