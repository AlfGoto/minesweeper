import type { User, UserStats } from "@/types/bff";
import { formatTime } from "./dates";
import { createPlayerSlug } from "./utils";

export function generateProfileJsonLd(
  userId: string,
  user: User,
  stats: UserStats | undefined,
  locale: string = "en"
) {
  const playerSlug = createPlayerSlug(user.userName || "player", userId);
  const localePath = locale === "en" ? "" : `/${locale}`;
  const playerUrl = `https://minesweeper.fr${localePath}/players/${playerSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    ...(stats?.createdAt && { dateCreated: stats.createdAt }),
    dateModified: stats?.updatedAt ?? new Date().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: user.userName,
      identifier: userId,
      image: user.userPicture,
      url: playerUrl,
      description: stats?.bestTime
        ? `Minesweeper player with ${stats.totalWin} wins and best time of ${formatTime(stats.bestTime)}`
        : `Minesweeper player with ${stats?.totalGames ?? 0} games played`,
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
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/LoseAction",
            userInteractionCount: stats.totalGames - stats.totalWin - stats.totalRestarts,
          },
        ],
      }),
    },
    about: {
      "@type": "VideoGame",
      name: "Minesweeper",
      url: "https://minesweeper.fr",
    },
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
