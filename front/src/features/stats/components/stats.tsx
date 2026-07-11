import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/dates";
import { Separator } from "@/components/ui/separator";
import { getTranslations } from "next-intl/server";

interface StatsData {
  totalGames: number;
  totalTime: number;
  totalFlags: number;
  totalRevealed: number;
  totalBombs: number;
  totalWin: number;
  bestTime?: number;
  totalNoFlagsWin: number;
  totalRestarts: number;
}

interface StatsProps {
  stats: StatsData | null | undefined;
  title?: string;
}

export async function Stats({ stats, title }: StatsProps) {
  const [t, tEmpty, tPage] = await Promise.all([
    getTranslations("statsPage.stats"),
    getTranslations("statsPage.empty"),
    getTranslations("statsPage"),
  ]);

  if (!stats || stats.totalGames === 0) {
    return (
      <div className="flex flex-col gap-4 w-full rounded-xl border border-gray-200 p-4">
        <h2>{tEmpty("noStatsFound")}</h2>
        <p>{tEmpty("startPlaying")}</p>
        <Link href="/" prefetch={true}>
          <Button>{tPage("backToGame")}</Button>
        </Link>
      </div>
    );
  }

  const displayTitle = title ?? t("title");

  const gameStats = [
    { label: t("totalGames"), value: stats.totalGames.toString(), emoji: "🎮" },
    { label: t("winsLabel"), value: stats.totalWin.toString(), emoji: "🏆" },
    {
      label: t("winrateLabel"),
      value: ((stats.totalWin / stats.totalGames) * 100).toFixed(2) + "%",
      emoji: "📈",
    },
    { label: t("noFlagsWins"), value: stats.totalNoFlagsWin.toString(), emoji: "🚫🚩" },
    { label: t("restarts"), value: stats.totalRestarts.toString(), emoji: "🔄" },
  ];

  const timeStats = [
    { label: t("totalTimeLabel"), value: formatTime(stats.totalTime), emoji: "⏱️" },
    {
      label: t("bestTime"),
      value: stats.bestTime !== undefined ? formatTime(stats.bestTime) : "N/A",
      emoji: "⚡",
    },
    {
      label: t("avgGameTime"),
      value: formatTime(stats.totalTime / stats.totalGames),
      emoji: "⏳",
    },
  ];

  const gameplayStats = [
    { label: t("cellsRevealed"), value: stats.totalRevealed.toString(), emoji: "👆" },
    { label: t("flagsPlaced"), value: stats.totalFlags.toString(), emoji: "🚩" },
    { label: t("bombsHit"), value: stats.totalBombs.toString(), emoji: "💣" },
    {
      label: t("avgFlagsGame"),
      value: (stats.totalFlags / stats.totalGames).toFixed(2),
      emoji: "🚩",
    },
    {
      label: t("avgRevealedGame"),
      value: (stats.totalRevealed / stats.totalGames).toFixed(2),
      emoji: "🔢",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <h2 className="text-2xl font-bold">{displayTitle}</h2>
      </div>

      <StatsGroup title={t("games")} stats={gameStats} />
      <Separator />
      <StatsGroup title={t("timeSection")} stats={timeStats} />
      <Separator />
      <StatsGroup title={t("gameplay")} stats={gameplayStats} />
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
