import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    template: "%s | Minesweeper - Free with Rankings & Skins",
  },
  description:
    "Play Minesweeper free online. Unlock 20+ skins by playing. Compete on multi-leaderboards, track 15+ stats, see your world ranking percentile.",
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
    title: "Minesweeper - Play. Earn Skins. Climb the Rankings.",
    description:
      "Play Minesweeper free online. Unlock 20+ skins by playing. Compete on multi-leaderboards, track 15+ stats, see your world ranking.",
    siteName: "Minesweeper",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper - Play. Earn Skins. Climb the Rankings.",
    description:
      "Play Minesweeper free online. Unlock 20+ skins by playing. Multi-leaderboards, 15+ stats, world ranking percentile.",
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
