import { getBestGames } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/dates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { BestGame } from "@/types/bff";
import { LeaderboardRow } from "./leaderboard-row";

export async function Leaderboard() {
  const bestGames = await getBestGames();

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl border bg-card p-6 border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>
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
              Time
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Flags
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bestGames.map((game, index) => (
            <LeaderboardRow key={game.userId} game={game} rank={index + 1} />
          ))}
          {bestGames.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-12"
              >
                No games yet. Be the first to win!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
