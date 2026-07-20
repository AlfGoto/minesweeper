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
    title: "Competitive Minesweeper - World Ranking & Skins",
    description:
      "Get your world ranking percentile. Track wins, speed, experience. Unlock 20+ skins by playing. 100% free.",
    ogAlt: "Competitive Minesweeper - Get Your World Ranking",
  },
  fr: {
    title: "Démineur Compétitif - Rang Mondial & Skins",
    description:
      "Obtiens ton rang mondial en pourcentage. Suis tes victoires, ta vitesse, ton expérience. Débloque 20+ skins en jouant. 100% gratuit.",
    ogAlt: "Démineur Compétitif - Obtiens ton Rang Mondial",
  },
  es: {
    title: "Buscaminas Competitivo - Ranking Mundial & Skins",
    description:
      "Obtén tu ranking mundial en porcentaje. Sigue tus victorias, velocidad, experiencia. Desbloquea 20+ skins jugando. 100% gratis.",
    ogAlt: "Buscaminas Competitivo - Obtén tu Ranking Mundial",
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
