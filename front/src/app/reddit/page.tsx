import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Minesweeper.fr - Free Online Minesweeper with Skins & Leaderboards",
  description:
    "Play free online Minesweeper with 20+ custom skins, global leaderboards, player statistics, and speedrun tracking. No download required. The best modern Minesweeper experience.",
  keywords: [
    "minesweeper reddit",
    "best minesweeper online",
    "free minesweeper game",
    "minesweeper with skins",
    "minesweeper leaderboard",
    "minesweeper speedrun",
    "online minesweeper",
    "custom minesweeper skins",
    "minesweeper stats tracker",
    "minesweeper community",
  ],
  openGraph: {
    title: "Minesweeper.fr - Free Online Minesweeper with Skins & Leaderboards",
    description:
      "Play free online Minesweeper with 20+ custom skins, global leaderboards, player statistics, and speedrun tracking. No download required.",
    url: "https://minesweeper.fr/reddit",
  },
  alternates: {
    canonical: "/reddit",
  },
};

export default function RedditPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-green-400">
          Minesweeper.fr
        </h1>
        <p className="text-xl text-center text-gray-300 mb-12">
          The modern Minesweeper experience with skins, stats & leaderboards
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            What is Minesweeper.fr?
          </h2>
          <p className="text-gray-300 mb-4">
            Minesweeper.fr is a free, browser-based Minesweeper game built for
            the modern web. No downloads, no ads interrupting gameplay, just
            pure classic Minesweeper with features the community has been asking
            for.
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Play Now
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-green-300">
            Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title="20+ Custom Skins"
              description="Customize your game with unique cell skins and backgrounds. From classic Windows style to modern themes, pixel art, and more."
              href="/skins"
              linkText="Browse Skins"
            />

            <FeatureCard
              title="Global Leaderboards"
              description="Compete with players worldwide. Track best times across Easy, Medium, and Hard difficulties. See who's the fastest."
              href="/players"
              linkText="View Leaderboard"
            />

            <FeatureCard
              title="Personal Statistics"
              description="Track your progress with detailed stats: games played, win rate, best times, average time, and historical performance."
              href="/stats"
              linkText="View Stats"
            />

            <FeatureCard
              title="Player Profiles"
              description="Every player gets a public profile page showing their achievements, rankings, and game history."
              href="/players"
              linkText="Find Players"
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            Why Minesweeper.fr?
          </h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Free forever</strong> - No premium tiers, no paywalls
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>No download required</strong> - Play instantly in your
                browser
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Mobile friendly</strong> - Works on desktop, tablet, and
                phone
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Active development</strong> - New skins and features
                added regularly
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-400 mr-2">✓</span>
              <span>
                <strong>Privacy focused</strong> - Minimal data collection, no
                tracking ads
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-green-300">
            Quick Links
          </h2>
          <div className="flex flex-wrap gap-4">
            <QuickLink href="/" label="Play Minesweeper" />
            <QuickLink href="/skins" label="Browse Skins" />
            <QuickLink href="/players" label="Leaderboard" />
            <QuickLink href="/stats" label="My Stats" />
            <QuickLink href="/how-to-play" label="How to Play" />
          </div>
        </section>

        <section className="text-center text-gray-400 text-sm">
          <p>
            Made by{" "}
            <a
              href="https://twitter.com/alfgoto"
              className="text-green-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @alfgoto
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link
        href={href}
        className="text-green-400 hover:text-green-300 font-medium"
      >
        {linkText} →
      </Link>
    </div>
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
