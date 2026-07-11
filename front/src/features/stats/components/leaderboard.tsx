import { getBestGames } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardRow } from "./leaderboard-row";
import { getTranslations } from "next-intl/server";

export async function Leaderboard() {
  const [bestGames, t] = await Promise.all([
    getBestGames(),
    getTranslations("statsPage.table"),
  ]);
  const tEmpty = await getTranslations("statsPage.empty");

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              {t("rank")}
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              {t("player")}
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
          {bestGames.map((game, index) => (
            <LeaderboardRow key={game.userId} game={game} rank={index + 1} />
          ))}
          {bestGames.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-12"
              >
                {tEmpty("noGamesYet")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
