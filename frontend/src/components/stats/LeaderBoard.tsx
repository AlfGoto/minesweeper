import { fetchLeaderboard } from "@/app/stats/api";
import { LeaderboardEntry } from "@/app/stats/types";
import { formatTime } from "@/utils/time";
import { format } from "date-fns";
import Image from "next/image";

export async function LeaderboardSection() {
  const leaderboard = await fetchLeaderboard();

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">
          🏆 Fastest Times Leaderboard
        </h2>
      </div>

      {leaderboard.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr key={entry.userId}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.userImage && (
                        <div className="h-8 w-8 relative mr-3">
                          <Image
                            src={entry.userImage}
                            alt={entry.userName || "Player"}
                            fill
                            className="rounded-full object-cover"
                            sizes="32px"
                          />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {entry.userName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {formatTime(entry.time)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(entry.date), "d MMM, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          <p>No games have been played yet!</p>
        </div>
      )}
    </div>
  );
}
