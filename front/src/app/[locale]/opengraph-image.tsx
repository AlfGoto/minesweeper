import { createOgImage, ogImageSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Minesweeper - Free Online Puzzle Game";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return createOgImage(
    "Minesweeper",
    "Free online puzzle game. Compete for world rankings, earn skins, and challenge yourself on the classic grid."
  );
}
