import { formatTime } from "@/utils/time";
import { format } from "date-fns";

export async function PersonnalBestTimes({ userBestGames }: { userBestGames: any[] }) {
  return <div className="mb-8">
    <h3 className="text-xl font-semibold mb-3">
      🏆 Your Personal Best Times
    </h3>
    {userBestGames.length > 0 ? (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
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
            {userBestGames.map((game, index) => (
              <tr key={index} className={index === 0 ? "bg-yellow-50" : ""}>
                <td className="px-4 py-2 whitespace-nowrap font-medium">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {formatTime(game.time)}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(game.date), "h:mm / d MMM, yyyy")}
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
}