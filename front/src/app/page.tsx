import { Metadata } from "next";
import HomeComponent from "@/features/homepage";

export const metadata: Metadata = {
  title: "Play Minesweeper Online - Free Classic Puzzle Game",
  description:
    "Play the classic Minesweeper puzzle game for free! Clear the minefield without hitting a bomb. Features multiple difficulty levels, unique skins, leaderboards, and statistics tracking.",
  openGraph: {
    title: "Play Minesweeper Online - Free Classic Puzzle Game",
    description:
      "Play the classic Minesweeper puzzle game for free! Clear the minefield, unlock unique skins, compete on leaderboards, and track your stats.",
  },
};

export default function Home() {
  return <HomeComponent />;
}