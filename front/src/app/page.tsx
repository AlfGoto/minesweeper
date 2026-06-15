import { Metadata } from "next";
import HomeComponent from "@/features/homepage";

export const metadata: Metadata = {
  title: "Minesweeper - Skins, Stats, Leaderboards & Speedruns",
  description:
    "Play Minesweeper with 20+ unique skins. Track your stats, compete on global leaderboards, speedrun your best time. Free to play.",
  openGraph: {
    title: "Minesweeper - Skins, Stats, Leaderboards & Speedruns",
    description:
      "Play Minesweeper with 20+ unique skins. Track your stats, compete on global leaderboards, speedrun your best time. Free to play.",
  },
  alternates: {
    languages: {
      en: "/",
      fr: "/",
      es: "/",
      de: "/",
      it: "/",
      pt: "/",
      nl: "/",
      "x-default": "/",
    },
  },
};

export default function Home() {
  return <HomeComponent />;
}