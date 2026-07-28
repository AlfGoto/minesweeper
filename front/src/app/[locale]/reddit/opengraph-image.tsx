import { createOgImage, ogImageSize } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const alt = "About Minesweeper";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "redditPage" });

  return createOgImage(t("title"), t("metaDescription"));
}
