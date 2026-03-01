import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/dates";
import { Separator } from "@/components/ui/separator";

interface StatsData {
  totalGames: number;
  totalTime: number;
  totalFlags: number;
  totalRevealed: number;
  totalBombs: number;
  totalWin: number;
  bestTime: number;
  totalNoFlagsWin: number;
  totalRestarts: number;
}

interface StatsProps {
  stats: StatsData | null | undefined;
  title?: string;
}

export function Stats({ stats, title = "Your stats" }: StatsProps) {
  if (!stats) return <NoStats />;

  const gameStats = [
    { label: "Total Games", value: stats.totalGames.toString(), emoji: "🎮" },
    { label: "Wins", value: stats.totalWin.toString(), emoji: "🏆" },
    {
      label: "Winrate",
      value: ((stats.totalWin / stats.totalGames) * 100).toFixed(2) + "%",
      emoji: "📈",
    },
    { label: "No Flags Wins", value: stats.totalNoFlagsWin.toString(), emoji: "🚫🚩" },
    { label: "Restarts", value: stats.totalRestarts.toString(), emoji: "🔄" },
  ];

  const timeStats = [
    { label: "Total Time", value: formatTime(stats.totalTime), emoji: "⏱️" },
    { label: "Best Time", value: formatTime(stats.bestTime), emoji: "⚡" },
    {
      label: "Avg Game Time",
      value: formatTime(stats.totalTime / stats.totalGames),
      emoji: "⏳",
    },
  ];

  const gameplayStats = [
    { label: "Cells Revealed", value: stats.totalRevealed.toString(), emoji: "👆" },
    { label: "Flags Placed", value: stats.totalFlags.toString(), emoji: "🚩" },
    { label: "Bombs Hit", value: stats.totalBombs.toString(), emoji: "💣" },
    {
      label: "Avg Flags/Game",
      value: (stats.totalFlags / stats.totalGames).toFixed(2),
      emoji: "🚩",
    },
    {
      label: "Avg Revealed/Game",
      value: (stats.totalRevealed / stats.totalGames).toFixed(2),
      emoji: "🔢",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <StatsGroup title="Games" stats={gameStats} />
      <Separator />
      <StatsGroup title="Time" stats={timeStats} />
      <Separator />
      <StatsGroup title="Gameplay" stats={gameplayStats} />
    </div>
  );
}

function StatsGroup({
  title,
  stats,
}: {
  title: string;
  stats: { label: string; value: string; emoji: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {title}
      </h3>
      <div className="flex flex-wrap gap-4">
        {stats.map((stat) => (
          <StatBox
            key={stat.label}
            label={stat.label}
            value={stat.value}
            emoji={stat.emoji}
          />
        ))}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <div
      className="gap-2 flex flex-col items-center border border-gray-200 p-4 rounded-xl"
      style={{ minWidth: 160 }}
    >
      <p className="text-sm text-gray-500 text-center">
        {emoji} {label}
      </p>
      <p className="text-lg font-bold text-center">{value}</p>
    </div>
  );
}

function NoStats() {
  return (
    <div className="flex flex-col gap-4 w-full rounded-xl border border-gray-200 p-4">
      <h2>No stats found</h2>
      <p>The user has not played any games yet.</p>
      <Link href="/">
        <Button>Back to game</Button>
      </Link>
    </div>
  );
}
