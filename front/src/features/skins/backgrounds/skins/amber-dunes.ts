import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const amberDunesBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 14% 18%, rgba(255,251,235,0.55) 0 9%, transparent 24%)",
    "radial-gradient(circle at 82% 24%, rgba(254,243,199,0.42) 0 11%, transparent 28%)",
    "radial-gradient(circle at 61% 74%, rgba(251,191,36,0.14) 0 15%, transparent 34%)",
    "repeating-linear-gradient(170deg, rgba(180,83,9,0.08) 0 14px, rgba(245,158,11,0.02) 14px 30px, transparent 30px 52px)",
    "linear-gradient(155deg, #fff7ed 0%, #fde68a 42%, #fdba74 72%, #fb923c 100%)",
  ].join(","),
  backgroundColor: "#fde68a",
};

export const amberDunesSkin: BackgroundSkinData = {
  value: "bg-amber-200",
  style: amberDunesBackgroundStyle,
  name: "Amber Dunes",
  slug: "amber-dunes-background",
  description:
    "A warm desert-inspired background with sandy gradients, sunlit haze, and subtle dune-like texture lines.",
  longDescription:
    "Amber Dunes wraps the page in a sun-baked palette of cream, gold, amber, and orange. The layered streaks imitate soft dune ridges, giving the backdrop a warm windswept look that feels calm rather than harsh.",
  keywords: [
    "desert minesweeper background",
    "warm sand game theme",
    "amber dunes background skin",
  ],
  faq: [
    {
      question: "What is the Amber Dunes background skin in Minesweeper?",
      answer:
        "Amber Dunes is a warm desert-inspired background skin with sandy gradients and subtle dune-like textures.",
    },
    {
      question: "Does the Amber Dunes background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
};
