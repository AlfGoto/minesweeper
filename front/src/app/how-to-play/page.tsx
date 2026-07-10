import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Play Minesweeper - Rules & Strategy Guide",
  description:
    "Learn how to play Minesweeper with our complete guide. Understand the rules, master strategies, and discover tips to improve your game. Perfect for beginners and experienced players.",
  keywords: [
    "how to play minesweeper",
    "minesweeper rules",
    "minesweeper tutorial",
    "minesweeper guide",
    "minesweeper strategy",
    "minesweeper tips",
    "minesweeper for beginners",
    "learn minesweeper",
    "minesweeper help",
    "comment jouer au demineur",
    "regles demineur",
    "como jugar buscaminas",
  ],
  alternates: {
    canonical: "https://minesweeper.fr/how-to-play",
  },
  openGraph: {
    title: "How to Play Minesweeper - Rules & Strategy Guide",
    description:
      "Learn how to play Minesweeper with our complete guide. Rules, strategies, and tips for all skill levels.",
    url: "https://minesweeper.fr/how-to-play",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Play Minesweeper",
    description:
      "Complete guide to Minesweeper rules and strategies. Perfect for beginners!",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the goal of Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The goal of Minesweeper is to clear the entire board without clicking on any mines. You must use the numbers revealed on cells to deduce which cells contain mines and flag them accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "What do the numbers mean in Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each number on a revealed cell indicates how many mines are adjacent to that cell (including diagonals). A cell can have 0-8 adjacent mines. Use these numbers to logically determine where mines are located.",
      },
    },
    {
      "@type": "Question",
      name: "How do I flag a mine in Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Right-click (on desktop) or long-press (on mobile) on a cell to place a flag. Flags mark cells you believe contain mines. You can remove a flag by right-clicking or long-pressing again.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I click on a mine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you click on a cell containing a mine, the game ends and you lose. All mines on the board are revealed. To win, you must reveal all non-mine cells without clicking on any mines.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best strategy for Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start by clicking near the center of the board. When you see a 1 next to a single unrevealed cell, that cell is a mine. Look for patterns where the math clearly indicates mine locations. If stuck, look for cells that are definitely safe based on the numbers around them.",
      },
    },
  ],
};

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Play Minesweeper",
  description:
    "Learn the rules and strategies to master Minesweeper, the classic puzzle game.",
  totalTime: "PT5M",
  step: [
    {
      "@type": "HowToStep",
      name: "Start the game",
      text: "Click any cell to start. The first click is always safe and will never reveal a mine.",
    },
    {
      "@type": "HowToStep",
      name: "Read the numbers",
      text: "Each number tells you how many mines are in the 8 cells surrounding it (horizontally, vertically, and diagonally).",
    },
    {
      "@type": "HowToStep",
      name: "Flag suspected mines",
      text: "Right-click (desktop) or long-press (mobile) to place a flag on cells you think contain mines.",
    },
    {
      "@type": "HowToStep",
      name: "Use logic to deduce",
      text: "Combine information from multiple numbers to determine which cells are safe and which contain mines.",
    },
    {
      "@type": "HowToStep",
      name: "Clear the board",
      text: "Reveal all non-mine cells to win. Be careful - clicking a mine ends the game!",
    },
  ],
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Minesweeper",
      item: "https://minesweeper.fr",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "How to Play",
      item: "https://minesweeper.fr/how-to-play",
    },
  ],
};

export default function HowToPlayPage() {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="howto-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToStructuredData),
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

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
              <li className="text-green-400">How to Play</li>
            </ol>
          </nav>

          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
              How to Play Minesweeper
            </h1>
            <p className="text-xl text-gray-300">
              Master the classic puzzle game with our complete guide
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">
              Objective
            </h2>
            <p className="text-gray-300">
              Clear a rectangular board containing hidden mines without
              detonating any. Win by revealing all cells that don&apos;t contain
              mines.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-green-300">
              Basic Rules
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <RuleCard
                number="1"
                title="Click to Reveal"
                description="Click any cell to reveal what's underneath. Your first click is always safe."
              />
              <RuleCard
                number="2"
                title="Numbers Show Adjacent Mines"
                description="A number shows how many mines are in the 8 surrounding cells. Blank means no adjacent mines."
              />
              <RuleCard
                number="3"
                title="Flag Suspected Mines"
                description="Right-click (desktop) or long-press (mobile) to flag cells you think contain mines."
              />
              <RuleCard
                number="4"
                title="Avoid the Mines"
                description="Click a mine and game over. Use numbers to deduce which cells are safe."
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">
              What the Numbers Mean
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className="flex aspect-square items-center justify-center rounded-lg bg-gray-700 text-2xl font-bold"
                  style={{
                    color:
                      num === 1
                        ? "#3b82f6"
                        : num === 2
                          ? "#22c55e"
                          : num === 3
                            ? "#ef4444"
                            : num === 4
                              ? "#8b5cf6"
                              : num === 5
                                ? "#eab308"
                                : num === 6
                                  ? "#ec4899"
                                  : num === 7
                                    ? "#f97316"
                                    : "#6b7280",
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="text-gray-400">
              Each number indicates how many mines are in the 8 adjacent cells
              (including diagonals).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-green-300">
              Strategy Tips
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Start in the center</strong> - Often reveals more
                  cells at once
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Look for obvious patterns</strong> - A &quot;1&quot;
                  next to a single hidden cell = mine
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use the corners</strong> - Fewer adjacent cells makes
                  deduction easier
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Count remaining mines</strong> - If a number has
                  enough flagged mines, remaining cells are safe
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Take your time</strong> - No rush on 50/50 situations
                </span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-green-300">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <FAQItem
                question="What is the goal of Minesweeper?"
                answer="Clear the entire board without clicking on any mines. Use numbers to deduce which cells contain mines and flag them."
              />
              <FAQItem
                question="What do the numbers mean?"
                answer="Each number indicates how many mines are adjacent to that cell (including diagonals). A cell can have 0-8 adjacent mines."
              />
              <FAQItem
                question="How do I flag a mine?"
                answer="Right-click (desktop) or long-press (mobile) to place a flag. Click again to remove it."
              />
              <FAQItem
                question="What happens if I click on a mine?"
                answer="Game over. All mines are revealed. To win, reveal all non-mine cells without clicking any mines."
              />
              <FAQItem
                question="What is the best strategy?"
                answer="Start near the center. When you see a 1 next to a single unrevealed cell, that's a mine. Look for patterns where math clearly indicates mine locations."
              />
            </div>
          </section>

          <section className="text-center mb-8">
            <Link
              href="/"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Play Minesweeper Now
            </Link>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-green-300">
              Quick Links
            </h2>
            <div className="flex flex-wrap gap-4">
              <QuickLink href="/" label="Play Game" />
              <QuickLink href="/skins" label="Browse Skins" />
              <QuickLink href="/players" label="Leaderboard" />
              <QuickLink href="/stats" label="My Stats" />
              <QuickLink href="/map" label="Sitemap" />
              <QuickLink href="/reddit" label="About" />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function RuleCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold mb-2 text-white">
        {number}. {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="font-medium text-white mb-2">{question}</h3>
      <p className="text-gray-400">{answer}</p>
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
