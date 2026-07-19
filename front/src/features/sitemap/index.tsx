import { Link } from "@/i18n/navigation";
import { getStaticPages } from "@/app/sitemap";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers } from "@/lib/seo-config";
import { formatTime } from "@/lib/dates";
import { createPlayerSlug } from "@/lib/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sitemap - All Pages & Players",
  description:
    "Browse all pages on Minesweeper.fr - game modes, skins, leaderboards, and player profiles.",
  alternates: {
    canonical: "/map",
  },
};

export default async function Sitemap() {
  const t = await getTranslations("mapPage");
  const [pages, allStats] = await Promise.all([
    Promise.resolve(getStaticPages()),
    getAllStats(),
  ]);

  const indexablePlayers = filterIndexablePlayers(allStats);

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
            {pages.map((page) => (
              <a
                key={page.url}
                href={page.url}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors text-gray-300 hover:text-green-400"
              >
                {page.url}
              </a>
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
                href={`/players/${createPlayerSlug(player.userName, player.userId)}`}
                className="block px-4 py-3 hover:bg-gray-700 transition-colors"
              >
                <span className="text-white">{player.userName}</span>
                <span className="text-gray-400 ml-2">
                  {player.totalWin} {t("wins")}
                  {player.bestTime ? ` · ${t("best")} ${formatTime(player.bestTime)}` : ""}
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
