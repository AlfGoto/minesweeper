import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllStats, getBestGames } from "@/lib/api";
import { getTopPlayers, filterIndexablePlayers } from "@/lib/seo-config";
import { generateLeaderboardJsonLd } from "@/lib/structured-data";
import { formatTime } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Minesweeper Players & Leaderboards",
  description:
    "Browse top Minesweeper players, leaderboards, and statistics. See the fastest times, highest win rates, and most experienced players.",
  alternates: {
    canonical: "https://minesweeper.fr/players",
  },
  openGraph: {
    title: "Minesweeper Players & Leaderboards",
    description:
      "Browse top Minesweeper players, leaderboards, and statistics. See the fastest times and highest win rates.",
    type: "website",
    url: "https://minesweeper.fr/players",
  },
};

export default async function PlayersPage() {
  const [allStats, bestGames] = await Promise.all([
    getAllStats(),
    getBestGames(),
  ]);

  const topByTime = getTopPlayers(allStats, 10);
  const topByWins = [...allStats]
    .sort((a, b) => b.totalWin - a.totalWin)
    .slice(0, 10);
  const topByGames = [...allStats]
    .sort((a, b) => b.totalGames - a.totalGames)
    .slice(0, 10);
  const indexableCount = filterIndexablePlayers(allStats).length;

  const jsonLd = generateLeaderboardJsonLd();

  return (
    <div className="max-w-[1200px] mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Minesweeper Leaderboards</h1>
        <p className="text-lg text-gray-600">
          Explore top players ranked by speed, wins, and experience.{" "}
          {indexableCount} players have earned their spot on our leaderboards.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <LeaderboardSection
          title="Fastest Times"
          description="Players with the quickest wins"
          players={topByTime}
          statKey="bestTime"
          statLabel="Best"
          formatStat={(v) => formatTime(v)}
        />

        <LeaderboardSection
          title="Most Wins"
          description="Players with the most victories"
          players={topByWins}
          statKey="totalWin"
          statLabel="Wins"
          formatStat={(v) => String(v)}
        />

        <LeaderboardSection
          title="Most Experienced"
          description="Players with the most games played"
          players={topByGames}
          statKey="totalGames"
          statLabel="Games"
          formatStat={(v) => String(v)}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Best Games</h2>
        <p className="text-gray-600 mb-6">
          The latest record-breaking performances from our community.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestGames.slice(0, 6).map((game, i) => (
            <Link
              key={`${game.userId}-${i}`}
              href={`/stats/${game.userId}`}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Image
                src={game.userPicture}
                alt={game.userName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{game.userName}</p>
                <p className="text-sm text-gray-500">
                  {formatTime(game.time)} with {game.flags} flags
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2 className="text-gray-900">About Minesweeper Rankings</h2>
        <p>
          Our leaderboards track player performance across multiple dimensions.
          The <strong>Fastest Times</strong> leaderboard shows players who have
          achieved the quickest winning games. <strong>Most Wins</strong> ranks
          players by total victories, while <strong>Most Experienced</strong>{" "}
          highlights dedicated players with the highest game count.
        </p>
        <p>
          Players are indexed on our site once they reach 50 games played, 10
          wins, or record a best time. This ensures our leaderboards showcase
          committed players while keeping the index focused and crawlable.
        </p>
      </section>
    </div>
  );
}

interface LeaderboardSectionProps {
  title: string;
  description: string;
  players: {
    userId: string;
    userName: string;
    userPicture: string;
    bestTime?: number;
    totalWin: number;
    totalGames: number;
  }[];
  statKey: "bestTime" | "totalWin" | "totalGames";
  statLabel: string;
  formatStat: (value: number) => string;
}

function LeaderboardSection({
  title,
  description,
  players,
  statKey,
  formatStat,
}: LeaderboardSectionProps) {
  return (
    <section className="border rounded-lg p-4 bg-white/50">
      <h2 className="text-xl font-bold mb-1 text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ol className="space-y-2">
        {players.map((player, i) => {
          const stat = player[statKey];
          if (stat === undefined) return null;

          return (
            <li key={player.userId}>
              <Link
                href={`/stats/${player.userId}`}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <span className="w-6 text-center font-mono text-gray-500">
                  {i + 1}
                </span>
                <Image
                  src={player.userPicture}
                  alt={player.userName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="flex-1 truncate text-gray-900">{player.userName}</span>
                <span className="text-sm font-medium text-gray-700">
                  {formatStat(stat)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
