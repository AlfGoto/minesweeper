import { getUserBestGames } from "@/lib/api";
import { formatDateTime, formatTime } from "@/lib/dates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function UserBestGames(props: { userId: string }) {
  const bestGames = await getUserBestGames(props.userId);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Rank
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
          <TableRow key={`${game.date}-${index}`} className="hover:bg-gray-100">
            <TableCell style={{ textAlign: "left" }}>
              <RankBadge rank={index + 1} />
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
              🚩 {game.flags}
            </TableCell>
            <TableCell
              className="text-muted-foreground"
              style={{ textAlign: "left" }}
            >
              {formatDateTime(game.date)}
            </TableCell>
          </TableRow>
        ))}
        {bestGames.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-12"
            >
              No wins yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const medals: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  const medal = medals[rank];

  return (
    <span className="font-medium">
      {medal ? `${medal} #${rank}` : `#${rank}`}
    </span>
  );
}
