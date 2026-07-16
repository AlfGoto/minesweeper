import type { Metadata } from "next";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howToPlayPage" });
  const alternates = generateAlternates("/how-to-play", locale);

  return {
    title: t("title"),
    description: t("subtitle"),
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
    alternates,
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "article",
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
      description: t("subtitle"),
    },
  };
}

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

export default function HowToPlayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <HowToPlayContent />;
}

async function HowToPlayContent() {
  const t = await getTranslations("howToPlayPage");

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
            {t("objective.title")}
          </h2>
          <p className="text-gray-600">{t("objective.description")}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            {t("rules.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <RuleCard
              number="1"
              title={t("rules.clickToReveal.title")}
              description={t("rules.clickToReveal.description")}
            />
            <RuleCard
              number="2"
              title={t("rules.numbersShow.title")}
              description={t("rules.numbersShow.description")}
            />
            <RuleCard
              number="3"
              title={t("rules.flagMines.title")}
              description={t("rules.flagMines.description")}
            />
            <RuleCard
              number="4"
              title={t("rules.avoidMines.title")}
              description={t("rules.avoidMines.description")}
            />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {t("numbers.title")}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div
                key={num}
                className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 border text-2xl font-bold"
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
          <p className="text-gray-500">{t("numbers.description")}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {t("strategy.title")}
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong className="text-gray-900">{t("strategy.startCenter")}</strong> -{" "}
                {t("strategy.startCenterDesc")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong className="text-gray-900">{t("strategy.patterns")}</strong> -{" "}
                {t("strategy.patternsDesc")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong className="text-gray-900">{t("strategy.corners")}</strong> -{" "}
                {t("strategy.cornersDesc")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong className="text-gray-900">{t("strategy.countMines")}</strong> -{" "}
                {t("strategy.countMinesDesc")}
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>
                <strong className="text-gray-900">{t("strategy.takeTime")}</strong> -{" "}
                {t("strategy.takeTimeDesc")}
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            <FAQItem
              question={t("faq.goal.question")}
              answer={t("faq.goal.answer")}
            />
            <FAQItem
              question={t("faq.numbers.question")}
              answer={t("faq.numbers.answer")}
            />
            <FAQItem
              question={t("faq.flag.question")}
              answer={t("faq.flag.answer")}
            />
            <FAQItem
              question={t("faq.clickMine.question")}
              answer={t("faq.clickMine.answer")}
            />
            <FAQItem
              question={t("faq.bestStrategy.question")}
              answer={t("faq.bestStrategy.answer")}
            />
          </div>
        </section>

        <section className="text-center mb-8">
          <Link
            href="/"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {t("playNow")}
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {t("quickLinks.title")}
          </h2>
          <div className="flex flex-wrap gap-3">
            <QuickLink href="/" label={t("quickLinks.playGame")} />
            <QuickLink href="/skins" label={t("quickLinks.browseSkins")} />
            <QuickLink href="/players" label={t("quickLinks.leaderboard")} />
            <QuickLink href="/stats" label={t("quickLinks.myStats")} />
            <QuickLink href="/map" label={t("quickLinks.sitemap")} />
            <QuickLink href="/reddit" label={t("quickLinks.about")} />
          </div>
        </section>
      </div>
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
    <div className="bg-gray-50 rounded-lg p-4 border">
      <h3 className="text-lg font-semibold mb-2 text-gray-900">
        {number}. {title}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border">
      <h3 className="font-medium text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
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
