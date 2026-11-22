import { Metadata } from "next";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";
import { getAllSkinStats } from "@/lib/api";
import { formatTime } from "@/lib/dates";
import { getPublishedSkinsWithMeta } from "@/features/skins/cells/skins";
import { getPublishedBackgroundSkins } from "@/features/skins/backgrounds";
import { PageContainer } from "@/components/page-container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "skinStatsPage" });
  const alternates = generateAlternates("/stats/skins", locale);

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates,
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
      images: generateOgImages("/stats/skins", t("metaTitle")),
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

export default function SkinStatsPageWrapper({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <SkinStatsContent locale={locale} />;
}

type Row = {
  id: string;
  name: string;
  href: string;
  games: number;
  wins: number;
  winRate: number;
  timePlayed: number;
  bestTime?: number;
};

async function SkinStatsContent({ locale }: { locale: string }) {
  const [t, cellStats, backgroundStats] = await Promise.all([
    getTranslations("skinStatsPage"),
    getAllSkinStats("cells"),
    getAllSkinStats("background"),
  ]);

  const toRows = (
    skins: { id: string; name: string; href: string }[],
    stats: typeof cellStats,
  ): Row[] => {
    const byName = new Map(stats.map((s) => [s.skinName, s]));
    return skins
      .map((skin) => {
        const s = byName.get(skin.id);
        return {
          ...skin,
          games: s?.games ?? 0,
          wins: s?.wins ?? 0,
          winRate: s?.winRate ?? 0,
          timePlayed: s?.timePlayed ?? 0,
          bestTime: s?.bestTime,
        };
      })
      .sort((a, b) => b.games - a.games);
  };

  const cellRows = toRows(
    getPublishedSkinsWithMeta(locale).map((s) => ({
      id: s.id,
      name: s.name,
      href: `/skins/${s.slug}`,
    })),
    cellStats,
  );
  const backgroundRows = toRows(
    getPublishedBackgroundSkins(locale).map((s) => ({
      id: s.id,
      name: s.name,
      href: `/skins/background/${s.slug}`,
    })),
    backgroundStats,
  );

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Minesweeper", href: "/" },
          { label: t("stats"), href: "/stats" },
          { label: t("title") },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </header>

      <div className="flex flex-col gap-10">
        <SkinTable title={t("cellSkins")} rows={cellRows} locale={locale} />
        <SkinTable title={t("backgrounds")} rows={backgroundRows} locale={locale} />
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/stats">← {t("backToStats")}</Link>
        </Button>
      </div>
    </PageContainer>
  );
}

async function SkinTable({
  title,
  rows,
  locale,
}: {
  title: string;
  rows: Row[];
  locale: string;
}) {
  const t = await getTranslations("skinStatsPage");
  const count = new Intl.NumberFormat(locale);
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("skin")}</TableHead>
              <TableHead className="text-right">{t("games")}</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                {t("wins")}
              </TableHead>
              <TableHead className="text-right">{t("winRate")}</TableHead>
              <TableHead className="text-right hidden md:table-cell">
                {t("timePlayed")}
              </TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                {t("bestTime")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={row.href}
                    className="font-medium text-green-700 hover:underline"
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  {count.format(row.games)}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {count.format(row.wins)}
                </TableCell>
                <TableCell className="text-right">
                  {percent.format(row.winRate)}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {formatTime(row.timePlayed)}
                </TableCell>
                <TableCell className="text-right font-mono hidden sm:table-cell">
                  {row.bestTime !== undefined
                    ? formatTime(row.bestTime)
                    : t("noBestTime")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
