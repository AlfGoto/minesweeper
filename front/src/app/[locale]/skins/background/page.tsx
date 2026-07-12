import type { Metadata } from "next";
import Script from "next/script";
import { use } from "react";
import { Link } from "@/i18n/navigation";
import { getPublishedBackgroundSkins } from "@/features/skins/backgrounds";
import { setRequestLocale, getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "backgroundSkinsPage" });
  const backgroundCount = getPublishedBackgroundSkins().length;

  return {
    title: t("title"),
    description: t("description", { count: backgroundCount }),
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
      title: t("ogTitle"),
      description: t("ogDescription", { count: backgroundCount }),
      url: "https://minesweeper.fr/skins/background",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription", { count: backgroundCount }),
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

export default function BackgroundSkinsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <BackgroundSkinsContent locale={locale} />;
}

async function BackgroundSkinsContent({ locale }: { locale: string }) {
  const t = await getTranslations("backgroundSkinsPage");
  const backgrounds = getPublishedBackgroundSkins(locale);

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
        "@type": "SoftwareApplication",
        name: `${skin.name} Minesweeper Background Skin`,
        description: skin.description,
        url: `https://minesweeper.fr/skins/background/${skin.slug}`,
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
        name: t("breadcrumb"),
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
              <li className="font-medium text-slate-900">{t("breadcrumb")}</li>
            </ol>
          </nav>

          <header className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-slate-700">
              {t("intro")}
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
                      {t("cosmetic")}
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
