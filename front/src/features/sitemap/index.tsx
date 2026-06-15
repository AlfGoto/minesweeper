import Link from "next/link";
import { getStaticPages } from "@/app/sitemap";
import { getAllStats } from "@/lib/api";
import { filterIndexablePlayers } from "@/lib/seo-config";

export default async function Sitemap() {
  const [pages, allStats] = await Promise.all([
    Promise.resolve(getStaticPages()),
    getAllStats(),
  ]);

  const indexablePlayers = filterIndexablePlayers(allStats);

  return (
    <main className="min-h-screen py-4 px-12">
      <Link
        href="/how-to-play"
        className="text-sm text-gray-700 italic underline hover:text-green-900"
      >
        Go back
      </Link>
      <h1 className="text-2xl font-bold text-green-900">Sitemap</h1>

      <h2 className="text-lg font-bold text-green-900 mt-4">Main Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.url}>
            <a href={page.url}>{page.url}</a>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold text-green-900 mt-6">
        Players ({indexablePlayers.length})
      </h2>
      <ul>
        {indexablePlayers.map((player) => (
          <li key={player.userId}>
            <Link href={`/stats/${player.userId}`}>
              {player.userName} - {player.totalWin} wins
              {player.bestTime ? `, best ${player.bestTime}s` : ""}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
