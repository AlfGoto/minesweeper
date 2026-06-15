import type { StatsAll } from "@/types/bff";

export const SEO_CONFIG = {
  minGamesForIndex: 50,
  minWinsForIndex: 10,
  topPlayersCount: 100,
} as const;

export interface IndexablePlayer extends StatsAll {
  isIndexable: boolean;
  indexReason?: string;
}

export function shouldIndexProfile(stats: StatsAll | undefined): { indexable: boolean; reason?: string } {
  if (!stats) return { indexable: false };

  if (stats.totalGames >= SEO_CONFIG.minGamesForIndex) {
    return { indexable: true, reason: "games" };
  }

  if (stats.totalWin >= SEO_CONFIG.minWinsForIndex) {
    return { indexable: true, reason: "wins" };
  }

  if (stats.bestTime && stats.bestTime > 0) {
    return { indexable: true, reason: "bestTime" };
  }

  return { indexable: false };
}

export function getIndexablePlayers(allStats: StatsAll[]): IndexablePlayer[] {
  return allStats.map((stats) => {
    const { indexable, reason } = shouldIndexProfile(stats);
    return { ...stats, isIndexable: indexable, indexReason: reason };
  });
}

export function filterIndexablePlayers(allStats: StatsAll[]): StatsAll[] {
  return allStats.filter((stats) => shouldIndexProfile(stats).indexable);
}

export function getTopPlayers(allStats: StatsAll[], limit: number = SEO_CONFIG.topPlayersCount): StatsAll[] {
  return [...allStats]
    .sort((a, b) => (a.bestTime ?? Infinity) - (b.bestTime ?? Infinity))
    .slice(0, limit);
}
