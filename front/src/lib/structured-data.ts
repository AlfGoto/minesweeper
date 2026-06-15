import type { User, UserStats } from "@/types/bff";

export function generateProfileJsonLd(
  userId: string,
  user: User,
  stats: UserStats | undefined
) {
  const winRate = stats && stats.totalGames > 0
    ? Math.round((stats.totalWin / stats.totalGames) * 100)
    : 0;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.userName,
      image: user.userPicture,
      url: `https://minesweeper.fr/stats/${userId}`,
      description: stats?.bestTime
        ? `Minesweeper player with ${stats.totalWin} wins and best time of ${stats.bestTime}s`
        : `Minesweeper player with ${stats?.totalGames ?? 0} games played`,
    },
    about: {
      "@type": "VideoGame",
      name: "Minesweeper",
      url: "https://minesweeper.fr",
    },
    ...(stats && {
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/PlayAction",
          userInteractionCount: stats.totalGames,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WinAction",
          userInteractionCount: stats.totalWin,
        },
      ],
    }),
  };
}

export function generateLeaderboardJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Minesweeper Leaderboards",
    description: "Top Minesweeper players ranked by best time, win rate, and total wins.",
    url: "https://minesweeper.fr/players",
    isPartOf: {
      "@type": "WebSite",
      name: "Minesweeper.fr",
      url: "https://minesweeper.fr",
    },
    about: {
      "@type": "VideoGame",
      name: "Minesweeper",
      genre: "Puzzle",
      url: "https://minesweeper.fr",
    },
  };
}
