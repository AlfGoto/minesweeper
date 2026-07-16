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
    title: t("leaderboard"),
    description: t("yourStats"),
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
      title: t("leaderboard"),
      description: t("yourStats"),
      url: alternates.canonical,
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
