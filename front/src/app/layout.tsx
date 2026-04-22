import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/session-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { getUser } from "@/types/bff/uncached-functions";
import { backgroundSkins, NonPublishedBackgroundSkins } from "@/features/skins/backgrounds/skins";

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
    "Play the classic Minesweeper game with modern graphics and unique skins, compete on the leaderboard, and track your progress with detailed statistics.",
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
    "minesweeper skins",
    "minesweeper themes",
    "custom minesweeper",
    "minesweeper design",
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
    "skins démineur",
    "thèmes démineur",
    "design démineur",
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
    "skins buscaminas",
    "temas buscaminas",
    "diseño buscaminas",
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
      "Play the classic Minesweeper game with modern graphics and unique skins, compete on the leaderboard, and track your progress.",
    siteName: "Minesweeper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper Game | Test Your Skills",
    description:
      "Play the classic Minesweeper game with modern graphics and unique skins, compete on the leaderboard, and track your progress.",
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
    languages: {
      "en": "/",
      "x-default": "/",
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const user = userEmail ? await getUser(userEmail) : null;
  const background = user?.selectedSkin?.background ?? "default";
  const backgroundSkinsUnion = { ...backgroundSkins, ...NonPublishedBackgroundSkins };
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZSCMNHTS4B"
        />
        <Script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZSCMNHTS4B');
            `,
          }}
        />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoGame",
              name: "Minesweeper",
              alternateName: [
                "Démineur",
                "Buscaminas",
                "Mijnenveger",
                "Campo Minato",
              ],
              url: "https://minesweeper.fr",
              applicationCategory: "GameApplication",
              genre: ["Puzzle", "Strategy", "Logic"],
              gamePlatform: ["Web Browser", "Desktop", "Mobile"],
              description:
                "Play the classic Minesweeper game with modern graphics and unique skins, compete on the leaderboard, and track your progress.",
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
              screenshot: "https://minesweeper.fr/opengraph-image",
              featureList: [
                "Multiple difficulty levels",
                "Global leaderboard",
                "Personal statistics",
                "Unique skins and themes",
                "Real-time gameplay",
                "No download required",
              ],
              author: {
                "@type": "Person",
                name: "AlfGoto",
                url: "https://minesweeper.fr",
                sameAs: [
                  "https://twitter.com/alfgoto",
                  "https://youtube.com/@alfgoto",
                  "https://instagram.com/alfgoto",
                  "https://www.linkedin.com/in/alfred-gauthier/",
                  "https://facebook.com/alfgoto",
                ],
              },
            }),
          }}
        />
        <Script
          id="organization-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Minesweeper.fr",
              url: "https://minesweeper.fr",
              logo: "https://minesweeper.fr/icon.svg",
              founder: {
                "@type": "Person",
                name: "AlfGoto",
              },
              sameAs: [
                "https://twitter.com/alfgoto",
                "https://youtube.com/@alfgoto",
                "https://instagram.com/alfgoto",
                "https://www.linkedin.com/in/alfred-gauthier/",
                "https://facebook.com/alfgoto",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} ${backgroundSkinsUnion[background].value}`}
        style={backgroundSkinsUnion[background].style}
      >
        <NextTopLoader color="#4ade80" />
        <SessionProvider>
          {children}
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
