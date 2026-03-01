import { notFound } from "next/navigation";
import { getUserById } from "@/lib/api";
import { UserStats } from "./components/user-stats";
import { UserLatestGames } from "./components/user-latest-games";
import { UserBestGames } from "./components/user-best-games";
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

  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      <UserProfileHeader
        userName={user.userName}
        userImage={user.userPicture}
      />

      <UserStats userId={userId} />

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
          <UserLatestGames userId={userId} />
        </TabsContent>
        <TabsContent
          value="best-games"
          forceMount
          className="data-[state=inactive]:hidden p-2"
        >
          <UserBestGames userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
