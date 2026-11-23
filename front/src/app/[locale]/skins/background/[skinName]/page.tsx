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
import { getBackgroundSkinsPrices, getSkinStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { SkinCtaButtons } from "@/components/skin-cta-buttons";
import {
  BottomCta,
  FaqSection,
  RelatedSection,
  StatBoxes,
  TextSection,
} from "@/components/skin-page-parts";
import {
  PreviewGrid,
  LARGE_DEMO_GRID,
  LARGE_DEMO_GRID_SIZE,
} from "@/features/shared/components/cell-skin-preview";
import { getTranslations } from "next-intl/server";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";

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
      images: generateOgImages(`/skins/background/${skin.slug}`, title),
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
  const [stats, prices, tHome, tSkins] = await Promise.all([
    getSkinStats("background", skin.id),
    getBackgroundSkinsPrices(),
    getTranslations("homepage"),
    getTranslations("skinsPage"),
  ]);
  const price = (prices as Partial<Record<string, number>>)[skin.id];

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

      <main className={`${skin.value} min-h-screen`} style={skin.style}>
        <article>
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-3 py-5">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <li>
                    <Link href="/" className="hover:underline">
                      Minesweeper
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li>
                    <Link href="/skins/background" className="hover:underline">
                      {t("breadcrumb")}
                    </Link>
                  </li>
                  <li aria-hidden>/</li>
                  <li className="font-medium text-white">
                    {t("skinBreadcrumb", { name: skin.name })}
                  </li>
                </ol>
              </nav>
              <Button asChild className="bg-white text-neutral-900 hover:bg-white/90">
                <Link href="/" prefetch>
                  {tHome("backToGame")}
                </Link>
              </Button>
            </div>

            <header className="flex flex-wrap items-center gap-14 pt-10 pb-8 text-white">
              <div className="flex flex-1 basis-96 flex-col gap-6">
                <p className="text-sm font-semibold uppercase text-slate-400">
                  {t("skinLabel")}
                </p>
                <h1 className="text-4xl leading-tight font-bold tracking-tight">
                  {skin.name}
                </h1>
                {seoContent?.heroTagline ? (
                  <p className="max-w-lg text-xl text-slate-200">
                    {seoContent.heroTagline}
                  </p>
                ) : (
                  <p className="max-w-lg text-xl text-slate-200">
                    {skin.description}
                  </p>
                )}
                {stats && stats.games > 0 && (
                  <p className="text-sm font-medium text-slate-300">
                    {t("winRate", { rate: stats.winRate, games: stats.games })}
                  </p>
                )}
                <p className="max-w-lg text-sm text-slate-400">
                  {t("livePreview", { name: skin.name.toLowerCase() })}
                </p>
                <StatBoxes
                  dark
                  priceLabel={t("priceLabel")}
                  price={price}
                />
                <SkinCtaButtons
                  tone="dark"
                  signInLabel={tSkins("signInToUnlock")}
                  playLabel={t("playNow")}
                />
              </div>

              <section
                aria-label="Skin Preview"
                className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-none"
              >
                <div className="w-full max-w-md rounded-xl border border-white/14 bg-white/6 p-3 shadow-2xl md:w-auto md:max-w-none md:p-3.5">
                  <div className="overflow-hidden rounded-xl md:w-100">
                    <PreviewGrid
                      skin="default"
                      grid={LARGE_DEMO_GRID}
                      gridSize={LARGE_DEMO_GRID_SIZE}
                      className="grid w-full"
                      cellClassName="aspect-square text-sm md:text-lg"
                    />
                  </div>
                </div>
                <p className="text-sm text-slate-400">{t("previewCaption")}</p>
              </section>
            </header>

            <section
              aria-label="Background skin summary"
              className="flex flex-wrap gap-3 pb-20"
            >
              {[
                t("liveFullPage"),
                t("publishedCount", { count: publishedBackgroundCount }),
                t("purelyCosmetic"),
                t("worksWithAll"),
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/22 bg-white/10 px-4 py-1.5 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </section>
          </div>

          <div className="mx-4 flex max-w-3xl flex-col gap-14 rounded-xl bg-white/90 px-5 py-8 shadow-2xl md:mx-auto md:p-12">
            {seoContent?.sections ? (
              seoContent.sections.map((section) => (
                <TextSection key={section.title} title={section.title}>
                  {section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </TextSection>
              ))
            ) : (
              <TextSection title={t("whatIs", { name: skin.name })}>
                <p>{skin.longDescription}</p>
              </TextSection>
            )}

            <section aria-label="Explore more">
              <p className="text-base leading-relaxed text-foreground">
                {t("exploreMore")}{" "}
                <Link
                  href="/skins/background"
                  className="font-medium text-foreground underline"
                >
                  {t("fullCollection")}
                </Link>{" "}
                {t("orJump")}{" "}
                <Link href="/" className="font-medium text-foreground underline">
                  {t("game")}
                </Link>{" "}
                {t("toTry")}
              </p>
            </section>

            <FaqSection
              ariaLabel="Frequently asked questions"
              title={t("faq")}
              entries={faqEntries}
            />

            <RelatedSection
              ariaLabel="Related background skins"
              title={t("moreBackgrounds")}
              viewAllHref="/skins/background"
              viewAllLabel={t("viewAll")}
              items={getPublishedBackgroundSkins(locale)
                .filter((s) => s.slug !== skin.slug)
                .slice(0, 5)
                .map((relatedSkin) => ({
                  slug: relatedSkin.slug,
                  name: relatedSkin.name,
                  href: `/skins/background/${relatedSkin.slug}`,
                  swatch: (
                    <span
                      className={`${relatedSkin.value} size-11 shrink-0 rounded-md`}
                      style={relatedSkin.style}
                    />
                  ),
                }))}
            />
          </div>

          <BottomCta
            darkColor="var(--color-neutral-900)"
            swatch={
              <span
                className={`${skin.value} size-14 shrink-0 rounded-md`}
                style={skin.style}
              />
            }
            trySkinText={t("trySkin", { name: skin.name })}
            signInLabel={tSkins("signInToUnlock")}
            playLabel={t("playNow")}
          />
        </article>
      </main>
    </>
  );
}
