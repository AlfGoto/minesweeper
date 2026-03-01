import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4ade80",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://minesweeper.fr"),
  title: {
    default: "Minesweeper",
    template: "%s | Minesweeper Game",
  },
  description:
    "Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress with detailed statistics.",
  keywords: [
    // English keywords
    "minesweeper",
    "puzzle game",
    "strategy game",
    "online game",
    "leaderboard",
    "free game",
    "logic game",
    "classic game",
    "mine clearing",
    "brain game",
    "mind game",
    "skill game",
    "classic minesweeper",
    // French keywords
    "démineur",
    "jeu de démineur",
    "démineur en ligne",
    "démineur gratuit",
    "jeu de réflexion",
    "jeu de logique",
    "jeu de stratégie",
    "jeu classique",
    "déminage",
    "jeu de mines",
    "tableau des scores",
    "statistiques de jeu",
    // Spanish keywords
    "buscaminas",
    "juego de buscaminas",
    "buscaminas en línea",
    "juego de estrategia",
    "juego gratuito",
    "juego de lógica",
    "buscaminas clásico",
    "desactivar minas",
    "juego de habilidad",
    "juego de puzzle",
    "tabla de clasificación",
    // Dutch keywords
    "mijnenveger",
    "mijnenveger spel",
    "mijnenveger online",
    "puzzelspel",
    "strategiespel",
    "gratis spel",
    "klassiek spel",
    "mijnen ontwijken",
    "denkspel",
    "logisch spel",
    "scorebord",
    "vaardigheidsspel",
    // German keywords
    "minesweeper spiel",
    "minesweeper online",
    "minenräumer",
    "minensucher",
    "denkspiel",
    "kostenloses spiel",
    "klassisches spiel",
    "bestenliste",
    // Italian keywords
    "campo minato",
    "gioco campo minato",
    "prato fiorito",
    "gioco di logica",
    "gioco gratuito",
    "classifica",
    // Portuguese keywords
    "campo minado",
    "jogo campo minado",
    "caça-minas",
    "jogo de lógica",
    "jogo grátis",
  ],
  authors: [{ name: "AlfGoto" }],
  creator: "AlfGoto",
  publisher: "AlfGoto",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Minesweeper",
    description:
      "Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.",
    siteName: "Minesweeper",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Minesweeper Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper Game | Test Your Skills",
    description:
      "Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              name: "Minesweeper",
              alternateName: ["Démineur", "Buscaminas", "Mijnenveger", "Campo Minato"],
              url: "https://minesweeper.fr",
              applicationCategory: "GameApplication",
              genre: ["Puzzle", "Strategy", "Logic"],
              gamePlatform: ["Web Browser", "Desktop", "Mobile"],
              description:
                "Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.",
              inLanguage: ["en", "fr", "es", "nl", "de", "it", "pt"],
              operatingSystem: "Any",
              playMode: "SinglePlayer",
              numberOfPlayers: {
                "@type": "QuantitativeValue",
                value: 1,
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1000",
                bestRating: "5",
                worstRating: "1",
              },
              screenshot: "https://minesweeper.fr/og-image.png",
              featureList: [
                "Multiple difficulty levels",
                "Global leaderboard",
                "Personal statistics",
                "Real-time gameplay",
                "No download required",
              ],
              author: {
                "@type": "Person",
                name: "AlfGoto",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
