import type { Metadata } from "next";
import Script from "next/script";
import { SkinsPage } from "@/features/skins";
import { getPublishedSkinsWithMeta } from "@/features/skins/cells/skins";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "skinsPage" });
  const skinCount = getPublishedSkinsWithMeta(locale).length;
  const alternates = generateAlternates("/skins", locale);

  return {
    title: `Minesweeper ${t("cells")} - ${skinCount}+`,
    description: `${skinCount}+ ${t("cells").toLowerCase()}`,
    keywords: [
      "minesweeper skins",
      "minesweeper themes",
      "minesweeper customization",
      "free minesweeper skins",
      "minesweeper designs",
      "custom minesweeper",
      "minesweeper shop",
      "game skins",
      "minesweeper styles",
      "emoji minesweeper skin",
    ],
    alternates,
    openGraph: {
      title: `Minesweeper ${t("cells")}`,
      description: `${skinCount}+ ${t("cells").toLowerCase()}`,
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
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
      title: `Minesweeper ${t("cells")}`,
      description: `${skinCount}+ ${t("cells").toLowerCase()}`,
    },
  };
}

export default function SkinsPageWrapper({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const skins = getPublishedSkinsWithMeta(locale);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Minesweeper Skins Collection",
    description:
      "Complete collection of free Minesweeper skins and themes available in the game.",
    numberOfItems: skins.length,
    itemListElement: skins.map((skin, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: `${skin.name} Minesweeper Skin`,
        description: skin.description,
        url: `https://minesweeper.fr/skins/${skin.slug}`,
        applicationCategory: "GameApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    })),
  };

  const breadcrumbSchema = {
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
        name: "Skins Shop",
        item: "https://minesweeper.fr/skins",
      },
    ],
  };

  return (
    <>
      <Script
        id="itemlist-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SkinsPage locale={locale} />
    </>
  );
}
