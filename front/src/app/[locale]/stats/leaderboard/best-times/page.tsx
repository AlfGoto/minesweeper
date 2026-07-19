import { Metadata } from "next";
import { getAllBestGames } from "@/lib/api";
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
import { formatDate, formatTime } from "@/lib/dates";
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
  const alternates = generateAlternates("/stats/leaderboard/best-times", locale);

  return {
    title: t("bestTimesTitle"),
    description: t("bestTimesDescription"),
    alternates,
    openGraph: {
      title: t("bestTimesTitle"),
      description: t("bestTimesDescription"),
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
      title: t("bestTimesTitle"),
      description: t("bestTimesDescription"),
    },
  };
}

export default function BestTimesLeaderboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <BestTimesContent />;
}

async function BestTimesContent() {
  const [bestGames, t, tTable, tEmpty] = await Promise.all([
    getAllBestGames(),
    getTranslations("leaderboardPage"),
    getTranslations("statsPage.table"),
    getTranslations("statsPage.empty"),
  ]);

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
          <li className="text-green-600 font-medium">{t("bestTimes")}</li>
        </ol>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🏆</span>
          <h1 className="text-3xl font-bold text-gray-900">{t("bestTimesTitle")}</h1>
        </div>
        <p className="text-lg text-gray-600">{t("bestTimesSubtitle")}</p>
      </header>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50">
              <TableHead style={{ textAlign: "left" }}>{tTable("rank")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("player")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("time")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("flags")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("date")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestGames.map((game, index) => {
              const href = `/players/${createPlayerSlug(game.userName, game.userId)}`;
              const rank = index + 1;

              return (
                <TableRow key={`${game.userId}-${index}`} className="hover:bg-gray-100">
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
                        src={game.userPicture}
                        alt={game.userName}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-muted"
                      />
                      <span className="font-medium">{game.userName}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="font-mono font-semibold" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {formatTime(game.time)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {game.flags}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {formatDate(game.date)}
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {bestGames.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  {tEmpty("noGamesYet")}
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
