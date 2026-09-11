import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllPages } from "@basalf/cms-next";
import { Link } from "@/i18n/navigation";
import { generateAlternates, generateOgImages } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const alternates = generateAlternates("/blog", locale);

  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates,
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
      images: generateOgImages("/blog", t("title")),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("metaDescription"),
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blogPage");
  const pages = await getAllPages(locale);

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{t("title")}</h1>
      <p className="text-lg text-gray-600 mb-12">{t("subtitle")}</p>

      {pages.length === 0 ? (
        <p className="text-gray-600">{t("empty")}</p>
      ) : (
        <ul className="space-y-6">
          {pages.map((page) => (
            <li key={page.pageId} className="border-b border-border pb-6">
              <Link
                href={`/blog${page.url.startsWith("/") ? "" : "/"}${page.url}`}
                className="block group"
              >
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {page.seo.title}
                </h2>
                <p className="text-gray-600 mt-2">{page.seo.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="text-center mt-12">
        <Link
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          {t("playNow")}
        </Link>
      </section>
    </div>
  );
}
