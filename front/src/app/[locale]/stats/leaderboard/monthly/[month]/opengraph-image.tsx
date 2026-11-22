import { createOgImage, ogImageSize } from "@/lib/og-image";
import { formatMonth } from "@/lib/months";
import { getTranslations } from "next-intl/server";

export const runtime = "edge";
export const alt = "Minesweeper Monthly Leaderboard";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; month: string }>;
}) {
  const { locale, month } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboardPage" });
  const label = formatMonth(month, locale);

  return createOgImage(
    t("monthlyTitle", { month: label }),
    t("monthlyDescription", { month: label }),
  );
}
