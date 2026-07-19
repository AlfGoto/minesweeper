import { Metadata } from "next";
import { getBestStats } from "@/lib/api";
import { generateAlternates } from "@/lib/seo-config";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const t = await getTranslations({ locale, namespace: "leaderboardPage" });
  const alternates = generateAlternates("/stats/leaderboard/time-played", locale);

  return {
    title: t("timePlayedTitle"),
    description: t("timePlayedDescription"),
    alternates,
    openGraph: {
      title: t("timePlayedTitle"),
      description: t("timePlayedDescription"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
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
      title: t("timePlayedTitle"),
      description: t("timePlayedDescription"),
    },
  };
}

export default function TimePlayedLeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <TimePlayedContent />;
}

async function TimePlayedContent() {
  const [allStats, t, tTable, tEmpty, tPage] = await Promise.all([
    getBestStats(),
    getTranslations("leaderboardPage"),
    getTranslations("statsPage.table"),
    getTranslations("statsPage.empty"),
    getTranslations("statsPage"),
  ]);

  const sortedByTotalTime = [...allStats].sort((a, b) => b.totalTime - a.totalTime);

  return (
    <div className="max-w-[1000px] mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-green-600">
              Minesweeper
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/stats" className="hover:text-green-600">
              {t("stats")}
            </Link>
          </li>
          <li>/</li>
          <li className="text-green-600 font-medium">{t("timePlayed")}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">⏱️</span>
          <h1 className="text-3xl font-bold text-gray-900">{t("timePlayedTitle")}</h1>
        </div>
        <p className="text-lg text-gray-600">{t("timePlayedSubtitle")}</p>
      </header>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50">
              <TableHead style={{ textAlign: "left" }}>{tTable("rank")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("player")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tPage("totalTime")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("games")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("wins")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("winrate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedByTotalTime.map((stats, index) => {
              const href = `/players/${createPlayerSlug(stats.userName, stats.userId)}`;
              const rank = index + 1;
              const winrate =
                stats.totalGames > 0
                  ? ((stats.totalWin / stats.totalGames) * 100).toFixed(1)
                  : "0.0";

              return (
                <TableRow key={stats.userId} className="hover:bg-gray-100">
                  <TableCell style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-muted-foreground font-medium">{rank}</span>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell style={{ textAlign: "left" }}>
                    <Link href={href} className="flex items-center gap-3">
                      <Image
                        src={stats.userPicture}
                        alt={stats.userName}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-muted"
                      />
                      <span className="font-medium">{stats.userName}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono font-semibold" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {formatTime(stats.totalTime)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {stats.totalGames}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {stats.totalWin}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {winrate}%
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {sortedByTotalTime.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  {tEmpty("beFirstToPlay")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/stats"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← {t("backToStats")}
        </Link>
      </div>
    </div>
  );
}
