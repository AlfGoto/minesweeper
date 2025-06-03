import { UserStats } from "@/app/stats/types";
import { formatTime } from "@/utils/time";
import { format } from "date-fns";

export async function RecentGames({ userStats }: { userStats: UserStats }) {
  if (userStats.recentGames.length > 0)
    return (
      <div>
        <h3 className="text-xl font-semibold mb-3">📜 Recent Games</h3>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userStats.recentGames.map((game, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        game.status === "success"
                          ? "bg-green-100 text-green-800"
                          : game.status === "restarted"
                          ? "bg-orange-100 text-orange-800"
                          : game.status === "abandoned"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {game.status === "success"
                        ? "Win"
                        : game.status === "restarted"
                        ? "Restarted"
                        : game.status === "abandoned"
                        ? "Abandoned"
                        : "Loss"}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-medium">
                    {game.time > 0 ? formatTime(game.time) : "-"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(game.date), "h:mm / d MMM, yyyy")}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <div className="flex flex-wrap gap-2">
                      {game.cellsRevealed > 0 && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {game.cellsRevealed} Cells
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
      </div>
    );
}
