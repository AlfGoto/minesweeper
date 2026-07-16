import { Metadata } from "next";
import { StatsPage } from "@/features/stats";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statsPage" });
  const alternates = generateAlternates("/stats", locale);

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: [
      "minesweeper stats",
      "minesweeper leaderboard",
      "minesweeper rankings",
      "best minesweeper times",
      "statistiques démineur",
      "classement démineur",
      "estadísticas buscaminas",
      "mijnenveger statistieken",
    ],
    alternates,
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
      images: [
        {
          url: "https://minesweeper.fr/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Minesweeper - Free Online Puzzle Game",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default function StatsPageWrapper({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <StatsPage />;
}
