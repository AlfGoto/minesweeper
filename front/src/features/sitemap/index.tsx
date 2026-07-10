import Link from "next/link";
import { getStaticPages } from "@/app/sitemap";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers } from "@/lib/seo-config";
import { formatTime } from "@/lib/dates";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap - All Pages & Players",
  description:
    "Browse all pages on Minesweeper.fr - game modes, skins, leaderboards, and player profiles.",
  alternates: {
    canonical: "/map",
  },
};

export default async function Sitemap() {
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
            <li className="text-green-400">Sitemap</li>
          </ol>
        </nav>

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
            Sitemap
          </h1>
          <p className="text-xl text-gray-300">All pages on Minesweeper.fr</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            Quick Links
          </h2>
          <div className="flex flex-wrap gap-4 mb-8">
            <QuickLink href="/" label="Play Game" />
            <QuickLink href="/skins" label="Browse Skins" />
            <QuickLink href="/players" label="Leaderboard" />
            <QuickLink href="/stats" label="My Stats" />
            <QuickLink href="/how-to-play" label="How to Play" />
            <QuickLink href="/reddit" label="About" />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            Main Pages
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
              Players ({indexablePlayers.length})
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
                  {player.totalWin} wins
                  {player.bestTime ? ` · best ${formatTime(player.bestTime)}` : ""}
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
            Play Minesweeper
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
