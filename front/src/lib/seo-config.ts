import type { StatsAll } from "@/types/bff";
import { routing } from "@/i18n/routing";

export const BASE_URL = "https://minesweeper.fr";

export const SEO_CONFIG = {
  minGamesForIndex: 50,
  minWinsForIndex: 10,
  topPlayersCount: 100,
} as const;

/**
 * Generate proper alternates (canonical + hreflang) for a given path and locale.
 * Path should NOT include locale prefix (e.g., "/skins" not "/fr/skins").
 */
export function generateAlternates(path: string, currentLocale: string) {
  const canonicalPath = currentLocale === routing.defaultLocale
    ? `${BASE_URL}${path}`
    : `${BASE_URL}/${currentLocale}${path}`;

  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = locale === routing.defaultLocale
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${locale}${path}`;
  }
  languages["x-default"] = `${BASE_URL}${path}`;

  return {
    canonical: canonicalPath,
    languages,
  };
}

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
