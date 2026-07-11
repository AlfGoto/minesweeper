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
import { getTranslations } from "next-intl/server";

export async function TotalTimeLeaderboard() {
  const [allStats, t, tEmpty, tPage] = await Promise.all([
    getAllStats(),
    getTranslations("statsPage.table"),
    getTranslations("statsPage.empty"),
    getTranslations("statsPage"),
  ]);

  const sortedByTotalTime = [...allStats]
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 10);

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
              {tPage("totalTime")}
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              {t("games")}
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              {t("wins")}
            </TableHead>
            <TableHead className="p-0" style={{ textAlign: "left" }}>
              {t("winrate")}
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
                {tEmpty("beFirstToPlay")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
