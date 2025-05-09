import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#4ade80'
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://minesweeper-game.com'),
  title: {
    default: 'Minesweeper',
    template: '%s | Minesweeper Game'
  },
  description: 'Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress with detailed statistics.',
  keywords: [
    // English keywords
    'minesweeper', 'puzzle game', 'strategy game', 'online game', 'leaderboard', 'free game', 'logic game', 'classic game', 'mine clearing', 'brain game', 'mind game', 'skill game', 'classic minesweeper',
    // French keywords
    'démineur', 'jeu de démineur', 'démineur en ligne', 'démineur gratuit', 'jeu de réflexion', 'jeu de logique', 'jeu de stratégie', 'jeu classique', 'déminage', 'jeu de mines', 'tableau des scores', 'statistiques de jeu',
    // Spanish keywords
    'buscaminas', 'juego de buscaminas', 'buscaminas en línea', 'juego de estrategia', 'juego gratuito', 'juego de lógica', 'buscaminas clásico', 'desactivar minas', 'juego de habilidad', 'juego de puzzle', 'tabla de clasificación',
    // Dutch keywords
    'mijnenveger', 'mijnenveger spel', 'mijnenveger online', 'puzzelspel', 'strategiespel', 'gratis spel', 'klassiek spel', 'mijnen ontwijken', 'denkspel', 'logisch spel', 'scorebord', 'vaardigheidsspel'
  ],
  authors: [{ name: 'AlfGoto' }],
  creator: 'AlfGoto',
  publisher: 'AlfGoto',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Minesweeper',
    description: 'Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.',
    siteName: 'Minesweeper',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Minesweeper Game'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minesweeper Game | Test Your Skills',
    description: 'Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.',
    images: ['/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  },
  alternates: {
    canonical: '/'
  }
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
        <link rel="alternate icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />

        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              'name': 'Minesweeper',
              'applicationCategory': 'GameApplication',
              'genre': 'Puzzle',
              'description': 'Play the classic Minesweeper game with modern graphics, compete on the leaderboard, and track your progress.',
              'operatingSystem': 'Any',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD'
              },
              'screenshot': '/og-image.png',
              'featureList': 'Leaderboard, Player Statistics, Real-time Gameplay',
              'author': {
                '@type': 'Organization',
                'name': 'AlfGoto'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 