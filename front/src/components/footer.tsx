import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="max-w-4xl mx-auto w-full p-4 md:p-8">
      <nav className="flex flex-wrap justify-center gap-3 border-t border-border pt-6 text-sm">
        <Link
          href="/"
          className="px-4 py-2 rounded-lg border border-border hover:border-green-400 hover:bg-green-50 transition-colors text-gray-700"
        >
          {t("home")}
        </Link>
        <Link
          href="/skins"
          className="px-4 py-2 rounded-lg border border-border hover:border-green-400 hover:bg-green-50 transition-colors text-gray-700"
        >
          {t("skins")}
        </Link>
        <Link
          href="/stats"
          className="px-4 py-2 rounded-lg border border-border hover:border-green-400 hover:bg-green-50 transition-colors text-gray-700"
        >
          {t("stats")}
        </Link>
      </nav>
    </footer>
  );
}
