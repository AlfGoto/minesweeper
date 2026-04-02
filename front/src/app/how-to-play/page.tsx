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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 px-4 py-12">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-green-700">
              <li>
                <Link href="/" className="hover:underline">
                  Minesweeper
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-green-900">How to Play</li>
            </ol>
          </nav>

          <header className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-bold text-green-900 md:text-5xl">
              How to Play Minesweeper
            </h1>
            <p className="text-lg text-green-700">
              Master the classic puzzle game with our complete guide
            </p>
          </header>

          <section aria-label="Game objective" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              Objective
            </h2>
            <p className="leading-relaxed text-green-800">
              The goal of Minesweeper is to clear a rectangular board containing
              hidden mines without detonating any of them. You win by revealing
              all cells that don&apos;t contain mines.
            </p>
          </section>

          <section aria-label="Basic rules" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              Basic Rules
            </h2>
            <div className="space-y-4 text-green-800">
              <div className="rounded-lg bg-white/50 p-4">
                <h3 className="mb-2 font-medium text-green-900">
                  1. Click to Reveal
                </h3>
                <p>
                  Click on any cell to reveal what&apos;s underneath. Your first
                  click is always safe.
                </p>
              </div>
              <div className="rounded-lg bg-white/50 p-4">
                <h3 className="mb-2 font-medium text-green-900">
                  2. Numbers Show Adjacent Mines
                </h3>
                <p>
                  When you reveal a cell, a number appears showing how many
                  mines are in the 8 surrounding cells. A blank cell means no
                  adjacent mines.
                </p>
              </div>
              <div className="rounded-lg bg-white/50 p-4">
                <h3 className="mb-2 font-medium text-green-900">
                  3. Flag Suspected Mines
                </h3>
                <p>
                  Right-click (desktop) or long-press (mobile) to place a flag
                  on cells you think contain mines.
                </p>
              </div>
              <div className="rounded-lg bg-white/50 p-4">
                <h3 className="mb-2 font-medium text-green-900">
                  4. Avoid the Mines
                </h3>
                <p>
                  If you click on a mine, the game is over. Use the numbers to
                  deduce which cells are safe.
                </p>
              </div>
            </div>
          </section>

          <section aria-label="Number meanings" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              What the Numbers Mean
            </h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className="flex aspect-square items-center justify-center rounded-lg bg-white/70 text-2xl font-bold"
                  style={{
                    color:
                      num === 1
                        ? "#2563eb"
                        : num === 2
                          ? "#16a34a"
                          : num === 3
                            ? "#dc2626"
                            : num === 4
                              ? "#7c3aed"
                              : num === 5
                                ? "#ca8a04"
                                : num === 6
                                  ? "#db2777"
                                  : num === 7
                                    ? "#ea580c"
                                    : "#4b5563",
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
            <p className="mt-4 text-green-800">
              Each number indicates the count of mines in the 8 adjacent cells
              (including diagonals).
            </p>
          </section>

          <section aria-label="Strategy tips" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              Strategy Tips
            </h2>
            <ul className="list-inside list-disc space-y-3 text-green-800">
              <li>
                <strong>Start in the center:</strong> Clicking near the middle
                often reveals more cells at once.
              </li>
              <li>
                <strong>Look for obvious patterns:</strong> A &quot;1&quot; next
                to a single hidden cell means that cell is definitely a mine.
              </li>
              <li>
                <strong>Use the corners:</strong> Numbers in corners have fewer
                adjacent cells, making deduction easier.
              </li>
              <li>
                <strong>Count remaining mines:</strong> If a number already has
                enough flagged mines around it, the remaining cells are safe.
              </li>
              <li>
                <strong>Double-check before clicking:</strong> Take your time on
                50/50 situations or when unsure.
              </li>
            </ul>
          </section>

          <section aria-label="FAQ" className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold text-green-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  What is the goal of Minesweeper?
                </h3>
                <p className="text-green-700">
                  The goal is to clear the entire board without clicking on any
                  mines. You must use the numbers revealed on cells to deduce
                  which cells contain mines and flag them accordingly.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  What do the numbers mean in Minesweeper?
                </h3>
                <p className="text-green-700">
                  Each number indicates how many mines are adjacent to that cell
                  (including diagonals). A cell can have 0-8 adjacent mines. Use
                  these numbers to logically determine where mines are located.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  How do I flag a mine in Minesweeper?
                </h3>
                <p className="text-green-700">
                  Right-click (on desktop) or long-press (on mobile) on a cell
                  to place a flag. Flags mark cells you believe contain mines.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  What happens if I click on a mine?
                </h3>
                <p className="text-green-700">
                  If you click on a cell containing a mine, the game ends and
                  you lose. All mines on the board are revealed.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  What is the best strategy for Minesweeper?
                </h3>
                <p className="text-green-700">
                  Start by clicking near the center of the board. When you see a
                  1 next to a single unrevealed cell, that cell is a mine. Look
                  for patterns where the math clearly indicates mine locations.
                </p>
              </div>
            </div>
          </section>

          <section aria-label="Call to action" className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
            >
              Play Minesweeper Now
            </Link>
            <p className="mt-4 text-sm text-green-600">
              Put your skills to the test in our free online Minesweeper game
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
