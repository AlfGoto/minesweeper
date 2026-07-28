import { createOgImage, ogImageSize } from "@/lib/og-image";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const alt = "Minesweeper Stats";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statsPage" });

  return createOgImage(t("metaTitle"), t("metaDescription"));
}
