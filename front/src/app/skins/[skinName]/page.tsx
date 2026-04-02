import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  getSkinMetaBySlug,
  getAllSkinSlugs,
} from "@/features/skins/cell-skins";
import { CellSkinLargeDemoGrid } from "@/features/shared/components/cell-skin-preview";

type Props = {
  params: Promise<{ skinName: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSkinSlugs();
  return slugs.map((skinName) => ({ skinName }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skinName } = await params;
  const skin = getSkinMetaBySlug(skinName);

  if (!skin) {
    return {
      title: "Skin Not Found",
    };
  }

  const title = `${skin.name} Skin for Minesweeper`;
  const description = skin.description;
  const url = `https://minesweeper.fr/skins/${skin.slug}`;

  return {
    title,
    description,
    keywords: [
      ...skin.keywords,
      "minesweeper skin",
      "minesweeper theme",
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
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${skin.name} Minesweeper Skin Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.png"],
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

export default async function SkinPage({ params }: Props) {
  const { skinName } = await params;
  const skin = getSkinMetaBySlug(skinName);

  if (!skin) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${skin.name} Minesweeper Skin`,
    description: skin.longDescription,
    image: "https://minesweeper.fr/og-image.png",
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
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${skin.name} skin in Minesweeper?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: skin.longDescription,
        },
      },
      {
        "@type": "Question",
        name: `How do I get the ${skin.name} Minesweeper skin?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can unlock the ${skin.name} skin by playing Minesweeper and earning coins. Visit the skins shop in the game to purchase and apply it to your game.`,
        },
      },
      {
        "@type": "Question",
        name: "Is Minesweeper free to play?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Minesweeper is completely free to play. You can enjoy the classic puzzle game with various skins and themes without any cost.",
        },
      },
    ],
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
        name: "Skins",
        item: "https://minesweeper.fr/skins",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: skin.name,
        item: `https://minesweeper.fr/skins/${skin.slug}`,
      },
    ],
  };

  return (
    <>
      <Script
        id="product-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 px-4 py-12">
        <article className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-green-700">
              <li>
                <Link href="/" className="hover:underline">
                  Minesweeper
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/skins" className="hover:underline">
                  Skins
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-green-900">{skin.name}</li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-green-900 md:text-5xl">
              {skin.name} Skin
            </h1>
            <p className="text-lg text-green-700">{skin.description}</p>
          </header>

          <section
            aria-label="Skin Preview"
            className="mb-10 flex justify-center"
          >
            <div className="overflow-hidden rounded-xl border-4 border-green-200 shadow-2xl">
              <CellSkinLargeDemoGrid skin={skin.id} />
            </div>
          </section>

          <section aria-label="About this skin" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-green-900">
              About the {skin.name} Skin
            </h2>
            <p className="leading-relaxed text-green-800">
              {skin.longDescription}
            </p>
          </section>

          <section aria-label="Frequently Asked Questions" className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold text-green-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  What is the {skin.name} skin in Minesweeper?
                </h3>
                <p className="text-green-700">{skin.longDescription}</p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  How do I get the {skin.name} Minesweeper skin?
                </h3>
                <p className="text-green-700">
                  You can unlock the {skin.name} skin by playing Minesweeper and
                  earning coins. Visit the skins shop in the game to purchase
                  and apply it to your game.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-green-900">
                  Is Minesweeper free to play?
                </h3>
                <p className="text-green-700">
                  Yes, Minesweeper is completely free to play. You can enjoy the
                  classic puzzle game with various skins and themes without any
                  cost.
                </p>
              </div>
            </div>
          </section>

          <section aria-label="Call to action" className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl"
            >
              Play Minesweeper Now
            </Link>
            <p className="mt-4 text-sm text-green-600">
              Try the {skin.name} skin and many more in our free online
              Minesweeper game
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
