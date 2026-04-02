import { Metadata } from "next";
import { UserProfilePage } from "@/features/user-stats";
import { getUserById, getUserStats } from "@/lib/api";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;

  try {
    const [user, stats] = await Promise.all([
      getUserById(userId),
      getUserStats(userId),
    ]);

    if (!user) {
      return {
        title: "User Profile",
        description: "View player statistics, game history, and best times.",
      };
    }

    const userName = user.userName || "Player";
    const gamesPlayed = stats?.totalGames ?? 0;
    const gamesWon = stats?.totalWin ?? 0;
    const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const bestTime = stats?.bestTime;

    const title = `${userName}'s Minesweeper Stats`;
    const description = bestTime
      ? `View ${userName}'s Minesweeper statistics: ${gamesWon} wins, ${winRate}% win rate, best time ${bestTime}s. Track progress and compare with other players.`
      : `View ${userName}'s Minesweeper statistics: ${gamesPlayed} games played, ${gamesWon} wins, ${winRate}% win rate.`;

    return {
      title,
      description,
      openGraph: {
        title: `${userName} | Minesweeper Player Stats`,
        description,
        type: "profile",
        url: `https://minesweeper.fr/stats/${userId}`,
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("[generateMetadata] Error:", error);
    // Fallback metadata if API fails
    return {
      title: "User Profile",
      description: "View player statistics, game history, and best times.",
      openGraph: {
        title: "Minesweeper User Profile",
        description: "View player statistics, game history, and best times.",
      },
    };
  }
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;
  return <UserProfilePage userId={userId} />;
}
