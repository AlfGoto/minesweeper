import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext, EmojiTileSkinConfig } from "./types";

export const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
};

export const bgLayers = (...layers: string[]): CSSProperties => ({
  backgroundImage: layers.join(","),
  backgroundRepeat: "no-repeat",
});

export const svgDataUri = (svg: string) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

export const emojiTileLayer = (emoji: string, rotation: number) =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text
        x="50"
        y="56"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="88"
        transform="rotate(${rotation} 50 50)"
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      >
        ${emoji}
      </text>
    </svg>
  `);

export const createEmojiTileSkin = ({
  name,
  slug,
  hiddenA,
  hiddenB,
  revealedA,
  revealedB,
  number,
  emojis,
  glossRgb,
  shadowRgb,
  description,
  longDescription,
  keywords,
  faq,
  translations,
}: EmojiTileSkinConfig): CellSkinDefinition => ({
  green: hiddenA,
  lightGreen: hiddenB,
  gray: `${revealedA} transition-none`,
  silver: `${revealedB} transition-none`,
  number,
  getOverlayStyle: ({
    row,
    col,
    cellStatus,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged || cellStatus === "revealed") return undefined;

    const rand = mulberry32((row + 1) * 14387 + (col + 1) * 58217);
    const emoji =
      emojis[Math.floor(rand() * emojis.length)] ?? emojis[0] ?? "🟪";
    const rotation = Math.floor(-10 + rand() * 21);
    const glossAngle = Math.floor(105 + rand() * 40);
    const glossAlpha = (0.05 + rand() * 0.06).toFixed(2);
    const shadowAlpha = (0.1 + rand() * 0.08).toFixed(2);

    return {
      ...bgLayers(
        `linear-gradient(${glossAngle}deg, rgba(${glossRgb},${glossAlpha}) 0%, rgba(${glossRgb},0) 42%)`,
        `linear-gradient(180deg, rgba(${shadowRgb},0) 0%, rgba(${shadowRgb},${shadowAlpha}) 100%)`,
        emojiTileLayer(emoji, rotation),
      ),
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    };
  },
  name,
  slug,
  description,
  longDescription,
  keywords,
  faq,
  translations,
});
