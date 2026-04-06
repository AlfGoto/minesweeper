import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import {
  getAllBackgroundSkinSlugs,
  getBackgroundSkinMetaBySlug,
  getPublishedBackgroundSkins,
} from "@/features/skins/backgrounds/skins";

type Props = {
  params: Promise<{ skinName: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllBackgroundSkinSlugs();
  return slugs.map((skinName) => ({ skinName }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skinName } = await params;
  const skin = getBackgroundSkinMetaBySlug(skinName);

  if (!skin) {
    return {
      title: "Background Skin Not Found",
    };
  }

  const title = `${skin.name} Background Skin for Minesweeper`;
  const description = skin.description;
  const url = `https://minesweeper.fr/skins/background/${skin.slug}`;

  return {
    title,
    description,
    keywords: [
      ...skin.keywords,
      "minesweeper background skin",
      "minesweeper background theme",
      "minesweeper customization",
      "free minesweeper skins",
      "minesweeper game",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: "Minesweeper",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

export default async function BackgroundSkinPage({ params }: Props) {
  const { skinName } = await params;
  const skin = getBackgroundSkinMetaBySlug(skinName);

  if (!skin) {
    notFound();
  }

  const publishedBackgroundCount = getPublishedBackgroundSkins().length;
  const pageUrl = `https://minesweeper.fr/skins/background/${skin.slug}`;
  const faqEntries = skin.faq;

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${skin.name} Minesweeper Background Skin`,
    description: skin.longDescription,
    image: "https://minesweeper.fr/opengraph-image",
    brand: {
      "@type": "Brand",
      name: "Minesweeper",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    category: "Game Customization",
    isRelatedTo: {
      "@type": "VideoGame",
      name: "Minesweeper",
      url: "https://minesweeper.fr",
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${skin.name} Background Skin for Minesweeper`,
    description: skin.description,
    url: pageUrl,
    keywords: skin.keywords.join(", "),
    about: {
      "@type": "VideoGame",
      name: "Minesweeper",
      url: "https://minesweeper.fr",
    },
    mainEntity: {
      "@type": "Product",
      name: `${skin.name} Minesweeper Background Skin`,
      description: skin.longDescription,
    },
  };

  const breadcrumbStructuredData = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: `${skin.name} Background`,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <Script
        id="background-product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <Script
        id="background-faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="background-webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />
      <Script
        id="background-breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className={`${skin.value} min-h-screen px-4 py-12`} style={skin.style}>
        <article className="mx-auto max-w-4xl rounded-[2rem] border border-white/60 bg-white/88 p-6 shadow-2xl backdrop-blur-sm md:p-10">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-600">
              <li>
                <Link href="/" className="hover:underline">
                  Minesweeper
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/skins/background" className="hover:underline">
                  Background Skins
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-slate-900">
                {skin.name} Background
              </li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Minesweeper Background Skin
            </p>
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              {skin.name} Background Skin
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-600">
              {skin.description}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
              This page uses the live {skin.name.toLowerCase()} background as
              the preview, so you can see the full-page effect directly.
            </p>
          </header>

          <section
            aria-label="Background skin summary"
            className="mb-10 grid gap-3 text-sm text-slate-700 md:grid-cols-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              Live full-page preview
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              {publishedBackgroundCount} published backgrounds
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              Purely cosmetic customization
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              Works with every cell skin
            </div>
          </section>

          <section aria-label="About this background skin" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              What Is the {skin.name} Background Skin?
            </h2>
            <p className="leading-relaxed text-slate-700">
              {skin.longDescription}
            </p>
            <p className="mt-4 leading-relaxed text-slate-700">
              If you want to compare it with other looks, you can browse the{" "}
              <Link
                href="/skins/background"
                className="font-medium text-slate-900 underline"
              >
                full background skins collection
              </Link>{" "}
              or jump straight into the{" "}
              <Link href="/" className="font-medium text-slate-900 underline">
                game
              </Link>{" "}
              to try the available cosmetic themes.
            </p>
          </section>

          <section aria-label="Frequently asked questions" className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqEntries.map((entry) => (
                <div key={entry.question}>
                  <h3 className="mb-2 font-medium text-slate-900">
                    {entry.question}
                  </h3>
                  <p className="text-slate-700">{entry.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Call to action" className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              Play Minesweeper Now
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              Try the {skin.name} background skin alongside cell skins and other
              visual customizations in the free online game.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
