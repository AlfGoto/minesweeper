import { createOgImage, ogImageSize } from "@/lib/og-image";

export const runtime = "edge";
export const alt = "Minesweeper Skins - Unlock by Playing";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return createOgImage(
    "Minesweeper Skins",
    "Customize your game with free skins. Unlock unique themes by playing and competing."
  );
}
