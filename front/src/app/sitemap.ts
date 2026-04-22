import type { MetadataRoute } from "next";
import { getAllBackgroundSkinSlugs } from "@/features/skins/backgrounds/skins";
import { getAllSkinSlugs } from "@/features/skins/cells/cell-skins";

export function getPages(): MetadataRoute.Sitemap {
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
      url: "https://minesweeper.fr/skins/background",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...skinPages,
    ...backgroundSkinPages,
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return getPages();
}
