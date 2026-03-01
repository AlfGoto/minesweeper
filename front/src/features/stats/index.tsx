import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Leaderboard } from "./components/leaderboard";
import { Stats } from "./components/stats";
import { LatestGames } from "./components/latest-games";
import { BestGames } from "./components/best-games";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatsHeader } from "./components/stats-header";
import { getStats, getLatestGames, getBest10Games } from "@/lib/api";

export async function StatsPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/");
  }

  const userEmail = session.user.email;

  const [stats, latestGames, bestGames] = await Promise.all([
    getStats(userEmail),
    getLatestGames(userEmail),
    getBest10Games(userEmail),
  ]);

  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      <StatsHeader
        userName={session.user.name ?? undefined}
        userImage={session.user.image ?? undefined}
      />

      <Leaderboard />
      <Stats stats={stats} title="Your stats" />

      <Tabs defaultValue="latest-games" className="w-full border rounded-lg">
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
    </div>
  );
}
