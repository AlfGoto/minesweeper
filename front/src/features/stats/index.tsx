import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Leaderboard } from "./components/leaderboard";
import { TotalTimeLeaderboard } from "./components/total-time-leaderboard";
import { Stats } from "./components/stats";
import { LatestGames } from "./components/latest-games";
import { BestGames } from "./components/best-games";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatsHeader } from "./components/stats-header";
import { getStats, getLatestGames, getBest10Games } from "@/lib/api";
import {
  LeaderboardSkeleton,
  StatsSkeleton,
  GamesSkeleton,
} from "./components/skeletons";

export async function StatsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/");
  }

  const userEmail = session.user.email;

  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      <StatsHeader
        userName={session.user.name ?? undefined}
        userImage={session.user.image ?? undefined}
      />

      <Suspense fallback={<LeaderboardSkeleton />}>
        <Tabs
          defaultValue="latest-games"
          className="w-full border rounded-lg gap-0"
        >
          <TabsList className="w-fit mx-2 my-4 p-2">
            <TabsTrigger
              value="latest-games"
              className="flex items-center gap-2 cursor-pointer w-fit"
            >
              <span className="text-2xl">🏆</span>
              <h2 className="text-2xl font-bold">Leaderboard</h2>
            </TabsTrigger>
            <TabsTrigger
              value="total-time"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-2xl">⏱️</span>
              <h2 className="text-2xl font-bold">Total Time</h2>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="latest-games"
            forceMount
            className="data-[state=inactive]:hidden p-2"
          >
            <Leaderboard />
          </TabsContent>
          <TabsContent
            value="total-time"
            forceMount
            className="data-[state=inactive]:hidden p-2"
          >
            <TotalTimeLeaderboard />
          </TabsContent>
        </Tabs>
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <UserStats userEmail={userEmail} />
      </Suspense>

      <Suspense fallback={<GamesSkeleton />}>
        <UserGames userEmail={userEmail} />
      </Suspense>

      <div className="flex justify-center gap-1 mt-6 text-gray-500 text-sm">
        You can contact me at
        <a href="mailto:contact@minesweeper.com" className="underline">
          alf@minesweeper.com
        </a>
      </div>
    </div>
  );
}

async function UserStats({ userEmail }: { userEmail: string }) {
  const stats = await getStats(userEmail);
  return <Stats stats={stats} title="Your stats" />;
}

async function UserGames({ userEmail }: { userEmail: string }) {
  const [latestGames, bestGames] = await Promise.all([
    getLatestGames(userEmail),
    getBest10Games(userEmail),
  ]);

  return (
    <Tabs
      defaultValue="latest-games"
      className="w-full border rounded-lg gap-0"
    >
      <TabsList className="w-fit mx-2 my-4 p-2">
        <TabsTrigger
          value="latest-games"
          className="flex items-center gap-2 cursor-pointer w-fit"
        >
          <span className="text-2xl">🕹️</span>
          <h2 className="text-2xl font-bold">Latest Games</h2>
        </TabsTrigger>
        <TabsTrigger
          value="best-games"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🏆</span>
          <h2 className="text-2xl font-bold">Best Games</h2>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="latest-games"
        forceMount
        className="data-[state=inactive]:hidden p-2"
      >
        <LatestGames games={latestGames} />
      </TabsContent>
      <TabsContent
        value="best-games"
        forceMount
        className="data-[state=inactive]:hidden p-2"
      >
        <BestGames games={bestGames} />
      </TabsContent>
    </Tabs>
  );
}
