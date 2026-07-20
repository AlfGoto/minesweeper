import { use } from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HomeComponent from "@/features/homepage";
import { generateAlternates, BASE_URL } from "@/lib/seo-config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const seoByLocale: Record<string, { title: string; description: string; ogAlt: string }> = {
  en: {
    title: "Minesweeper with Rankings & 20+ Skins | Track Your Stats",
    description:
      "Play Minesweeper free. Unlock 20+ skins by playing. Compete on multi-leaderboards (speed, wins, experience). Track 15+ stats. See your world ranking.",
    ogAlt: "Minesweeper - Play. Earn Skins. Climb the Rankings.",
  },
  fr: {
    title: "Démineur avec Classements & 20+ Skins | Suivez vos Stats",
    description:
      "Jouez au Démineur gratuitement. Débloquez 20+ skins en jouant. Classements multi-dimensions (vitesse, victoires, expérience). 15+ stats. Rang mondial.",
    ogAlt: "Démineur - Jouez. Gagnez des Skins. Grimpez les Classements.",
  },
  es: {
    title: "Buscaminas con Rankings & 20+ Skins | Sigue tus Stats",
    description:
      "Juega Buscaminas gratis. Desbloquea 20+ skins jugando. Compite en rankings multi-dimensión (velocidad, victorias, experiencia). 15+ estadísticas.",
    ogAlt: "Buscaminas - Juega. Gana Skins. Sube en los Rankings.",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateAlternates("", locale);
  const seo = seoByLocale[locale] || seoByLocale.en;

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
      images: [
        {
          url: "https://minesweeper.fr/opengraph-image",
          width: 1200,
          height: 630,
          alt: seo.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    alternates,
  };
}

export default function Home({ params }: PageProps) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <HomeComponent />;
}
