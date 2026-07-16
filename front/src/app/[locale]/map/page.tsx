import { Link } from "@/i18n/navigation";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers, generateAlternates } from "@/lib/seo-config";
import { formatTime } from "@/lib/dates";
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
    description: t("subtitle"),
    alternates,
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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-green-400">
                Minesweeper
              </Link>
            </li>
            <li>/</li>
            <li className="text-green-400">{t("breadcrumb")}</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-300">{t("subtitle")}</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            {t("quickLinks")}
          </h2>
          <div className="flex flex-wrap gap-4 mb-8">
            <QuickLink href="/" label={t("playGame")} />
            <QuickLink href="/skins" label={t("browseSkins")} />
            <QuickLink href="/players" label={t("leaderboard")} />
            <QuickLink href="/stats" label={t("myStats")} />
            <QuickLink href="/how-to-play" label={t("howToPlay")} />
            <QuickLink href="/reddit" label={t("about")} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            {t("mainPages")}
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700">
            {MAIN_PAGES.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-green-400"
              >
                {t(page.label)}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            <Link href="/skins" className="hover:text-green-400">
              {t("gridSkins")} ({cellSkins.length})
            </Link>
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {cellSkins.map((skin) => (
              <Link
                key={skin.slug}
                href={`/skins/${skin.slug}`}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="text-white">{skin.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            <Link href="/skins" className="hover:text-green-400">
              {t("backgroundSkins")} ({backgroundSkins.length})
            </Link>
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {backgroundSkins.map((skin) => (
              <Link
                key={skin.slug}
                href={`/skins/background/${skin.slug}`}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="text-white">{skin.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            <Link href="/players" className="hover:text-green-400">
              {t("players")} ({indexablePlayers.length})
            </Link>
          </h2>
          <div className="bg-gray-800 rounded-lg border border-gray-700 divide-y divide-gray-700 max-h-96 overflow-y-auto">
            {indexablePlayers.map((player) => (
              <Link
                key={player.userId}
                href={`/stats/${player.userId}`}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="text-white">{player.userName}</span>
                <span className="text-gray-400 ml-2">
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
    </main>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
    >
      {label}
    </Link>
  );
}
