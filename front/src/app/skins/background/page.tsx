import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getPublishedBackgroundSkins } from "@/features/skins/backgrounds/skins";

export function generateMetadata(): Metadata {
  const backgroundCount = getPublishedBackgroundSkins().length;

  return {
    title: "Minesweeper Background Skins - Free Cosmetic Themes",
    description: `Browse ${backgroundCount}+ public Minesweeper background skins with cosmetic themes ranging from clean classic looks to bold color palettes.`,
    keywords: [
      "minesweeper background skins",
      "minesweeper background themes",
      "minesweeper cosmetic backgrounds",
      "free minesweeper backgrounds",
      "minesweeper customization",
      "minesweeper visual themes",
    ],
    alternates: {
      canonical: "https://minesweeper.fr/skins/background",
    },
    openGraph: {
      title: "Minesweeper Background Skins",
      description: `Browse ${backgroundCount}+ public background skins and preview cosmetic themes for Minesweeper.`,
      url: "https://minesweeper.fr/skins/background",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Minesweeper Background Skins",
      description: `Browse ${backgroundCount}+ public background skins for Minesweeper.`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function BackgroundSkinsIndexPage() {
  const backgrounds = getPublishedBackgroundSkins();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Minesweeper Background Skins",
    description:
      "Public collection of Minesweeper background skins and cosmetic page themes.",
    numberOfItems: backgrounds.length,
    itemListElement: backgrounds.map((skin, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${skin.name} Minesweeper Background Skin`,
        description: skin.description,
        url: `https://minesweeper.fr/skins/background/${skin.slug}`,
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
        name: "Background Skins",
        item: "https://minesweeper.fr/skins/background",
      },
    ],
  };

  return (
    <>
      <Script
        id="background-itemlist-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Script
        id="background-breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen px-4 py-12">
        <article className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:underline">
                  Minesweeper
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-slate-900">Background Skins</li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Minesweeper Background Skins
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-700">
              Background skins change the visual backdrop around the game while
              leaving Minesweeper gameplay untouched. Browse the published
              themes below and open each page for a full live preview.
            </p>
          </header>

          <section
            aria-label="Published background skins"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {backgrounds.map((skin) => (
              <Link
                key={skin.id}
                href={`/skins/background/${skin.slug}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`${skin.value} h-40 border-b border-slate-200`}
                  style={skin.style}
                />
                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:underline">
                      {skin.name}
                    </h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      Cosmetic
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {skin.description}
                  </p>
                </div>
              </Link>
            ))}
          </section>
        </article>
      </main>
    </>
  );
}
