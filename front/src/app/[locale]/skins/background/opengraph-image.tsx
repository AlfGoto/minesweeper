import { createOgImage, ogImageSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Minesweeper Background Skins";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return createOgImage(
    "Background Skins",
    "Personalize your Minesweeper experience with cosmetic background themes."
  );
}
