import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getBestGames, getBestStats } from "@/lib/api";
import { filterIndexablePlayers, generateAlternates } from "@/lib/seo-config";
import { generateLeaderboardJsonLd } from "@/lib/structured-data";
import { formatTime } from "@/lib/dates";
import { createPlayerSlug } from "@/lib/utils";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "playersPage" });
  const alternates = generateAlternates("/players", locale);

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates,
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      type: "website",
      url: alternates.canonical,
      siteName: "Minesweeper",
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
      title: t("title"),
      description: t("metaDescription"),
    },
  };
}

export default function PlayersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <PlayersContent />;
}

async function PlayersContent() {
  const t = await getTranslations("playersPage");
  const [bestStats, bestGames] = await Promise.all([
    getBestStats(),
    getBestGames(),
  ]);

  const topByTime = bestStats.slice(0, 10);
  const topByWins = [...bestStats]
    .sort((a, b) => b.totalWin - a.totalWin)
    .slice(0, 10);
  const topByGames = [...bestStats]
    .sort((a, b) => b.totalGames - a.totalGames)
    .slice(0, 10);
  const indexableCount = filterIndexablePlayers(bestStats).length;

  const jsonLd = generateLeaderboardJsonLd();

  return (
    <div className="max-w-[1200px] mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{t("title")}</h1>
        <p className="text-lg text-gray-600">
          {t("subtitle", { count: indexableCount })}
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <LeaderboardSection
          title={t("fastestTimes")}
          description={t("fastestTimesDesc")}
          players={topByTime}
          statKey="bestTime"
          statLabel={t("best")}
          formatStat={(v) => formatTime(v)}
        />

        <LeaderboardSection
          title={t("mostWins")}
          description={t("mostWinsDesc")}
          players={topByWins}
          statKey="totalWin"
          statLabel={t("wins")}
          formatStat={(v) => String(v)}
        />

        <LeaderboardSection
          title={t("mostExperienced")}
          description={t("mostExperiencedDesc")}
          players={topByGames}
          statKey="totalGames"
          statLabel={t("games")}
          formatStat={(v) => String(v)}
        />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          {t("recentBestGames")}
        </h2>
        <p className="text-gray-600 mb-6">{t("recentBestGamesDesc")}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bestGames.slice(0, 6).map((game, i) => (
            <Link
              key={`${game.userId}-${i}`}
              href={`/players/${createPlayerSlug(game.userName, game.userId)}`}
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
                  {formatTime(game.time)} - {game.flags} {t("flags")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 prose prose-gray max-w-none">
        <h2 className="text-gray-900">{t("aboutRankings")}</h2>
        <p>{t("aboutRankingsText1")}</p>
        <p>{t("aboutRankingsText2")}</p>
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
                href={`/players/${createPlayerSlug(player.userName, player.userId)}`}
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
                <span className="flex-1 truncate text-gray-900">
                  {player.userName}
                </span>
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
