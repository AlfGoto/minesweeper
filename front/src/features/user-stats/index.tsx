import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUserLatestGames, getUserBestGames } from "@/lib/api";
import { Stats } from "@/features/stats/components/stats";
import { LatestGames } from "@/features/stats/components/latest-games";
import { BestGames } from "@/features/stats/components/best-games";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserProfileHeader } from "./components/user-profile-header";
import { GamesSkeleton } from "@/features/stats/components/skeletons";
import { generateProfileJsonLd } from "@/lib/structured-data";
import { shouldIndexProfile } from "@/lib/seo-config";
import { getTranslations } from "next-intl/server";
import type { User, UserStats } from "@/types/bff";

interface UserProfilePageProps {
  userId: string;
  user: User | undefined;
  stats: UserStats | undefined;
  locale?: string;
}

export async function UserProfilePage({ userId, user, stats, locale = "en" }: UserProfilePageProps) {
  if (!user) {
    notFound();
  }

  const [session, t] = await Promise.all([
    getServerSession(),
    getTranslations("statsPage"),
  ]);

  const isOwnProfile = session?.user?.name === user.userName;
  const statsForIndex = stats ? { ...stats, userId, userName: user.userName, userPicture: user.userPicture } : undefined;
  const { indexable } = shouldIndexProfile(statsForIndex);
  const jsonLd = indexable ? generateProfileJsonLd(userId, user, stats) : null;

  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <UserProfileHeader
        userName={user.userName}
        userImage={user.userPicture}
        isOwnProfile={isOwnProfile}
      />

      <Stats stats={stats} />

      <Suspense fallback={<GamesSkeleton />}>
        <UserGamesSection userId={userId} latestGamesLabel={t("latestGames")} bestGamesLabel={t("bestGames")} />
      </Suspense>
    </div>
  );
}

async function UserGamesSection({ userId, latestGamesLabel, bestGamesLabel }: { userId: string; latestGamesLabel: string; bestGamesLabel: string }) {
  const [latestGames, bestGames] = await Promise.all([
    getUserLatestGames(userId),
    getUserBestGames(userId),
  ]);

  return (
    <Tabs defaultValue="latest-games" className="w-full border rounded-lg">
      <TabsList className="w-fit mx-2 my-4 p-2">
        <TabsTrigger
          value="latest-games"
          className="flex items-center gap-2 cursor-pointer w-fit"
        >
          <span className="text-2xl">🕹️</span>
          <h2 className="text-2xl font-bold">{latestGamesLabel}</h2>
        </TabsTrigger>
        <TabsTrigger
          value="best-games"
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🏆</span>
          <h2 className="text-2xl font-bold">{bestGamesLabel}</h2>
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
