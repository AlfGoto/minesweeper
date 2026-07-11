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
  time: number;
  flags: number;
  date: string;
}

interface BestGamesProps {
  games: GameData[];
}

export async function BestGames({ games }: BestGamesProps) {
  const [t, tEmpty] = await Promise.all([
    getTranslations("statsPage.table"),
    getTranslations("statsPage.empty"),
  ]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("rank")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("time")}
          </TableHead>
          <TableHead className="p-0" style={{ textAlign: "left" }}>
            {t("flags")}
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
        {games.length === 0 && (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-12"
            >
              {tEmpty("noWinsYet")}
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
