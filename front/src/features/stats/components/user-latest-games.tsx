import { getUserLatestGames } from "@/lib/api";
import { formatDateTime, formatTime } from "@/lib/dates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function UserLatestGames(props: { userId: string }) {
  const latestGames = await getUserLatestGames(props.userId);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Status
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Time
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Flags
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Revealed
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {latestGames.map((game, index) => (
          <TableRow key={`${game.date}-${index}`} className="hover:bg-gray-100">
            <TableCell style={{ textAlign: "left" }}>
              <StatusBadge status={game.status} />
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
              ⬜ {game.revealed}
            </TableCell>
            <TableCell
              className="text-muted-foreground"
              style={{ textAlign: "left" }}
            >
              {formatDateTime(game.date)}
            </TableCell>
          </TableRow>
        ))}
        {latestGames.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-12"
            >
              No games yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function StatusBadge({ status }: { status: "won" | "lost" | "restarted" }) {
  const config = {
    won: { emoji: "🏆", label: "Won", className: "text-green-600" },
    lost: { emoji: "💣", label: "Lost", className: "text-red-600" },
    restarted: { emoji: "🔄", label: "Restarted", className: "text-gray-400" },
  };

  const { emoji, label, className } = config[status];

  return (
    <span className={`font-medium ${className}`}>
      {emoji} {label}
    </span>
  );
}
