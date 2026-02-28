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
            <TableRow key={game.userName} className="hover:bg-gray-100">
              <TableCell style={{ textAlign: "left" }}>
                {index === 0 ? (
                  <span className="text-xl">🥇</span>
                ) : index === 1 ? (
                  <span className="text-xl">🥈</span>
                ) : index === 2 ? (
                  <span className="text-xl">🥉</span>
                ) : (
                  <span className="text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                )}
              </TableCell>
              <TableCell style={{ textAlign: "left" }}>
                <div className="flex items-center gap-3">
                  <Image
                    src={game.userPicture}
                    alt={game.userName}
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-muted"
                  />
                  <span className="font-medium">{game.userName}</span>
                </div>
              </TableCell>
              <TableCell
                className="font-mono font-semibold"
                style={{ textAlign: "left" }}
              >
                {formatTime(game.time)}
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                style={{ textAlign: "left" }}
              >
                {game.flags}
              </TableCell>
              <TableCell
                className="text-muted-foreground"
                style={{ textAlign: "left" }}
              >
                {formatDate(game.date)}
              </TableCell>
            </TableRow>
          ))}
          {bestGames.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={4}
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
