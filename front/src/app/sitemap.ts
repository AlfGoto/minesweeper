import type { MetadataRoute } from "next";
import { getAllBackgroundSkinSlugs } from "@/features/skins/backgrounds/skins";
import { getAllSkinSlugs } from "@/features/skins/cells/cell-skins";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers, getTopPlayers } from "@/lib/seo-config";

export function getStaticPages(): MetadataRoute.Sitemap {
  const skinSlugs = getAllSkinSlugs();
  const backgroundSkinSlugs = getAllBackgroundSkinSlugs();

  const skinPages = skinSlugs.map((slug) => ({
    url: `https://minesweeper.fr/skins/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const backgroundSkinPages = backgroundSkinSlugs.map((slug) => ({
    url: `https://minesweeper.fr/skins/background/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [
    {
      url: "https://minesweeper.fr",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://minesweeper.fr/how-to-play",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://minesweeper.fr/map",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://minesweeper.fr/players",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://minesweeper.fr/stats",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://minesweeper.fr/skins",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: "https://minesweeper.fr/skins/background",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
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

  const playerPages = indexablePlayers.map((player) => ({
    url: `https://minesweeper.fr/stats/${player.userId}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: topPlayerIds.has(player.userId) ? 0.8 : 0.6,
  }));

  return [...staticPages, ...playerPages];
}
