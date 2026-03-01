import { notFound } from "next/navigation";
import { getUserById, getUserStats, getUserLatestGames, getUserBestGames } from "@/lib/api";
import { Stats } from "@/features/stats/components/stats";
import { LatestGames } from "@/features/stats/components/latest-games";
import { BestGames } from "@/features/stats/components/best-games";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserProfileHeader } from "./components/user-profile-header";

interface UserProfilePageProps {
  userId: string;
}

export async function UserProfilePage({ userId }: UserProfilePageProps) {
  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  const [stats, latestGames, bestGames] = await Promise.all([
    getUserStats(userId),
    getUserLatestGames(userId),
    getUserBestGames(userId),
  ]);

  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      <UserProfileHeader
        userName={user.userName}
        userImage={user.userPicture}
      />

      <Stats stats={stats} title="Stats" />

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
