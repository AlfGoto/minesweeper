import type { CSSProperties } from "react";
import type { BackgroundSkin } from "@/types/bff";

type BackgroundSkinFaq = {
  question: string;
  answer: string;
};

export type BackgroundSkinData = {
  value: string;
  style?: CSSProperties;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: BackgroundSkinFaq[];
};

const flowerFloorBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 7% 11%, rgba(255,176,220,0.96) 0 2.15%, transparent 3.6%)",
    "radial-gradient(circle at 7% 11%, rgba(219,39,119,0.9) 0 0.72%, transparent 1.34%)",
    "radial-gradient(circle at 18% 29%, rgba(255,244,120,0.94) 0 1.9%, transparent 3.25%)",
    "radial-gradient(circle at 18% 29%, rgba(251,146,60,0.9) 0 0.68%, transparent 1.28%)",
    "radial-gradient(circle at 33% 15%, rgba(194,210,255,0.95) 0 2.05%, transparent 3.45%)",
    "radial-gradient(circle at 33% 15%, rgba(79,70,229,0.9) 0 0.73%, transparent 1.37%)",
    "radial-gradient(circle at 46% 38%, rgba(153,246,228,0.93) 0 2.3%, transparent 3.75%)",
    "radial-gradient(circle at 46% 38%, rgba(13,148,136,0.88) 0 0.8%, transparent 1.48%)",
    "radial-gradient(circle at 57% 9%, rgba(233,213,255,0.95) 0 1.95%, transparent 3.3%)",
    "radial-gradient(circle at 57% 9%, rgba(126,34,206,0.9) 0 0.69%, transparent 1.3%)",
    "radial-gradient(circle at 71% 27%, rgba(254,205,211,0.93) 0 2.2%, transparent 3.65%)",
    "radial-gradient(circle at 71% 27%, rgba(225,29,72,0.88) 0 0.77%, transparent 1.43%)",
    "radial-gradient(circle at 82% 12%, rgba(187,247,208,0.93) 0 1.85%, transparent 3.15%)",
    "radial-gradient(circle at 82% 12%, rgba(21,128,61,0.88) 0 0.67%, transparent 1.26%)",
    "radial-gradient(circle at 94% 34%, rgba(186,230,253,0.94) 0 2.1%, transparent 3.5%)",
    "radial-gradient(circle at 94% 34%, rgba(2,132,199,0.88) 0 0.74%, transparent 1.39%)",
    "radial-gradient(circle at 12% 58%, rgba(254,215,170,0.94) 0 2.25%, transparent 3.7%)",
    "radial-gradient(circle at 12% 58%, rgba(194,65,12,0.88) 0 0.79%, transparent 1.46%)",
    "radial-gradient(circle at 24% 86%, rgba(253,230,138,0.95) 0 2%, transparent 3.4%)",
    "radial-gradient(circle at 24% 86%, rgba(161,98,7,0.9) 0 0.72%, transparent 1.35%)",
    "radial-gradient(circle at 41% 63%, rgba(240,253,250,0.95) 0 1.8%, transparent 3.1%)",
    "radial-gradient(circle at 41% 63%, rgba(15,118,110,0.88) 0 0.64%, transparent 1.22%)",
    "radial-gradient(circle at 52% 93%, rgba(224,242,254,0.94) 0 2.2%, transparent 3.6%)",
    "radial-gradient(circle at 52% 93%, rgba(3,105,161,0.88) 0 0.78%, transparent 1.45%)",
    "radial-gradient(circle at 61% 69%, rgba(220,252,231,0.94) 0 1.95%, transparent 3.35%)",
    "radial-gradient(circle at 61% 69%, rgba(22,101,52,0.88) 0 0.7%, transparent 1.32%)",
    "radial-gradient(circle at 77% 85%, rgba(254,242,242,0.95) 0 2.3%, transparent 3.75%)",
    "radial-gradient(circle at 77% 85%, rgba(190,18,60,0.88) 0 0.8%, transparent 1.48%)",
    "radial-gradient(circle at 85% 61%, rgba(237,233,254,0.94) 0 1.9%, transparent 3.25%)",
    "radial-gradient(circle at 85% 61%, rgba(109,40,217,0.88) 0 0.68%, transparent 1.28%)",
    "radial-gradient(circle at 96% 91%, rgba(199,210,254,0.95) 0 2.1%, transparent 3.5%)",
    "radial-gradient(circle at 96% 91%, rgba(67,56,202,0.88) 0 0.74%, transparent 1.39%)",
    "radial-gradient(circle at 28% 48%, rgba(251,207,232,0.9) 0 1.55%, transparent 2.8%)",
    "radial-gradient(circle at 28% 48%, rgba(190,24,93,0.84) 0 0.58%, transparent 1.1%)",
    "radial-gradient(circle at 68% 52%, rgba(186,230,253,0.86) 0 1.45%, transparent 2.65%)",
    "radial-gradient(circle at 68% 52%, rgba(3,105,161,0.8) 0 0.52%, transparent 1.02%)",
    "radial-gradient(circle at 89% 74%, rgba(220,252,231,0.88) 0 1.5%, transparent 2.7%)",
    "radial-gradient(circle at 89% 74%, rgba(21,128,61,0.82) 0 0.54%, transparent 1.04%)",
  ].join(","),
  backgroundColor: "#b9eb86",
  backgroundSize: "8% 8%",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
};

const iglooBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.78) 0 12%, transparent 30%)",
    "radial-gradient(circle at 78% 18%, rgba(255,255,255,0.58) 0 10%, transparent 28%)",
    "radial-gradient(circle at 36% 72%, rgba(255,255,255,0.65) 0 14%, transparent 34%)",
    "radial-gradient(circle at 88% 76%, rgba(219,234,254,0.85) 0 11%, transparent 29%)",
    "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.92) 0 0.9%, transparent 1.8%)",
    "radial-gradient(circle at 42% 14%, rgba(255,255,255,0.88) 0 0.7%, transparent 1.4%)",
    "radial-gradient(circle at 67% 28%, rgba(255,255,255,0.9) 0 0.85%, transparent 1.7%)",
    "radial-gradient(circle at 84% 10%, rgba(255,255,255,0.82) 0 0.65%, transparent 1.3%)",
    "radial-gradient(circle at 24% 62%, rgba(255,255,255,0.86) 0 0.8%, transparent 1.6%)",
    "radial-gradient(circle at 58% 54%, rgba(255,255,255,0.84) 0 0.72%, transparent 1.45%)",
    "radial-gradient(circle at 74% 70%, rgba(255,255,255,0.9) 0 0.9%, transparent 1.75%)",
    "radial-gradient(circle at 91% 56%, rgba(255,255,255,0.82) 0 0.62%, transparent 1.25%)",
    "radial-gradient(circle at 8% 86%, rgba(255,255,255,0.86) 0 0.75%, transparent 1.5%)",
    "radial-gradient(circle at 46% 88%, rgba(255,255,255,0.92) 0 0.88%, transparent 1.72%)",
    "radial-gradient(circle at 82% 92%, rgba(255,255,255,0.84) 0 0.7%, transparent 1.4%)",
    "linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%, rgba(191,219,254,0.2) 100%)",
    "linear-gradient(180deg, #eff8ff 0%, #dbeafe 48%, #cfe8f7 100%)",
  ].join(","),
  backgroundSize:
    "100% 100%, 100% 100%, 100% 100%, 100% 100%, 24% 24%, 21% 21%, 26% 26%, 18% 18%, 22% 22%, 20% 20%, 24% 24%, 18% 18%, 23% 23%, 20% 20%, 25% 25%, 100% 100%, 100% 100%",
  backgroundPosition:
    "center, center, center, center, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, center, center",
  backgroundRepeat:
    "no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, no-repeat, no-repeat",
  backgroundColor: "#dbeafe",
};

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

const deepReefBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 22% 24%, rgba(255,255,255,0.13) 0 7%, transparent 22%)",
    "radial-gradient(circle at 76% 16%, rgba(186,230,253,0.18) 0 8%, transparent 24%)",
    "radial-gradient(circle at 64% 72%, rgba(34,211,238,0.14) 0 12%, transparent 30%)",
    "linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%, rgba(125,211,252,0.12) 42%, rgba(255,255,255,0) 62%)",
    "linear-gradient(62deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 24%, rgba(34,211,238,0.1) 36%, rgba(255,255,255,0) 54%)",
    "linear-gradient(160deg, #082f49 0%, #0f766e 46%, #042f2e 100%)",
  ].join(","),
  backgroundColor: "#0f766e",
  backgroundBlendMode: "screen, screen, screen, screen, screen, normal",
};

export const backgroundSkins: Record<BackgroundSkin, BackgroundSkinData> = {
  default: {
    value: "bg-background",
    name: "Classic",
    slug: "classic-background",
    description:
      "A clean neutral Minesweeper background skin with the default light canvas and distraction-free contrast.",
    longDescription:
      "The Classic background skin keeps Minesweeper on a bright neutral canvas that matches the default app style. It is designed for players who want maximum readability, familiar contrast, and a lightweight visual frame around the board without extra color intensity. Because the background stays understated, the game grid, skins, timers, and statistics remain the main focus during play.",
    keywords: [
      "classic minesweeper background",
      "default minesweeper background skin",
      "light minesweeper theme",
      "clean minesweeper background",
      "minimal minesweeper background",
      "neutral minesweeper skin",
    ],
    faq: [
      {
        question: "What is the Classic background skin in Minesweeper?",
        answer:
          "The Classic background skin keeps the game on the default light neutral canvas, giving players a clean and familiar backdrop with strong readability.",
      },
      {
        question: "Who should use the Classic Minesweeper background?",
        answer:
          "It is ideal for players who want a distraction-free look, predictable contrast, and a background that keeps the board and cell skins as the main visual focus.",
      },
      {
        question: "Does the Classic background change gameplay?",
        answer:
          "No. It only changes the visual backdrop around the game interface and does not affect Minesweeper rules, controls, or difficulty.",
      },
    ],
  },
  "flower-floor": {
    value: "bg-lime-100",
    style: flowerFloorBackgroundStyle,
    name: "Flower Floor",
    slug: "flower-floor",
    description:
      "A floral background skin inspired by the Flower Floor cell skin, with soft meadow tones and scattered blossoms.",
    longDescription:
      "Flower Floor Background translates the cheerful Flower Floor cell skin into a broader page backdrop. It layers meadow greens, soft highlight haze, and small flower bursts across the surface so the page feels garden-themed without overwhelming the content above it.",
    keywords: [
      "flower floor minesweeper background",
      "floral minesweeper background",
      "garden minesweeper theme",
    ],
    faq: [
      {
        question: "What is the Flower Floor background skin in Minesweeper?",
        answer:
          "The Flower Floor background skin wraps the page in a meadow-inspired backdrop with scattered blossoms and soft green tones.",
      },
      {
        question: "Does the Flower Floor background affect gameplay?",
        answer:
          "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
      },
    ],
  },
  igloo: {
    value: "bg-sky-100",
    style: iglooBackgroundStyle,
    name: "Igloo Background",
    slug: "igloo-background",
    description:
      "A snowy background skin with icy blues, powder drifts, and scattered snow speckles inspired by the Igloo cell skin.",
    longDescription:
      "Igloo Background is built to make the whole page feel cold, airy, and snow-covered. It uses pale glacier blues, soft powder-like snow banks, and repeating white speckles to suggest falling or wind-swept snow without making the interface hard to read.",
    keywords: [
      "igloo minesweeper background",
      "snow minesweeper background",
      "winter minesweeper theme",
    ],
    faq: [
      {
        question: "What is the Igloo background skin in Minesweeper?",
        answer:
          "The Igloo background skin gives the page a cold, snowy atmosphere with icy blues and scattered snow speckles.",
      },
      {
        question: "Does the Igloo background affect gameplay?",
        answer:
          "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
      },
    ],
  },
  "aurora-drift": {
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
  },
  "retro-grid": {
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
  },
  "amber-dunes": {
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
  },
  "deep-reef": {
    value: "bg-cyan-950",
    style: deepReefBackgroundStyle,
    name: "Deep Reef",
    slug: "deep-reef-background",
    description:
      "An underwater-style background with teal depth, cool caustic light bands, and reef-like atmosphere.",
    longDescription:
      "Deep Reef is designed to feel submerged and luminous at the same time. It layers dark ocean blues with moving-looking aqua highlights and soft reef glows, creating a calmer aquatic alternative to the colder Igloo background.",
    keywords: [
      "underwater minesweeper background",
      "ocean game background skin",
      "reef themed minesweeper background",
    ],
    faq: [
      {
        question: "What is the Deep Reef background skin in Minesweeper?",
        answer:
          "Deep Reef is an underwater-style background skin with teal depth and cool caustic light bands.",
      },
      {
        question: "Does the Deep Reef background affect gameplay?",
        answer:
          "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
      },
    ],
  },
};

export const NonPublishedBackgroundSkins: Record<string, BackgroundSkinData> = {};

export type BackgroundSkinPreviewMeta = BackgroundSkinData & {
  id: string;
};

export const getBackgroundSkinEntries = (
  skinsMap: Record<string, BackgroundSkinData>,
): BackgroundSkinPreviewMeta[] => {
  return Object.entries(skinsMap).map(([id, skin]) => ({
    id,
    ...skin,
  }));
};

export type PublishedBackgroundSkinMeta = BackgroundSkinPreviewMeta & {
  id: BackgroundSkin;
};

export const getPublishedBackgroundSkins = (): PublishedBackgroundSkinMeta[] => {
  return getBackgroundSkinEntries(backgroundSkins).map((skin) => ({
    ...skin,
    id: skin.id as BackgroundSkin,
  }));
};

export const getBackgroundSkinMetaBySlug = (
  slug: string,
): PublishedBackgroundSkinMeta | undefined => {
  return getPublishedBackgroundSkins().find((skin) => skin.slug === slug);
};

export const getAllBackgroundSkinSlugs = (): string[] => {
  return getPublishedBackgroundSkins().map((skin) => skin.slug);
};
