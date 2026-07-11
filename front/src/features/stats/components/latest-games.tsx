import { formatDateTime, formatTime } from "@/lib/dates";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTranslations } from "next-intl/server";

interface GameData {
  status: "won" | "lost" | "restarted";
  time: number;
  flags: number;
  revealed: number;
  date: string;
}

interface LatestGamesProps {
  games: GameData[];
}

export async function LatestGames({ games }: LatestGamesProps) {
  const [t, tEmpty, tStatus] = await Promise.all([
    getTranslations("statsPage.table"),
    getTranslations("statsPage.empty"),
    getTranslations("statsPage.status"),
  ]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("status")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("time")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("flags")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("revealed")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("date")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {games.map((game, index) => (
          <TableRow key={`${game.date}-${index}`} className="hover:bg-gray-100">
            <TableCell style={{ textAlign: "left" }}>
              <StatusBadge status={game.status} label={tStatus(game.status)} />
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
        {games.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-12"
            >
              {tEmpty("startPlaying")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: "won" | "lost" | "restarted";
  label: string;
}) {
  const config = {
    won: { emoji: "🏆", className: "text-green-600" },
    lost: { emoji: "💣", className: "text-red-600" },
    restarted: { emoji: "🔄", className: "text-gray-400" },
  };

  const { emoji, className } = config[status];

  return (
    <span className={`font-medium ${className}`}>
      {emoji} {label}
    </span>
  );
}
