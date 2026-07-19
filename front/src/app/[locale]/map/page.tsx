import { Link } from "@/i18n/navigation";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers, generateAlternates } from "@/lib/seo-config";
import { formatTime } from "@/lib/dates";
import { createPlayerSlug } from "@/lib/utils";
import { Metadata } from "next";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkinsWithMeta } from "@/features/skins/cells/skins";
import { getPublishedBackgroundSkins } from "@/features/skins/backgrounds";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mapPage" });
  const alternates = generateAlternates("/map", locale);

  return {
    title: t("title"),
    description: t("description"),
    alternates,
    openGraph: {
      title: t("title"),
      description: t("description"),
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
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <MapContent locale={locale} />;
}

const MAIN_PAGES = [
  { path: "/", label: "playGame" },
  { path: "/how-to-play", label: "howToPlay" },
  { path: "/skins", label: "browseSkins" },
  { path: "/players", label: "leaderboard" },
  { path: "/stats", label: "myStats" },
  { path: "/reddit", label: "about" },
];

async function MapContent({ locale }: { locale: string }) {
  const t = await getTranslations("mapPage");
  const allStats = await getAllStats();

  const indexablePlayers = filterIndexablePlayers(allStats);
  const cellSkins = getPublishedSkinsWithMeta(locale);
  const backgroundSkins = getPublishedBackgroundSkins(locale);

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-green-600">
              Minesweeper
            </Link>
          </li>
          <li>/</li>
          <li className="text-green-600 font-medium">{t("breadcrumb")}</li>
        </ol>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          {t("title")}
        </h1>
        <p className="text-lg text-gray-600">{t("subtitle")}</p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t("quickLinks")}
        </h2>
        <div className="flex flex-wrap gap-3 mb-8">
          <QuickLink href="/" label={t("playGame")} />
          <QuickLink href="/skins" label={t("browseSkins")} />
          <QuickLink href="/players" label={t("leaderboard")} />
          <QuickLink href="/stats" label={t("myStats")} />
          <QuickLink href="/how-to-play" label={t("howToPlay")} />
          <QuickLink href="/reddit" label={t("about")} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t("mainPages")}
        </h2>
        <div className="border rounded-lg divide-y">
          {MAIN_PAGES.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700 hover:text-green-600"
            >
              {t(page.label)}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          <Link href="/skins" className="hover:text-green-600">
            {t("gridSkins")} ({cellSkins.length})
          </Link>
        </h2>
        <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
          {cellSkins.map((skin) => (
            <Link
              key={skin.slug}
              href={`/skins/${skin.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900">{skin.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          <Link href="/skins/background" className="hover:text-green-600">
            {t("backgroundSkins")} ({backgroundSkins.length})
          </Link>
        </h2>
        <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
          {backgroundSkins.map((skin) => (
            <Link
              key={skin.slug}
              href={`/skins/background/${skin.slug}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900">{skin.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          <Link href="/players" className="hover:text-green-600">
            {t("players")} ({indexablePlayers.length})
          </Link>
        </h2>
        <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
          {indexablePlayers.map((player) => (
            <Link
              key={player.userId}
              href={`/players/${createPlayerSlug(player.userName, player.userId)}`}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900">{player.userName}</span>
              <span className="text-gray-500 ml-2">
                {player.totalWin} {t("wins")}
                {player.bestTime
                  ? ` · ${t("best")} ${formatTime(player.bestTime)}`
                  : ""}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="text-center">
        <Link
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          {t("playMinesweeper")}
        </Link>
      </section>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-gray-200 hover:border-green-400 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors text-gray-700"
    >
      {label}
    </Link>
  );
}
