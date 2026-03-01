import { Metadata } from "next";
import { StatsPage } from "@/features/stats";

export const metadata: Metadata = {
  title: "Statistics & Leaderboard",
  description:
    "View your Minesweeper statistics, track your progress, and compete on the global leaderboard. See best times, win rates, and player rankings.",
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
  openGraph: {
    title: "Minesweeper Statistics & Leaderboard",
    description:
      "Track your progress and compete on the global leaderboard. View best times, win rates, and player rankings.",
  },
};

export default StatsPage;
