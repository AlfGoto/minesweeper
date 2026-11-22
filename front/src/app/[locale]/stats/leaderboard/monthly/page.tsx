import { Metadata } from "next";
import Image from "next/image";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getMonthlyIndex } from "@/lib/api";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";
import { formatMonth } from "@/lib/months";
import { formatTime } from "@/lib/dates";
import { createPlayerSlug } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";

type Params = Promise<{ locale: string }>;

const PATH = "/stats/leaderboard/monthly";
const MEDALS = ["🥇", "🥈", "🥉"];

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboardPage" });
  const alternates = generateAlternates(PATH, locale);
  const title = t("monthlyIndexTitle");
  const description = t("monthlyIndexDescription");

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
      images: generateOgImages(PATH, title),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function MonthlyIndexPage({ params }: { params: Params }) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <MonthlyIndexContent locale={locale} />;
}

async function MonthlyIndexContent({ locale }: { locale: string }) {
  const [months, t] = await Promise.all([
    getMonthlyIndex(),
    getTranslations("leaderboardPage"),
  ]);

  // Newest first
  const sorted = [...months].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <PageContainer>
      <Breadcrumbs
        items={[
          { label: "Minesweeper", href: "/" },
          { label: t("stats"), href: "/stats" },
          { label: t("monthlyIndexBreadcrumb") },
        ]}
      />

      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-foreground">
          {t("monthlyIndexHeading")}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t("monthlyIndexSubtitle")}
        </p>
      </header>

      <div className="space-y-6">
        {sorted.map(({ month, top3 }) => {
          const label = formatMonth(month, locale);
          return (
            <section key={month} className="border rounded-lg p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  {label}
                </h2>
                <Button asChild variant="outline" size="sm">
                  <Link href={`${PATH}/${month}`}>
                    {t("viewAll")}
                    <span className="sr-only"> {label}</span>
                  </Link>
                </Button>
              </div>
              <ol className="space-y-3">
                {top3.slice(0, 3).map((game, index) => (
                  <li key={`${game.userId}-${index}`}>
                    <Link
                      href={`/players/${createPlayerSlug(game.userName, game.userId)}`}
                      className="flex items-center gap-3 rounded-md p-1 hover:bg-accent"
                    >
                      <span className="text-xl" aria-hidden>
                        {MEDALS[index]}
                      </span>
                      <Image
                        src={game.userPicture}
                        alt={game.userName}
                        width={36}
                        height={36}
                        className="rounded-full ring-2 ring-muted"
                      />
                      <span className="flex-1 font-medium">{game.userName}</span>
                      <span className="font-mono font-semibold">
                        {formatTime(game.time)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/stats">← {t("backToStats")}</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
