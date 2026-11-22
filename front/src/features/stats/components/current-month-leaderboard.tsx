import { getServerSession } from "next-auth";
import { getMonthlyLeaderboard } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardRow } from "./leaderboard-row";
import { MonthCountdown } from "./month-countdown";
import { formatMonth } from "@/lib/months";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

const ROWS = 10;

export async function CurrentMonthLeaderboard() {
  const month = new Date().toISOString().slice(0, 7);
  const [entries, session, locale, t, tTable] = await Promise.all([
    getMonthlyLeaderboard(month),
    getServerSession(),
    getLocale(),
    getTranslations("statsPage.currentMonth"),
    getTranslations("statsPage.table"),
  ]);
  const rows = entries.slice(0, ROWS);

  // Same way the player profile finds the signed-in player
  const userName = session?.user?.name;
  const isInList = !!userName && rows.some((game) => game.userName === userName);
  const showCta = rows.length < ROWS && !isInList;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 pb-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {formatMonth(month, locale)}
        </span>
        <MonthCountdown />
      </div>
      <div className="flex flex-col gap-4 w-full rounded-xl bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-0" style={{ textAlign: "left" }}>
                {tTable("rank")}
              </TableHead>
              <TableHead className="p-0" style={{ textAlign: "left" }}>
                {tTable("player")}
              </TableHead>
              <TableHead className="p-0" style={{ textAlign: "left" }}>
                {tTable("time")}
              </TableHead>
              <TableHead
                className="p-0 hidden sm:table-cell"
                style={{ textAlign: "left" }}
              >
                {tTable("flags")}
              </TableHead>
              <TableHead
                className="p-0 hidden sm:table-cell"
                style={{ textAlign: "left" }}
              >
                {tTable("date")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((game, index) => (
              <LeaderboardRow
                key={`${game.userId}-${index}`}
                game={game}
                rank={index + 1}
              />
            ))}
            {showCta && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  {t("cta")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-center mt-4">
        <Link
          href={`/stats/leaderboard/monthly/${month}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("viewAll")} →
        </Link>
      </div>
    </>
  );
}
