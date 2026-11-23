import type { MetadataRoute } from "next";
import { getAllBackgroundSkinSlugs } from "@/features/skins/backgrounds";
import { getAllSkinSlugs } from "@/features/skins/cells/skins";
import { getAllStats, getMonthlyIndex } from "@/lib/api";
import { filterIndexablePlayers, getBlogPageDate, getTopPlayers, isBlogPagePublished } from "@/lib/seo-config";
import { createPlayerSlug } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import { getAllPages } from "@basalf/cms-next";

const BASE_URL = "https://minesweeper.fr";

export const revalidate = 86400; // 1 day

// Fixed lastModified for pages that rarely change (skins, backgrounds,
// how-to-play, map, reddit, blog pages without a date). Update by hand, only
// when one of these pages really changes.
const STATIC_PAGES_LAST_MODIFIED = new Date("2026-11-23T00:00:00.000Z");

function createEntries(
  path: string,
  changeFrequency: "weekly" | "monthly" | "daily",
  priority: number,
  options: { lastModified?: Date; locales?: readonly string[] } = {}
): MetadataRoute.Sitemap {
  const { lastModified = new Date(), locales = routing.locales } = options;
  return locales.map((locale) => {
    const url = locale === routing.defaultLocale
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${locale}${path}`;

    return {
      url,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}

export function getStaticPages(): MetadataRoute.Sitemap {
  const skinSlugs = getAllSkinSlugs();
  const backgroundSkinSlugs = getAllBackgroundSkinSlugs();

  const skinPages = skinSlugs.flatMap((slug) =>
    createEntries(`/skins/${slug}`, "monthly", 0.7, { lastModified: STATIC_PAGES_LAST_MODIFIED })
  );

  const backgroundSkinPages = backgroundSkinSlugs.flatMap((slug) =>
    createEntries(`/skins/background/${slug}`, "monthly", 0.65, {
      lastModified: STATIC_PAGES_LAST_MODIFIED,
    })
  );

  return [
    ...createEntries("", "weekly", 1),
    ...createEntries("/how-to-play", "monthly", 0.9, { lastModified: STATIC_PAGES_LAST_MODIFIED }),
    ...createEntries("/map", "weekly", 0.85, { lastModified: STATIC_PAGES_LAST_MODIFIED }),
    ...createEntries("/players", "daily", 0.9),
    ...createEntries("/stats", "daily", 0.9),
    ...createEntries("/stats/leaderboard/best-times", "daily", 0.85),
    ...createEntries("/stats/leaderboard/time-played", "daily", 0.85),
    ...createEntries("/stats/leaderboard/monthly", "daily", 0.85),
    ...createEntries("/stats/skins", "daily", 0.85),
    ...createEntries("/skins", "weekly", 0.85),
    ...createEntries("/reddit", "monthly", 0.5, { lastModified: STATIC_PAGES_LAST_MODIFIED }),
    ...createEntries("/skins/background", "weekly", 0.8),
    ...createEntries("/blog", "weekly", 0.7),
    ...skinPages,
    ...backgroundSkinPages,
  ];
}

// Blog articles are published per-locale in the CMS: an article can exist in
// /fr/blog/slug without an /en/blog/slug counterpart. So each entry uses only
// the locale it actually has, instead of createEntries' "same path for every
// locale" assumption.
async function getBlogPages(): Promise<MetadataRoute.Sitemap> {
  const allPages = await getAllPages();

  return allPages
    .filter((page) => routing.locales.includes(page.locale as (typeof routing.locales)[number]))
    .filter(isBlogPagePublished)
    .map((page) => {
      const path = `/blog${page.url.startsWith("/") ? "" : "/"}${page.url}`;
      const url = page.locale === routing.defaultLocale
        ? `${BASE_URL}${path}`
        : `${BASE_URL}/${page.locale}${path}`;

      return {
        url,
        lastModified: getBlogPageDate(page) ?? STATIC_PAGES_LAST_MODIFIED,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    });
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
      topPlayerIds.has(player.userId) ? 0.3 : 0.1,
      { locales: [routing.defaultLocale] }
    )
  );

  // The API only returns months that have at least one game
  const months = await getMonthlyIndex();
  const monthPages = months.flatMap(({ month }) =>
    createEntries(`/stats/leaderboard/monthly/${month}`, "daily", 0.8)
  );

  const blogPages = await getBlogPages();

  return [...staticPages, ...playerPages, ...monthPages, ...blogPages];
}
