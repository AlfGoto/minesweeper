import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const retroGridBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 50% 18%, rgba(251,191,36,0.22) 0 10%, transparent 24%)",
    "linear-gradient(180deg, rgba(244,114,182,0.22) 0%, rgba(244,114,182,0) 42%)",
    "linear-gradient(rgba(45,212,191,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(45,212,191,0.18) 1px, transparent 1px)",
    "linear-gradient(180deg, #1e1b4b 0%, #0f172a 55%, #020617 100%)",
  ].join(","),
  backgroundSize: "100% 100%, 100% 100%, 28px 28px, 28px 28px, 100% 100%",
  backgroundPosition: "center, center, center, center, center",
  backgroundColor: "#0f172a",
};

export const retroGridSkin: BackgroundSkinData = {
  value: "bg-indigo-950",
  style: retroGridBackgroundStyle,
  name: "Retro Grid",
  slug: "retro-grid-background",
  description:
    "A neon synthwave-style background with glowing grid lines, dusk gradients, and arcade energy.",
  longDescription:
    "Retro Grid is inspired by old arcade posters and synthwave landscapes. It combines a dark purple night base, a warm horizon glow, and cyan grid lines to create a playful futuristic backdrop that still keeps the app readable.",
  keywords: [
    "retro grid minesweeper background",
    "synthwave game background",
    "neon arcade minesweeper theme",
  ],
  faq: [
    {
      question: "What is the Retro Grid background skin in Minesweeper?",
      answer:
        "Retro Grid is a synthwave-inspired background skin with glowing grid lines and neon arcade energy.",
    },
    {
      question: "Does the Retro Grid background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
};
