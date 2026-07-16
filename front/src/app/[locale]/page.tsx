import { use } from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HomeComponent from "@/features/homepage";
import { generateAlternates, BASE_URL } from "@/lib/seo-config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("", locale);

  return {
    title: "Minesweeper - Skins, Stats, Leaderboards & Speedruns",
    description:
      "Play Minesweeper with 20+ unique skins. Track your stats, compete on global leaderboards, speedrun your best time. Free to play.",
    openGraph: {
      title: "Minesweeper - Skins, Stats, Leaderboards & Speedruns",
      description:
        "Play Minesweeper with 20+ unique skins. Track your stats, compete on global leaderboards, speedrun your best time. Free to play.",
      url: alternates.canonical,
    },
    alternates,
  };
}

export default function Home({ params }: PageProps) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <HomeComponent />;
}
