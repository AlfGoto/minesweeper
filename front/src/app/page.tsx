import { Metadata } from "next";
import HomeComponent from "@/features/homepage";

export const metadata: Metadata = {
  title: "Play Minesweeper Online - Free Classic Puzzle Game",
  description:
    "Play Minesweeper online free. Clear mines, unlock skins, compete on leaderboards and track your stats.",
  openGraph: {
    title: "Play Minesweeper Online - Free Classic Puzzle Game",
    description:
      "Play Minesweeper online free. Clear mines, unlock skins, compete on leaderboards and track your stats.",
  },
};

export default function Home() {
  return <HomeComponent />;
}