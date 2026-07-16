import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  getAllBackgroundSkinSlugs,
  getBackgroundSkinMetaBySlug,
  getPublishedBackgroundSkins,
} from "@/features/skins/backgrounds";
import { getBackgroundSkinSeo } from "@/features/skins/seo";
import { getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

type Props = {
  params: Promise<{ locale: string; skinName: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllBackgroundSkinSlugs();
  return slugs.map((skinName) => ({ skinName }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, skinName } = await params;
  const t = await getTranslations({ locale, namespace: "backgroundSkinsPage" });
  const skin = getBackgroundSkinMetaBySlug(skinName, locale);

  if (!skin) {
    return {
      title: t("notFound"),
    };
  }

  const seoContent = getBackgroundSkinSeo(skin.id, locale);
  const fullTitle = t("skinTitle", { name: skin.name });
  const title = fullTitle.length > 60 ? `${skin.name} - Minesweeper Background` : fullTitle;
  const description = seoContent?.metaDescription ?? skin.description;
  const alternates = generateAlternates(`/skins/background/${skin.slug}`, locale);
  const keywords = seoContent?.keywords ?? skin.keywords;

  return {
    title,
    description,
    keywords: [
      ...keywords,
      "minesweeper background skin",
      "minesweeper background theme",
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

export default async function BackgroundSkinPage({ params }: Props) {
  const { locale, skinName } = await params;
  const t = await getTranslations("backgroundSkinsPage");
  const skin = getBackgroundSkinMetaBySlug(skinName, locale);

  if (!skin) {
    notFound();
  }

  const seoContent = getBackgroundSkinSeo(skin.id, locale);
  const publishedBackgroundCount = getPublishedBackgroundSkins(locale).length;
  const pageUrl = `https://minesweeper.fr/skins/background/${skin.slug}`;
  const faqEntries = seoContent?.faqs ?? skin.faq;

  const softwareStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${skin.name} Minesweeper Background Skin`,
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
      name: `${skin.name} Minesweeper Background Skin`,
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
        name: t("breadcrumb"),
        item: "https://minesweeper.fr/skins/background",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("skinBreadcrumb", { name: skin.name }),
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
          __html: JSON.stringify(softwareStructuredData),
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
                  {t("breadcrumb")}
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-slate-900">
                {t("skinBreadcrumb", { name: skin.name })}
              </li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {t("skinLabel")}
            </p>
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              {skin.name}
            </h1>
            {seoContent?.heroTagline ? (
              <p className="mx-auto max-w-3xl text-lg font-medium text-slate-700">
                {seoContent.heroTagline}
              </p>
            ) : (
              <p className="mx-auto max-w-3xl text-lg text-slate-600">
                {skin.description}
              </p>
            )}
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
              {t("livePreview", { name: skin.name.toLowerCase() })}
            </p>
          </header>

          <section
            aria-label="Background skin summary"
            className="mb-10 grid gap-3 text-sm text-slate-700 md:grid-cols-4"
          >
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              {t("liveFullPage")}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              {t("publishedCount", { count: publishedBackgroundCount })}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              {t("purelyCosmetic")}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/92 px-4 py-3">
              {t("worksWithAll")}
            </div>
          </section>

          {seoContent?.sections ? (
            seoContent.sections.map((section) => (
              <section
                key={section.title}
                aria-label={section.title}
                className="mb-10"
              >
                <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                  {section.title}
                </h2>
                <div className="space-y-4 leading-relaxed text-slate-700">
                  {section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <section aria-label="About this background skin" className="mb-10">
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                {t("whatIs", { name: skin.name })}
              </h2>
              <p className="leading-relaxed text-slate-700">
                {skin.longDescription}
              </p>
            </section>
          )}

          <section aria-label="Explore more" className="mb-10">
            <p className="leading-relaxed text-slate-700">
              {t("exploreMore")}{" "}
              <Link
                href="/skins/background"
                className="font-medium text-slate-900 underline"
              >
                {t("fullCollection")}
              </Link>{" "}
              {t("orJump")}{" "}
              <Link href="/" className="font-medium text-slate-900 underline">
                {t("game")}
              </Link>{" "}
              {t("toTry")}
            </p>
          </section>

          <section aria-label="Frequently asked questions" className="mb-10">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">
              {t("faq")}
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

          <section aria-label="Related background skins" className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-slate-900">
              {t("moreBackgrounds")}
            </h2>
            <nav className="flex flex-wrap gap-3">
              {getPublishedBackgroundSkins(locale)
                .filter((s) => s.slug !== skin.slug)
                .slice(0, 5)
                .map((relatedSkin) => (
                  <Link
                    key={relatedSkin.slug}
                    href={`/skins/background/${relatedSkin.slug}`}
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-white"
                  >
                    {relatedSkin.name}
                  </Link>
                ))}
              <Link
                href="/skins/background"
                className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-200"
              >
                {t("viewAll")}
              </Link>
            </nav>
          </section>

          <section aria-label="Call to action" className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl"
            >
              {t("playNow")}
            </Link>
            <p className="mt-4 text-sm text-slate-600">
              {t("trySkin", { name: skin.name })}
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
