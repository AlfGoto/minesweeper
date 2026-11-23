import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  CellSkins,
  getSkinMetaBySlug,
  getAllSkinSlugs,
  getPublishedSkinsWithMeta,
} from "@/features/skins/cells/skins";
import {
  PreviewGrid,
  LARGE_DEMO_GRID,
  LARGE_DEMO_GRID_SIZE,
} from "@/features/shared/components/cell-skin-preview";
import { getCellSkinSeo } from "@/features/skins/seo";
import { getTranslations } from "next-intl/server";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkinCtaButtons } from "@/components/skin-cta-buttons";
import {
  BottomCta,
  FaqSection,
  RelatedSection,
  StatBoxes,
  Swatch,
  TextSection,
  getSkinColors,
} from "@/components/skin-page-parts";
import { getCellSkinsPrices, getSkinStats } from "@/lib/api";

/** Number colors (1–8) of the original Windows Minesweeper. */
const WINDOWS_NUMBER_HEX = [
  "#0000FF",
  "#008000",
  "#FF0000",
  "#000080",
  "#800000",
  "#008080",
  "#000000",
  "#808080",
];

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
  const tColors = await getTranslations({ locale, namespace: "classicColors" });
  const isClassic = skin.id === "classic";
  const fullTitle = t("skinTitle", { name: skin.name });
  const title = isClassic
    ? tColors("title")
    : (seoContent?.title ?? (fullTitle.length > 60 ? `${skin.name} - Minesweeper Skin` : fullTitle));
  const description = isClassic
    ? tColors("metaDescription")
    : (seoContent?.metaDescription ?? skin.description);
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
      images: generateOgImages(`/skins/${skin.slug}`, title),
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
  const tColors = await getTranslations("classicColors");
  const skin = getSkinMetaBySlug(skinName, locale);

  if (!skin) {
    notFound();
  }

  const seoContent = getCellSkinSeo(skin.id, locale);
  const pageUrl = `https://minesweeper.fr/skins/${skin.slug}`;
  const [stats, prices, tHome, tSkins] = await Promise.all([
    getSkinStats("cells", skin.id),
    getCellSkinsPrices(),
    getTranslations("homepage"),
    getTranslations("skinsPage"),
  ]);
  const price = (prices as Partial<Record<string, number>>)[skin.id];
  const colors = getSkinColors(CellSkins[skin.id]?.ogColors);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <main>
        <article>
          <div
            style={{
              backgroundImage: `linear-gradient(to bottom, ${colors.tint}, white)`,
            }}
          >
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-center justify-between gap-3 py-5">
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <li>
                      <Link href="/" className="hover:underline">
                        Minesweeper
                      </Link>
                    </li>
                    <li aria-hidden>/</li>
                    <li>
                      <Link href="/skins" className="hover:underline">
                        {t("breadcrumbSkins")}
                      </Link>
                    </li>
                    <li aria-hidden>/</li>
                    <li className="font-medium text-green-700">{skin.name}</li>
                  </ol>
                </nav>
                <Button asChild>
                  <Link href="/" prefetch>
                    {tHome("backToGame")}
                  </Link>
                </Button>
              </div>

              <header className="flex flex-wrap items-center gap-14 pt-8 pb-12 md:pb-16">
                <div className="flex flex-1 basis-96 flex-col gap-6">
                  <h1 className="text-4xl leading-tight font-bold tracking-tight text-foreground">
                    {skin.name}
                  </h1>
                  {seoContent?.heroTagline ? (
                    <p className="max-w-lg text-xl font-medium text-foreground">
                      {seoContent.heroTagline}
                    </p>
                  ) : (
                    <p className="max-w-lg text-xl font-medium text-foreground">
                      {skin.description}
                    </p>
                  )}
                  {stats && stats.games > 0 && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("winRate", { rate: stats.winRate, games: stats.games })}
                    </p>
                  )}
                  <StatBoxes
                    priceLabel={t("priceLabel")}
                    price={price}
                  />
                  <SkinCtaButtons
                    signInLabel={tSkins("signInToUnlock")}
                    playLabel={t("playNow")}
                  />
                  <p className="text-sm text-muted-foreground">
                    {t("trySkin", { name: skin.name })}
                  </p>
                </div>

                <section
                  aria-label="Skin Preview"
                  className="w-full md:w-auto md:flex-none"
                >
                  <div
                    className="mx-auto w-full max-w-md rounded-xl p-3 shadow-2xl md:w-auto md:max-w-none md:p-7"
                    style={{ backgroundColor: colors.dark }}
                  >
                    <div className="rounded-2xl bg-white/8 p-2">
                      <div className="overflow-hidden rounded-lg md:w-110">
                        <PreviewGrid
                          skin={skin.id}
                          grid={LARGE_DEMO_GRID}
                          gridSize={LARGE_DEMO_GRID_SIZE}
                          className="grid w-full"
                          cellClassName="aspect-square text-sm md:text-xl"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </header>
            </div>
          </div>

          <div className="mx-auto flex max-w-3xl flex-col gap-14 px-6 pt-4">
            {skin.id === "classic" && (
              <TextSection title={tColors("heading")}>
                <p>{tColors("answer")}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{tColors("number")}</TableHead>
                      <TableHead>{tColors("color")}</TableHead>
                      <TableHead>{tColors("hex")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {WINDOWS_NUMBER_HEX.map((hex, index) => (
                      <TableRow key={hex}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{(tColors.raw("names") as string[])[index]}</TableCell>
                        <TableCell>{hex}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p>{tColors("softer")}</p>
                <p>
                  <Link
                    href="/blog/minesweeper-colors-explained"
                    className="text-green-700 hover:underline"
                  >
                    {tColors("blogLink")}
                  </Link>
                </p>
              </TextSection>
            )}
            {seoContent?.sections ? (
              seoContent.sections.map((section) => (
                <TextSection key={section.title} title={section.title}>
                  {section.content.split("\n\n").map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </TextSection>
              ))
            ) : (
              <TextSection title={t("aboutSkin", { name: skin.name })}>
                <p>{skin.longDescription}</p>
              </TextSection>
            )}

            <FaqSection
              ariaLabel="Frequently Asked Questions"
              title={t("faq")}
              entries={faqEntries}
            />

            <RelatedSection
              ariaLabel="Related skins"
              title={t("moreSkins")}
              viewAllHref="/skins"
              viewAllLabel={t("viewAll")}
              items={getPublishedSkinsWithMeta(locale)
                .filter((s) => s.slug !== skin.slug)
                .slice(0, 6)
                .map((relatedSkin) => ({
                  slug: relatedSkin.slug,
                  name: relatedSkin.name,
                  href: `/skins/${relatedSkin.slug}`,
                  swatch: <Swatch skin={relatedSkin.id} size="md" />,
                }))}
            />
          </div>

          <BottomCta
            darkColor={colors.dark}
            swatch={<Swatch skin={skin.id} size="lg" />}
            trySkinText={t("trySkin", { name: skin.name })}
            signInLabel={tSkins("signInToUnlock")}
            playLabel={t("playNow")}
          />
        </article>
      </main>
    </>
  );
}
