import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const orangePopSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Orange Pop",
  slug: "orange-pop",
  hiddenA:
    "bg-[linear-gradient(160deg,#9a3412_0%,#7c2d12_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#c2410c_0%,#9a3412_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#fff7ed_0%,#ffedd5_52%,#fed7aa_100%)] text-orange-950 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fffaf1_0%,#fff0dc_52%,#ffdcb4_100%)] text-orange-950 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-green-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-orange-700",
    6: "text-cyan-700",
    7: "text-amber-800",
    8: "text-stone-700",
  },
  emojis: ["🧡", "🍊", "🥕", "🦊", "🏀", "🔶", "🟧", "🎃"],
  glossRgb: "255,255,255",
  shadowRgb: "124,45,18",
  description:
    "A vivid orange emoji Minesweeper skin with a same-color emoji pool on hidden cells and warm clean reveals.",
  longDescription:
    "Orange Pop keeps every hidden tile inside an orange emoji palette, using icons like oranges, carrots, foxes, basketballs, orange hearts, and orange geometric shapes. Because all of the emoji artwork belongs to the same color family, the board feels cohesive instead of random. Revealed cells stay warm and light to preserve gameplay readability while flags remain clearly layered above the artwork.",
  keywords: [
    "orange emoji minesweeper skin",
    "orange minesweeper theme",
    "same color emoji minesweeper",
    "warm minesweeper skin",
    "orange aesthetic game skin",
    "emoji color theme minesweeper",
  ],
  faq: [
    {
      question: "What is the Orange Pop skin in Minesweeper?",
      answer:
        "Orange Pop is a published Minesweeper skin that limits unrevealed cells to orange-themed emojis for a consistent color-coded look.",
    },
    {
      question:
        "Why does the Orange Pop skin feel more unified than mixed emoji skins?",
      answer:
        "Because every hidden tile pulls from the same orange color family, the grid reads as one clear theme instead of a rainbow mix.",
    },
    {
      question: "Is the Orange Pop skin still readable during fast games?",
      answer:
        "Yes. The revealed cells stay intentionally clean, which keeps number recognition and hidden-versus-revealed contrast strong.",
    },
  ],
  translations: {
    fr: {
      name: "Pop Orange",
      description:
        "Un skin Démineur emoji orange vif avec un pool d'emojis de même couleur sur les cellules cachées et des révélations propres et chaudes.",
      longDescription:
        "Pop Orange garde chaque tuile cachée dans une palette d'emojis orange, utilisant des icônes comme des oranges, des carottes, des renards, des ballons de basket, des cœurs orange et des formes géométriques orange. Parce que tout l'art emoji appartient à la même famille de couleurs, le plateau se sent cohérent au lieu d'aléatoire. Les cellules révélées restent chaudes et légères pour préserver la lisibilité du gameplay tandis que les drapeaux restent clairement superposés au-dessus de l'art.",
      keywords: [
        "skin démineur emoji orange",
        "thème démineur orange",
        "démineur emoji même couleur",
        "skin démineur chaud",
        "skin jeu esthétique orange",
        "thème démineur couleur emoji",
      ],
    },
    es: {
      name: "Pop Naranja",
      description:
        "Un vívido skin Buscaminas emoji naranja con un pool de emojis del mismo color en celdas ocultas y revelaciones limpias y cálidas.",
      longDescription:
        "Pop Naranja mantiene cada baldosa oculta dentro de una paleta de emojis naranja, usando iconos como naranjas, zanahorias, zorros, pelotas de baloncesto, corazones naranjas y formas geométricas naranjas. Debido a que todo el arte emoji pertenece a la misma familia de colores, el tablero se siente cohesivo en lugar de aleatorio. Las celdas reveladas permanecen cálidas y ligeras para preservar la legibilidad del gameplay mientras las banderas permanecen claramente superpuestas sobre el arte.",
      keywords: [
        "skin buscaminas emoji naranja",
        "tema buscaminas naranja",
        "buscaminas emoji mismo color",
        "skin buscaminas cálido",
        "skin juego estética naranja",
        "tema buscaminas color emoji",
      ],
    },
  },
});
