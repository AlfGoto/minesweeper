import { Metadata } from "next";
import Script from "next/script";
import HomeComponent from "@/features/homepage";

export const metadata: Metadata = {
  title: "Play Minesweeper Online - Free Classic Puzzle Game",
  description:
    "Play the classic Minesweeper puzzle game for free! Clear the minefield without hitting a bomb. Features multiple difficulty levels, unique skins, leaderboards, and statistics tracking.",
  openGraph: {
    title: "Play Minesweeper Online - Free Classic Puzzle Game",
    description:
      "Play the classic Minesweeper puzzle game for free! Clear the minefield, unlock unique skins, compete on leaderboards, and track your stats.",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I play Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Click on cells to reveal them. Numbers indicate how many mines are adjacent to that cell. Use this information to deduce which cells contain mines and flag them. Clear all non-mine cells to win. Right-click or long-press to place a flag on suspected mines.",
      },
    },
    {
      "@type": "Question",
      name: "Is Minesweeper free to play?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Minesweeper is completely free to play online. No download or installation required. You can play directly in your web browser on desktop or mobile devices.",
      },
    },
    {
      "@type": "Question",
      name: "What are Minesweeper skins?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Skins are visual themes that change the appearance of the Minesweeper grid. You can unlock and purchase different skins using coins earned by playing games. Skins include themes like Classic, Ocean, Forest, Neon, and many more unique designs.",
      },
    },
    {
      "@type": "Question",
      name: "How do I earn coins in Minesweeper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You earn coins by completing Minesweeper games. Faster completion times and higher difficulty levels reward more coins. Use your coins in the skins shop to unlock new visual themes for your game.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track my Minesweeper statistics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, create an account to track your game statistics including win rate, best times, total games played, and your position on the global leaderboard. Compare your performance with players worldwide.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <HomeComponent />
    </>
  );
}