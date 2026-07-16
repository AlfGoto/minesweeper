import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SessionProvider } from "@/components/providers/session-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { getUser } from "@/types/bff/uncached-functions";
import { backgroundSkins, NonPublishedBackgroundSkins } from "@/features/skins/backgrounds";

const inter = Inter({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const user = userEmail ? await getUser(userEmail) : null;
  const background = user?.selectedSkin?.background ?? "default";
  const backgroundSkinsUnion = { ...backgroundSkins, ...NonPublishedBackgroundSkins };

  return (
    <html lang={locale}>
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
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
