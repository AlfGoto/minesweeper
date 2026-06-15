import { Metadata } from "next";
import { UserProfilePage } from "@/features/user-stats";
import { getUserById, getUserStats } from "@/lib/api";
import { formatTime } from "@/lib/dates";
import { shouldIndexProfile } from "@/lib/seo-config";
import type { User, UserStats } from "@/types/bff";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

function buildProfileMetadata(
  userId: string,
  user: User | undefined,
  stats: UserStats | undefined,
  isIndexable: boolean
): Metadata {
  if (!user) {
    return {
      title: "User Profile",
      description: "View player statistics, game history, and best times.",
      robots: { index: false, follow: true },
    };
  }

  const userName = user.userName || "Player";
  const gamesPlayed = stats?.totalGames ?? 0;
  const gamesWon = stats?.totalWin ?? 0;
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
  const bestTime = stats?.bestTime;

  const title = `${userName}'s Minesweeper Stats`;
  const description = bestTime
    ? `${userName}'s Minesweeper profile: ${gamesWon} wins, ${winRate}% win rate, best time ${formatTime(bestTime)}.`
    : `${userName}'s Minesweeper profile: ${gamesPlayed} games, ${gamesWon} wins, ${winRate}% win rate.`;

  return {
    title,
    description,
    robots: isIndexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `https://minesweeper.fr/stats/${userId}`,
    },
    openGraph: {
      title: `${userName} | Minesweeper Player Stats`,
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
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const [user, stats] = await Promise.all([
      getUserById(userId),
      getUserStats(userId),
    ]);

    const statsForIndex = stats ? { ...stats, userId, userName: user?.userName ?? "", userPicture: user?.userPicture ?? "" } : undefined;
    const { indexable } = shouldIndexProfile(statsForIndex);

    return buildProfileMetadata(userId, user, stats, indexable);
  } catch {
    return {
      title: "User Profile",
      description: "View player statistics, game history, and best times.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;

  const [user, stats] = await Promise.all([
    getUserById(userId),
    getUserStats(userId),
  ]);

  return <UserProfilePage userId={userId} user={user} stats={stats} />;
}
