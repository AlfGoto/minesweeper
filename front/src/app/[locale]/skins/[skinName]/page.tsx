import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import {
  getSkinMetaBySlug,
  getAllSkinSlugs,
  getPublishedSkinsWithMeta,
} from "@/features/skins/cells/skins";
import { CellSkinLargeDemoGrid } from "@/features/shared/components/cell-skin-preview";
import { getCellSkinSeo } from "@/features/skins/seo";
import { getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

type Props = {
  params: Promise<{ skinName: string; locale: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllSkinSlugs();
  return slugs.map((skinName) => ({ skinName }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { skinName, locale } = await params;
  const t = await getTranslations({ locale, namespace: "gridSkinPage" });
  const skin = getSkinMetaBySlug(skinName, locale);

  if (!skin) {
    return {
      title: t("notFound"),
    };
  }

  const seoContent = getCellSkinSeo(skin.id, locale);
  const fullTitle = t("skinTitle", { name: skin.name });
  const title = fullTitle.length > 60 ? `${skin.name} - Minesweeper Skin` : fullTitle;
  const description = seoContent?.metaDescription ?? skin.description;
  const alternates = generateAlternates(`/skins/${skin.slug}`, locale);
  const keywords = seoContent?.keywords ?? skin.keywords;

  return {
    title,
    description,
    keywords: [
      ...keywords,
      "minesweeper skin",
      "minesweeper theme",
      "minesweeper customization",
      "free minesweeper skins",
      "minesweeper game",
    ],
    alternates,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : locale === "fr" ? "fr_FR" : "es_ES",
      url: alternates.canonical,
      title,
      description,
      siteName: "Minesweeper",
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

export default async function SkinPage({ params }: Props) {
  const { skinName, locale } = await params;
  const t = await getTranslations("gridSkinPage");
  const skin = getSkinMetaBySlug(skinName, locale);

  if (!skin) {
    notFound();
  }

  const seoContent = getCellSkinSeo(skin.id, locale);
  const pageUrl = `https://minesweeper.fr/skins/${skin.slug}`;

  const nameHash = skin.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseFaqs = [
    {
      question: t("faqWhatIs", { name: skin.name }),
      answer: skin.longDescription,
    },
    {
      question: t("faqHowUnlock", { name: skin.name }),
      answer: t("faqHowUnlockAnswer", { name: skin.name }),
    },
    {
      question: t("faqChangeGameplay", { name: skin.name }),
      answer: t("faqChangeGameplayAnswer", { name: skin.name }),
    },
    {
      question: t("faqFreeToPlay"),
      answer: t("faqFreeToPlayAnswer"),
    },
    {
      question: t("faqPreview", { name: skin.name }),
      answer: t("faqPreviewAnswer", { name: skin.name }),
    },
  ];
  const faqCount = 2 + (nameHash % 3);
  const faqEntries = seoContent?.faqs ??
    (skin.faq.length > 0 ? skin.faq : baseFaqs.slice(0, faqCount));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${skin.name} Minesweeper Skin`,
    description: seoContent?.metaDescription ?? skin.longDescription,
    image: "https://minesweeper.fr/opengraph-image",
    applicationCategory: "GameApplication",
    applicationSubCategory: "Game Customization",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isPartOf: {
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
    name: t("skinTitle", { name: skin.name }),
    description: seoContent?.metaDescription ?? skin.description,
    url: pageUrl,
    keywords: (seoContent?.keywords ?? skin.keywords).join(", "),
    about: {
      "@type": "VideoGame",
      name: "Minesweeper",
      url: "https://minesweeper.fr",
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: `${skin.name} Minesweeper Skin`,
      applicationCategory: "GameApplication",
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
        name: t("breadcrumbSkins"),
        item: "https://minesweeper.fr/skins",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: skin.name,
        item: pageUrl,
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
        id="webpage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData),
        }}
      />
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className="max-w-3xl mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
        <article>
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-green-600">
                  Minesweeper
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/skins" className="hover:text-green-600">
                  {t("breadcrumbSkins")}
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-green-600">{skin.name}</li>
            </ol>
          </nav>

          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              {skin.name}
            </h1>
            {seoContent?.heroTagline ? (
              <p className="text-lg font-medium text-gray-700">
                {seoContent.heroTagline}
              </p>
            ) : (
              <p className="text-lg text-gray-600">{skin.description}</p>
            )}
          </header>

          <section
            aria-label="Skin Preview"
            className="mb-10 flex justify-center"
          >
            <div className="overflow-hidden rounded-xl border shadow-lg">
              <CellSkinLargeDemoGrid skin={skin.id} />
            </div>
          </section>

          {seoContent?.sections ? (
            seoContent.sections.map((section) => (
              <section
                key={section.title}
                aria-label={section.title}
                className="mb-10"
              >
                <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>
                <div className="space-y-4 leading-relaxed text-gray-600">
                  {section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section aria-label="About this skin" className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold text-gray-900">
                {t("aboutSkin", { name: skin.name })}
              </h2>
              <p className="leading-relaxed text-gray-600">
                {skin.longDescription}
              </p>
            </section>
          )}

          <section aria-label="Frequently Asked Questions" className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              {t("faq")}
            </h2>
            <div className="space-y-6">
              {faqEntries.map((entry) => (
                <div key={entry.question}>
                  <h3 className="mb-2 font-medium text-gray-900">
                    {entry.question}
                  </h3>
                  <p className="text-gray-600">{entry.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-label="Related skins" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              {t("moreSkins")}
            </h2>
            <nav className="flex flex-wrap gap-3">
              {getPublishedSkinsWithMeta(locale)
                .filter((s) => s.slug !== skin.slug)
                .slice(0, 6)
                .map((relatedSkin) => (
                  <Link
                    key={relatedSkin.slug}
                    href={`/skins/${relatedSkin.slug}`}
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-green-400 hover:bg-green-50"
                  >
                    {relatedSkin.name}
                  </Link>
                ))}
              <Link
                href="/skins"
                className="rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
              >
                {t("viewAll")}
              </Link>
            </nav>
          </section>

          <section aria-label="Call to action" className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl"
            >
              {t("playNow")}
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              {t("trySkin", { name: skin.name })}
            </p>
          </section>
        </article>
      </div>
    </>
  );
}
