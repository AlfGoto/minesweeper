import type { Metadata } from "next";
import Script from "next/script";
import { SkinsPage } from "@/features/skins";
import { getPublishedSkinsWithMeta } from "@/features/skins/cell-skins";

export const metadata: Metadata = {
  title: "Minesweeper Skins Shop - Free Themes & Customizations",
  description:
    "Browse and unlock 20+ unique Minesweeper skins and themes. Customize your game with Classic, Ocean, Forest, Neon, and many more free designs. Earn coins by playing to unlock new styles.",
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
  ],
  alternates: {
    canonical: "https://minesweeper.fr/skins",
  },
  openGraph: {
    title: "Minesweeper Skins Shop - Free Themes & Customizations",
    description:
      "Browse and unlock 20+ unique Minesweeper skins. Classic, Ocean, Forest, Neon, and more free designs.",
    url: "https://minesweeper.fr/skins",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minesweeper Skins Shop",
    description:
      "Browse and unlock 20+ unique Minesweeper skins and themes. Customize your game for free!",
  },
};

export default function SkinsPageWrapper() {
  const skins = getPublishedSkinsWithMeta();

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
        "@type": "Product",
        name: `${skin.name} Minesweeper Skin`,
        description: skin.description,
        url: `https://minesweeper.fr/skins/${skin.slug}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
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
      <SkinsPage />
    </>
  );
}
