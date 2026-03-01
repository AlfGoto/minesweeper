import { getAllStats } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalTimeLeaderboardRow } from "./total-time-leaderboard-row";

export async function TotalTimeLeaderboard() {
  const allStats = await getAllStats();

  const sortedByTotalTime = [...allStats]
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Rank
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Player
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Total Time
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Games
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Wins
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Winrate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedByTotalTime.map((stats, index) => (
            <TotalTimeLeaderboardRow
              key={stats.userId}
              stats={stats}
              rank={index + 1}
            />
          ))}
          {sortedByTotalTime.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-12"
              >
                No games yet. Be the first to play!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
