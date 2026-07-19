import type { MetadataRoute } from "next";
import { getAllBackgroundSkinSlugs } from "@/features/skins/backgrounds";
import { getAllSkinSlugs } from "@/features/skins/cells/skins";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers, getTopPlayers } from "@/lib/seo-config";
import { createPlayerSlug } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://minesweeper.fr";

function createEntries(
  path: string,
  changeFrequency: "weekly" | "monthly" | "daily",
  priority: number
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => {
    const url = locale === routing.defaultLocale
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${locale}${path}`;

    return {
      url,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });
}

export function getStaticPages(): MetadataRoute.Sitemap {
  const skinSlugs = getAllSkinSlugs();
  const backgroundSkinSlugs = getAllBackgroundSkinSlugs();

  const skinPages = skinSlugs.flatMap((slug) =>
    createEntries(`/skins/${slug}`, "monthly", 0.7)
  );

  const backgroundSkinPages = backgroundSkinSlugs.flatMap((slug) =>
    createEntries(`/skins/background/${slug}`, "monthly", 0.65)
  );

  return [
    ...createEntries("", "weekly", 1),
    ...createEntries("/how-to-play", "monthly", 0.9),
    ...createEntries("/map", "weekly", 0.85),
    ...createEntries("/players", "daily", 0.9),
    ...createEntries("/stats", "daily", 0.9),
    ...createEntries("/stats/leaderboard/best-times", "daily", 0.85),
    ...createEntries("/stats/leaderboard/time-played", "daily", 0.85),
    ...createEntries("/skins", "weekly", 0.85),
    ...createEntries("/reddit", "monthly", 0.5),
    ...createEntries("/skins/background", "weekly", 0.8),
    ...skinPages,
    ...backgroundSkinPages,
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = getStaticPages();

  const allStats = await getAllStats();
  const indexablePlayers = filterIndexablePlayers(allStats);
  const topPlayers = getTopPlayers(allStats, 50);
  const topPlayerIds = new Set(topPlayers.map((p) => p.userId));

  const playerPages = indexablePlayers.flatMap((player) =>
    createEntries(
      `/players/${createPlayerSlug(player.userName, player.userId)}`,
      "weekly",
      topPlayerIds.has(player.userId) ? 0.8 : 0.6
    )
  );

  return [...staticPages, ...playerPages];
}
