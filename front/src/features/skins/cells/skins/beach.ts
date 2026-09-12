import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32, bgLayers, svgDataUri } from "./utils";

// Coquillage motifs scattered on sand — weighted so shells dominate over
// starfish/crab accents.
const SAND_MOTIFS = ["🐚", "🐚", "🐚", "⭐", "🦀"];

export const beachSkin: CellSkinDefinition = {
  // Hidden cells = sea (checker of deep / lighter water blue).
  green: "bg-[#2b86a8] contrast-[0.85]",
  lightGreen: "bg-[#3aa6c4] contrast-[0.85]",
  // Revealed cells = sand.
  gray: "bg-[#e8d5a3] contrast-[0.9] transition-none",
  silver: "bg-[#f2e4b8] contrast-[0.9] transition-none",
  ogColors: {
    hidden: "#2b86a8",
    hiddenAlt: "#3aa6c4",
    revealed: "#e8d5a3",
    revealedAlt: "#f2e4b8",
  },
  flagEmoji: "⛱️",
  bombEmoji: "🦈",
  number: {
    0: "",
    1: "text-sky-700",
    2: "text-teal-600",
    3: "text-rose-600",
    4: "text-indigo-700",
    5: "text-amber-700",
    6: "text-pink-600",
    7: "text-orange-600",
    8: "text-slate-700",
  },
  getOverlayStyle: ({
    row,
    col,
    cellStatus,
    isHiddenOrFlagged,
    topIsUnrevealed,
    rightIsUnrevealed,
    bottomIsUnrevealed,
    leftIsUnrevealed,
    topLeftIsUnrevealed,
    topRightIsUnrevealed,
    bottomRightIsUnrevealed,
    bottomLeftIsUnrevealed,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    // Revealed = sand: grain + occasional shell, plus the sea "eating into"
    // the shore near unrevealed (sea) neighbors — reaches further at
    // corners where two sea-adjacent sides meet (like a breaking wave).
    if (cellStatus === "revealed") {
      const grainRand = mulberry32((row + 1) * 92821 + (col + 1) * 51427);
      const grainLayers: string[] = [];

      for (let i = 0; i < 3; i++) {
        const x = (grainRand() * 100).toFixed(1);
        const y = (grainRand() * 100).toFixed(1);
        const size = (0.6 + grainRand() * 1.2).toFixed(2);
        const fade = (Number(size) + 1).toFixed(2);
        const alpha = (0.08 + grainRand() * 0.06).toFixed(2);
        grainLayers.push(
          `radial-gradient(circle at ${x}% ${y}%, rgba(120,95,55,${alpha}) 0 ${size}%, transparent ${fade}%)`,
        );
      }

      if (grainRand() < 0.32) {
        const motif =
          SAND_MOTIFS[Math.floor(grainRand() * SAND_MOTIFS.length)] ?? "🐚";
        const sx = (28 + grainRand() * 44).toFixed(1);
        const sy = (28 + grainRand() * 44).toFixed(1);
        const motifSize = 28 + Math.floor(grainRand() * 14);
        const motifRotation = Math.floor(-20 + grainRand() * 40);
        const motifOpacity = (0.55 + grainRand() * 0.25).toFixed(2);
        grainLayers.push(
          svgDataUri(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <g opacity="${motifOpacity}" transform="rotate(${motifRotation} ${sx} ${sy})">
                <text
                  x="${sx}"
                  y="${sy}"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-size="${motifSize}"
                  font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
                >${motif}</text>
              </g>
            </svg>
          `),
        );
      }

      const edgeRand = mulberry32((row + 1) * 35771 + (col + 1) * 81233);
      const waveAlpha = (0.3 + edgeRand() * 0.16).toFixed(2);
      const mistAlpha = (0.14 + edgeRand() * 0.08).toFixed(2);
      const foamAlpha = (0.36 + edgeRand() * 0.14).toFixed(2);
      const edgeLayers: string[] = [];

      const topBoost =
        topIsUnrevealed &&
        ((leftIsUnrevealed && topLeftIsUnrevealed) ||
          (rightIsUnrevealed && topRightIsUnrevealed));
      const rightBoost =
        rightIsUnrevealed &&
        ((topIsUnrevealed && topRightIsUnrevealed) ||
          (bottomIsUnrevealed && bottomRightIsUnrevealed));
      const bottomBoost =
        bottomIsUnrevealed &&
        ((leftIsUnrevealed && bottomLeftIsUnrevealed) ||
          (rightIsUnrevealed && bottomRightIsUnrevealed));
      const leftBoost =
        leftIsUnrevealed &&
        ((topIsUnrevealed && topLeftIsUnrevealed) ||
          (bottomIsUnrevealed && bottomLeftIsUnrevealed));

      const pushEdge = (
        active: boolean,
        boost: boolean,
        waveDeg: number,
        foamDeg: number,
      ) => {
        if (!active) return;
        const body = boost ? 26 : 18;
        const fade = boost ? 46 : 36;
        edgeLayers.push(
          `linear-gradient(${waveDeg}deg, rgba(58,166,196,${waveAlpha}) 0%, rgba(58,166,196,${mistAlpha}) ${body}%, transparent ${fade}%)`,
        );
        edgeLayers.push(
          `linear-gradient(${foamDeg}deg, rgba(255,255,255,${foamAlpha}) 0%, transparent ${Math.max(10, body - 12)}%)`,
        );
      };

      pushEdge(topIsUnrevealed, topBoost, 180, 172);
      pushEdge(rightIsUnrevealed, rightBoost, 270, 262);
      pushEdge(bottomIsUnrevealed, bottomBoost, 0, 352);
      pushEdge(leftIsUnrevealed, leftBoost, 90, 82);

      return bgLayers(...edgeLayers, ...grainLayers);
    }

    // Hidden/flagged = sea: deterministic current band (phase tied to
    // row/col so ripple lines connect across neighboring cells) plus
    // seeded foam sparkle.
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 60013 + (col + 1) * 40009);
    const phase = (row * 3 + col * 5) % 4;
    const bandAngle = 115 + phase * 8;
    const rippleY = 18 + phase * 20;

    const layers: string[] = [
      `linear-gradient(${bandAngle}deg, rgba(255,255,255,0.07) 0%, transparent 22%, transparent 78%, rgba(255,255,255,0.05) 100%)`,
      `linear-gradient(180deg, transparent ${rippleY - 6}%, rgba(43,134,168,0.1) ${rippleY}%, transparent ${rippleY + 6}%)`,
    ];

    const foamCount = rand() < 0.5 ? 1 : 2;
    for (let i = 0; i < foamCount; i++) {
      const x = (10 + rand() * 80).toFixed(1);
      const y = (10 + rand() * 80).toFixed(1);
      const size = (3 + rand() * 5).toFixed(2);
      const fade = (Number(size) + 3 + rand() * 3).toFixed(2);
      const alpha = (0.16 + rand() * 0.12).toFixed(2);
      layers.push(
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0 ${size}%, transparent ${fade}%)`,
      );
    }

    return bgLayers(...layers);
  },
  name: "Beach",
  slug: "beach",
  description:
    "Sea-blue hidden cells and sun-warmed sand reveals, with coquillage scattered on the shore and waves that lap further onto the sand at the coastline's corners.",
  longDescription:
    "The Beach skin turns the board into a coastline seen from above: unrevealed cells ripple like open sea in two tones of blue, while revealed cells become warm sand dotted with shells, starfish, and the odd crab. Wherever sand borders the sea, foam and current gradients wash onto the shore — and reach further at corners where waves converge, just like a real breaking tide. An umbrella marks your flags, and a shark surfaces when a bomb is revealed.",
  keywords: [
    "beach minesweeper skin",
    "sea minesweeper theme",
    "sand minesweeper skin",
    "ocean minesweeper design",
    "summer minesweeper theme",
    "coastal minesweeper skin",
  ],
  faq: [
    {
      question: "What is the Beach skin in Minesweeper?",
      answer:
        "Beach is a published Minesweeper skin where hidden cells look like rippling sea and revealed cells look like sand scattered with shells, starfish, and crabs.",
    },
    {
      question: "Why does the sand look different near the edges of the sea?",
      answer:
        "Revealed sand cells that border hidden sea cells get a wave and foam overlay, and it reaches further onto the sand at corners where the sea wraps around two sides at once, like a wave breaking on the shore.",
    },
    {
      question: "What do the flag and bomb look like in the Beach skin?",
      answer:
        "Flags are marked with a beach umbrella, and revealed bombs show a shark to keep the ocean theme consistent.",
    },
  ],
  translations: {
    fr: {
      name: "Plage",
      description:
        "Des cellules non révélées bleu mer et du sable ensoleillé pour les cellules révélées, avec des coquillages éparpillés sur le rivage et des vagues qui viennent lécher le sable un peu plus loin dans les coins de la côte.",
      longDescription:
        "Le skin Plage transforme le plateau en littoral vu du ciel : les cellules non révélées ondulent comme la mer en deux tons de bleu, tandis que les cellules révélées deviennent du sable chaud parsemé de coquillages, d'étoiles de mer et parfois d'un crabe. Là où le sable borde la mer, des dégradés d'écume et de courant viennent mouiller le rivage, et vont un peu plus loin dans les coins où les vagues convergent, comme une véritable marée montante. Un parasol marque vos drapeaux, et un requin apparaît quand une bombe est révélée.",
      keywords: [
        "skin démineur plage",
        "thème démineur mer",
        "skin démineur sable",
        "design démineur océan",
        "thème démineur été",
        "skin démineur côtier",
      ],
    },
    es: {
      name: "Playa",
      description:
        "Celdas sin revelar en tonos de mar azul y arena soleada para las celdas reveladas, con conchas esparcidas por la orilla y olas que llegan un poco más lejos sobre la arena en las esquinas de la costa.",
      longDescription:
        "El skin Playa convierte el tablero en una costa vista desde el cielo: las celdas sin revelar ondulan como el mar abierto en dos tonos de azul, mientras que las celdas reveladas se convierten en arena cálida salpicada de conchas, estrellas de mar y algún cangrejo. Donde la arena bordea el mar, los degradados de espuma y corriente humedecen la orilla, y llegan un poco más lejos en las esquinas donde las olas convergen, como una marea real rompiendo en la costa. Una sombrilla marca tus banderas, y un tiburón aparece cuando se revela una bomba.",
      keywords: [
        "skin buscaminas playa",
        "tema buscaminas mar",
        "skin buscaminas arena",
        "diseño buscaminas océano",
        "tema buscaminas verano",
        "skin buscaminas costero",
      ],
    },
  },
};
