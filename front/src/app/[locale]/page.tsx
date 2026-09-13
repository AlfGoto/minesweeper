import { use } from "react";
import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HomeComponent from "@/features/homepage";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Title/description intentionally drop "skins" as a targeted keyword here: /skins
// is the canonical page for skin-related queries, and both pages ranking for the
// same terms was splitting Search Console's signal between them (cannibalization).
const seoByLocale: Record<string, { title: string; description: string; ogAlt: string }> = {
  en: {
    title: "Competitive Minesweeper - Ranked & World Ranking",
    description:
      "Get your world ranking percentile and climb ranked Minesweeper leaderboards. Track wins, speed, and experience. 100% free.",
    ogAlt: "Competitive Minesweeper - Get Your World Ranking",
  },
  fr: {
    title: "Démineur Compétitif - Classement & Rang Mondial",
    description:
      "Obtiens ton rang mondial en pourcentage et grimpe dans le classement compétitif. Suis tes victoires, ta vitesse, ton expérience. 100% gratuit.",
    ogAlt: "Démineur Compétitif - Obtiens ton Rang Mondial",
  },
  es: {
    title: "Buscaminas Competitivo - Ranking Clasificado & Mundial",
    description:
      "Obtén tu ranking mundial en porcentaje y sube en la clasificación competitiva. Sigue tus victorias, velocidad, experiencia. 100% gratis.",
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
      images: generateOgImages("", seo.ogAlt),
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
