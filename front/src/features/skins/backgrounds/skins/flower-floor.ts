import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

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

export const flowerFloorSkin: BackgroundSkinData = {
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
};
