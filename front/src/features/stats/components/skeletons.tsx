import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTranslations } from "next-intl/server";

export function HeaderSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Skeleton className="h-9 flex-1 sm:w-28 sm:flex-none rounded-md" />
        <Skeleton className="h-9 flex-1 sm:w-20 sm:flex-none rounded-md" />
      </div>
    </div>
  );
}

function StatBoxSkeleton({ label, emoji }: { label: string; emoji: string }) {
  return (
    <div
      className="gap-2 flex flex-col items-center border border-gray-200 p-4 rounded-xl"
      style={{ minWidth: 160 }}
    >
      <p className="text-sm text-gray-500 text-center">
        {emoji} {label}
      </p>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

function StatsGroupSkeleton({
  title,
  stats,
}: {
  title: string;
  stats: { label: string; emoji: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <StatBoxSkeleton key={stat.label} label={stat.label} emoji={stat.emoji} />
        ))}
      </div>
    </div>
  );
}

export async function StatsSkeleton() {
  const t = await getTranslations("statsPage.stats");

  const gameStats = [
    { label: t("totalGames"), emoji: "🎮" },
    { label: t("winsLabel"), emoji: "🏆" },
    { label: t("winrateLabel"), emoji: "📈" },
    { label: t("noFlagsWins"), emoji: "🚫🚩" },
    { label: t("restarts"), emoji: "🔄" },
  ];

  const timeStats = [
    { label: t("totalTimeLabel"), emoji: "⏱️" },
    { label: t("bestTime"), emoji: "⚡" },
    { label: t("avgGameTime"), emoji: "⏳" },
  ];

  const gameplayStats = [
    { label: t("cellsRevealed"), emoji: "👆" },
    { label: t("flagsPlaced"), emoji: "🚩" },
    { label: t("bombsHit"), emoji: "💣" },
    { label: t("avgFlagsGame"), emoji: "🚩" },
    { label: t("avgRevealedGame"), emoji: "🔢" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
      </div>
      <StatsGroupSkeleton title={t("games")} stats={gameStats} />
      <Separator />
      <StatsGroupSkeleton title={t("timeSection")} stats={timeStats} />
      <Separator />
      <StatsGroupSkeleton title={t("gameplay")} stats={gameplayStats} />
    </div>
  );
}

function TableRowSkeleton({
  cols,
  hiddenOnMobile = [],
}: {
  cols: number;
  hiddenOnMobile?: number[];
}) {
  return (
    <TableRow className="hover:bg-transparent">
      {Array.from({ length: cols }).map((_, i) => (
        <TableCell
          key={i}
          className={hiddenOnMobile.includes(i) ? "hidden sm:table-cell" : undefined}
          style={{ textAlign: "left" }}
        >
          <Skeleton className="h-10 w-full max-w-[100px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

export async function LeaderboardSkeleton() {
  const [t, tTable] = await Promise.all([
    getTranslations("statsPage"),
    getTranslations("statsPage.table"),
  ]);

  return (
    <Tabs defaultValue="leaderboard" className="w-full border rounded-lg gap-0">
      <div className="mx-2 my-4 sm:hidden">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <TabsList className="w-fit mx-2 my-4 p-2 hidden sm:inline-flex">
        <TabsTrigger
          value="leaderboard"
          className="flex items-center gap-2 cursor-pointer w-fit"
        >
          <span className="text-2xl">🏆</span>
          <h2 className="text-2xl font-bold">{t("leaderboard")}</h2>
        </TabsTrigger>
        <TabsTrigger
          value="total-time"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">⏱️</span>
          <h2 className="text-2xl font-bold">{t("totalTime")}</h2>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="leaderboard" className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {[tTable("rank"), tTable("player"), tTable("time"), tTable("flags"), tTable("date")].map((h, i) => (
                <TableHead
                  key={h}
                  className={i >= 3 ? "p-0 hidden sm:table-cell" : "p-0"}
                  style={{ textAlign: "left" }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={5} hiddenOnMobile={[3, 4]} />
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}

export async function GamesSkeleton() {
  const [t, tTable] = await Promise.all([
    getTranslations("statsPage"),
    getTranslations("statsPage.table"),
  ]);

  return (
    <Tabs defaultValue="latest-games" className="w-full border rounded-lg gap-0">
      <div className="mx-2 my-4 sm:hidden">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
      <TabsList className="w-fit mx-2 my-4 p-2 hidden sm:inline-flex">
        <TabsTrigger
          value="latest-games"
          className="flex items-center gap-2 cursor-pointer w-fit"
        >
          <span className="text-2xl">🕹️</span>
          <h2 className="text-2xl font-bold">{t("latestGames")}</h2>
        </TabsTrigger>
        <TabsTrigger
          value="best-games"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🏆</span>
          <h2 className="text-2xl font-bold">{t("bestGames")}</h2>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="latest-games" className="p-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {[tTable("status"), tTable("time"), tTable("flags"), tTable("revealed"), tTable("date")].map((h, i) => (
                <TableHead
                  key={h}
                  className={i === 2 || i === 3 ? "p-0 hidden sm:table-cell" : "p-0"}
                  style={{ textAlign: "left" }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRowSkeleton key={i} cols={5} hiddenOnMobile={[2, 3]} />
            ))}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
}
