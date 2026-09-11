import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Page, getAllPages, getPageMetadata, type GetHref } from "@basalf/cms-next";
import { routing } from "@/i18n/routing";
import { generateAlternates } from "@/lib/seo-config";

const AUTHOR = { name: "AlfGoto", url: "https://minesweeper.fr" };

// The lib matches pages by their `url` field (e.g. "/why-minesweeper-fr-stands-out"),
// not by pageId, so the route slug must come from `url`.
function slugFromUrl(url: string): string[] {
  return (url.startsWith("/") ? url.slice(1) : url).split("/");
}

const getHref: GetHref = (slug, locale) => {
  const clean = slugFromUrl(slug).join("/");
  return locale === routing.defaultLocale ? `/blog/${clean}` : `/${locale}/blog/${clean}`;
};

export async function generateStaticParams() {
  const allPages = await getAllPages();

  return allPages
    .filter((page) => routing.locales.includes(page.locale as (typeof routing.locales)[number]))
    .map((page) => ({
      locale: page.locale,
      slug: slugFromUrl(page.url),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pageSlug = slug.join("/");
  const metadata = await getPageMetadata(pageSlug, locale);
  const alternates = generateAlternates(`/blog/${pageSlug}`, locale);

  return { ...metadata, alternates };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) notFound();

  setRequestLocale(locale);

  const pageSlug = slug.join("/");
  const url = generateAlternates(`/blog/${pageSlug}`, locale).canonical;

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <Page
        slug={pageSlug}
        locale={locale}
        url={url}
        getHref={getHref}
        author={AUTHOR}
      />
    </div>
  );
}
