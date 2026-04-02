import type { MetadataRoute } from "next";
import { getAllSkinSlugs } from "@/features/skins/cell-skins";

export default function sitemap(): MetadataRoute.Sitemap {
  const skinSlugs = getAllSkinSlugs();
  const skinPages = skinSlugs.map((slug) => ({
    url: `https://minesweeper.fr/skins/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
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
      url: "https://minesweeper.fr/skins",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...skinPages,
  ];
}
