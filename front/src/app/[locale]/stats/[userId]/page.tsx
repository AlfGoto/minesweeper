import { Metadata } from "next";
import { UserProfilePage } from "@/features/user-stats";
import { getUserById, getUserStats } from "@/lib/api";
import { formatTime } from "@/lib/dates";
import { shouldIndexProfile } from "@/lib/seo-config";
import { getTranslations } from "next-intl/server";
import type { User, UserStats } from "@/types/bff";

interface PageProps {
  params: Promise<{
    locale: string;
    userId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId, locale } = await params;
  const t = await getTranslations({ locale, namespace: "profilePage" });

  try {
    const [user, stats] = await Promise.all([
      getUserById(userId),
      getUserStats(userId),
    ]);

    if (!user) {
      return {
        title: t("title"),
        description: t("description"),
        robots: { index: false, follow: true },
      };
    }

    const userName = user.userName || "Player";
    const gamesPlayed = stats?.totalGames ?? 0;
    const gamesWon = stats?.totalWin ?? 0;
    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const bestTime = stats?.bestTime;

    const statsForIndex = stats ? { ...stats, userId, userName: user.userName, userPicture: user.userPicture } : undefined;
    const { indexable } = shouldIndexProfile(statsForIndex);

    const title = t("playerTitle", { name: userName });
    const description = bestTime
      ? t("playerDescription", { name: userName, wins: gamesWon, winRate, bestTime: formatTime(bestTime) })
      : t("playerDescriptionNoBest", { name: userName, games: gamesPlayed, wins: gamesWon, winRate });

    return {
      title,
      description,
      robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
      alternates: {
        canonical: `https://minesweeper.fr/stats/${userId}`,
      },
      openGraph: {
        title: t("ogTitle", { name: userName }),
        description,
        type: "profile",
        url: `https://minesweeper.fr/stats/${userId}`,
        images: [
          {
            url: "https://minesweeper.fr/opengraph-image",
            width: 1200,
            height: 630,
            alt: "Minesweeper - Free Online Puzzle Game",
          },
        ],
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch {
    return {
      title: t("title"),
      description: t("description"),
      robots: { index: false, follow: true },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { userId, locale } = await params;

  const [user, stats] = await Promise.all([
    getUserById(userId),
    getUserStats(userId),
  ]);

  return <UserProfilePage userId={userId} user={user} stats={stats} locale={locale} />;
}
