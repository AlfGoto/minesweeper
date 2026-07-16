import { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { generateAlternates } from "@/lib/seo-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "redditPage" });
  const alternates = generateAlternates("/reddit", locale);

  return {
    title: t("title"),
    description: t("metaDescription"),
    keywords: [
      "minesweeper reddit",
      "best minesweeper online",
      "free minesweeper game",
      "minesweeper with skins",
      "minesweeper leaderboard",
      "minesweeper speedrun",
      "online minesweeper",
      "custom minesweeper skins",
      "minesweeper stats tracker",
      "minesweeper community",
    ],
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      url: alternates.canonical,
      siteName: "Minesweeper",
      type: "website",
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
      title: t("title"),
      description: t("metaDescription"),
    },
    alternates,
  };
}

export default function RedditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <RedditContent />;
}

async function RedditContent() {
  const t = await getTranslations("redditPage");

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 bg-white/90 rounded-lg min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        {t("title")}
      </h1>
      <p className="text-lg text-gray-600 mb-12">{t("subtitle")}</p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t("whatIs.title")}
        </h2>
        <p className="text-gray-600 mb-4">{t("whatIs.description")}</p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            {t("playNow")}
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          {t("features.title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            title={t("features.customSkins.title")}
            description={t("features.customSkins.description")}
            href="/skins"
            linkText={t("features.customSkins.link")}
          />

          <FeatureCard
            title={t("features.leaderboards.title")}
            description={t("features.leaderboards.description")}
            href="/players"
            linkText={t("features.leaderboards.link")}
          />

          <FeatureCard
            title={t("features.stats.title")}
            description={t("features.stats.description")}
            href="/stats"
            linkText={t("features.stats.link")}
          />

          <FeatureCard
            title={t("features.profiles.title")}
            description={t("features.profiles.description")}
            href="/players"
            linkText={t("features.profiles.link")}
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t("why.title")}
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong className="text-gray-900">{t("why.free")}</strong> - {t("why.freeDesc")}
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong className="text-gray-900">{t("why.noDownload")}</strong> - {t("why.noDownloadDesc")}
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong className="text-gray-900">{t("why.mobile")}</strong> - {t("why.mobileDesc")}
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong className="text-gray-900">{t("why.active")}</strong> - {t("why.activeDesc")}
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span>
              <strong className="text-gray-900">{t("why.privacy")}</strong> - {t("why.privacyDesc")}
            </span>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {t("quickLinks")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/" label={t("playMinesweeper")} />
          <QuickLink href="/skins" label={t("browseSkins")} />
          <QuickLink href="/players" label={t("leaderboard")} />
          <QuickLink href="/stats" label={t("myStats")} />
          <QuickLink href="/how-to-play" label={t("howToPlay")} />
        </div>
      </section>

      <section className="text-center text-gray-500 text-sm">
        <p>
          {t("contactMe")}{" "}
          <a
            href="mailto:contact@minesweeper.fr"
            className="text-green-600 hover:underline"
          >
            contact@minesweeper.fr
          </a>
        </p>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={href}
        className="text-green-600 hover:text-green-700 font-medium"
      >
        {linkText} →
      </Link>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-gray-200 hover:border-green-400 hover:bg-green-50 px-4 py-2 rounded-lg transition-colors text-gray-700"
    >
      {label}
    </Link>
  );
}
