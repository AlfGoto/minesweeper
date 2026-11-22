import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMonthlyLeaderboard } from "@/lib/api";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";
import { FIRST_MONTH, formatMonth, isValidMonth } from "@/lib/months";
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
import { PageContainer } from "@/components/page-container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { LocalDate } from "@/features/stats/components/local-date";

type Params = Promise<{ locale: string; month: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, month } = await params;
  if (!isValidMonth(month)) return {};

  const t = await getTranslations({ locale, namespace: "leaderboardPage" });
  const label = formatMonth(month, locale);
  const path = `/stats/leaderboard/monthly/${month}`;
  const title = t("monthlyTitle", { month: label });
  const description = t("monthlyDescription", { month: label });
  const alternates = generateAlternates(path, locale);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
      images: generateOgImages(path, title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function MonthlyLeaderboardPage({ params }: { params: Params }) {
  const { locale, month } = use(params);
  setRequestLocale(locale);

  if (!isValidMonth(month)) notFound();

  return <MonthlyContent month={month} locale={locale} />;
}

async function MonthlyContent({
  month,
  locale,
}: {
  month: string;
  locale: string;
}) {
  const [entries, t, tTable] = await Promise.all([
    getMonthlyLeaderboard(month),
    getTranslations("leaderboardPage"),
    getTranslations("statsPage.table"),
  ]);

  if (entries.length === 0) notFound();

  const label = formatMonth(month, locale);

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Minesweeper", href: "/" },
          { label: t("stats"), href: "/stats" },
          { label },
        ]}
      />

      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          {t("monthlyTitle", { month: label })}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("monthlySubtitle", { month: label })}
        </p>
        {month === FIRST_MONTH && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t("monthlySinceLaunch")}
          </p>
        )}
      </header>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead style={{ textAlign: "left" }}>{tTable("rank")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("player")}</TableHead>
              <TableHead style={{ textAlign: "left" }}>{tTable("time")}</TableHead>
              <TableHead className="hidden sm:table-cell" style={{ textAlign: "left" }}>
                {tTable("flags")}
              </TableHead>
              <TableHead className="hidden sm:table-cell" style={{ textAlign: "left" }}>
                {tTable("date")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((game, index) => {
              const href = `/players/${createPlayerSlug(game.userName, game.userId)}`;
              const rank = index + 1;

              return (
                <TableRow key={`${game.userId}-${index}`} className="hover:bg-accent">
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
                  <TableCell className="text-muted-foreground hidden sm:table-cell" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      {game.flags}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell" style={{ textAlign: "left" }}>
                    <Link href={href} className="block">
                      <LocalDate date={game.date} locale={locale} />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/stats">← {t("backToStats")}</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
