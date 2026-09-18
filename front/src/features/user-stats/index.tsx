import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { getUserLatestGames, getUserBestGames } from "@/lib/api";
import { Stats } from "@/features/stats/components/stats";
import { LatestGames } from "@/features/stats/components/latest-games";
import { BestGames } from "@/features/stats/components/best-games";
import { ResponsiveTabs } from "@/features/stats/components/responsive-tabs";
import { UserProfileHeader } from "./components/user-profile-header";
import { GamesSkeleton } from "@/features/stats/components/skeletons";
import { generateProfileJsonLd } from "@/lib/structured-data";
import { shouldIndexProfile } from "@/lib/seo-config";
import { formatTime } from "@/lib/dates";
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

  const [session, t, tProfile] = await Promise.all([
    getServerSession(),
    getTranslations("statsPage"),
    getTranslations("profilePage"),
  ]);

  const isOwnProfile = session?.user?.name === user.userName;
  const statsForIndex = stats ? { ...stats, userId, userName: user.userName, userPicture: user.userPicture } : undefined;
  const { indexable } = shouldIndexProfile(statsForIndex);
  const jsonLd = indexable ? generateProfileJsonLd(userId, user, stats, locale) : null;

  const placement = stats?.placement;
  const totalPlayers = stats?.totalPlayers ?? 0;
  const hasPlacement = placement !== undefined && placement > 0;
  const betterThanPercent = hasPlacement && totalPlayers > 0
    ? Math.round(((totalPlayers - placement) / totalPlayers) * 100)
    : 0;

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

      <p className="text-gray-600">
        {hasPlacement && stats?.bestTime
          ? tProfile("heroDescriptionRanked", {
              name: user.userName,
              rank: placement,
              games: stats.totalGames,
              bestTime: formatTime(stats.bestTime),
              betterThan: betterThanPercent,
            })
          : stats?.totalGames
            ? tProfile("heroDescriptionUnranked", {
                name: user.userName,
                games: stats.totalGames,
                wins: stats.totalWin,
              })
            : tProfile("heroDescriptionNew", { name: user.userName })}
      </p>

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
    <ResponsiveTabs
      defaultValue="latest-games"
      className="w-full border rounded-lg"
      items={[
        {
          value: "latest-games",
          label: `🕹️ ${latestGamesLabel}`,
          trigger: (
            <>
              <span className="text-2xl">🕹️</span>
              <h2 className="text-2xl font-bold">{latestGamesLabel}</h2>
            </>
          ),
          content: <LatestGames games={latestGames} />,
        },
        {
          value: "best-games",
          label: `🏆 ${bestGamesLabel}`,
          trigger: (
            <>
              <span className="text-2xl">🏆</span>
              <h2 className="text-2xl font-bold">{bestGamesLabel}</h2>
            </>
          ),
          content: <BestGames games={bestGames} />,
        },
      ]}
    />
  );
}
