import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const auroraDriftBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 18% 16%, rgba(56,189,248,0.2) 0 12%, transparent 28%)",
    "radial-gradient(circle at 82% 12%, rgba(129,140,248,0.2) 0 11%, transparent 28%)",
    "radial-gradient(circle at 68% 78%, rgba(45,212,191,0.16) 0 14%, transparent 32%)",
    "linear-gradient(118deg, transparent 22%, rgba(45,212,191,0.18) 36%, rgba(34,197,94,0.08) 48%, transparent 62%)",
    "linear-gradient(132deg, transparent 28%, rgba(96,165,250,0.22) 42%, rgba(192,132,252,0.12) 54%, transparent 68%)",
    "linear-gradient(160deg, rgba(8,47,73,0.94) 0%, rgba(15,23,42,0.98) 52%, rgba(3,7,18,1) 100%)",
  ].join(","),
  backgroundColor: "#0f172a",
  backgroundBlendMode: "screen, screen, screen, screen, screen, normal",
};

export const auroraDriftSkin: BackgroundSkinData = {
  value: "bg-slate-950",
  style: auroraDriftBackgroundStyle,
  name: "Aurora Drift",
  slug: "aurora-drift-background",
  description:
    "A dark atmospheric background with northern-light ribbons, deep midnight tones, and soft cold glows.",
  longDescription:
    "Aurora Drift is built around the feeling of playing Minesweeper beneath a polar night sky. It mixes deep navy shadows with floating teal, blue, and violet aurora bands so the page feels moody, luminous, and cinematic without becoming too noisy behind the interface.",
  keywords: [
    "aurora minesweeper background",
    "northern lights game background",
    "dark atmospheric minesweeper theme",
  ],
  faq: [
    {
      question: "What is the Aurora Drift background skin in Minesweeper?",
      answer:
        "Aurora Drift is a dark background skin featuring northern-light ribbons and deep midnight tones for a moody, cinematic atmosphere.",
    },
    {
      question: "Does the Aurora Drift background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
};
