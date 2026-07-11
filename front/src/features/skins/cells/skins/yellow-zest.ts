import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const yellowZestSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Yellow Zest",
  slug: "yellow-zest",
  hiddenA:
    "bg-[linear-gradient(160deg,#a16207_0%,#713f12_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#ca8a04_0%,#854d0e_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#fffde8_0%,#fef9c3_52%,#fde68a_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fffef0_0%,#fefad8_52%,#fdeaa7_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(250,204,21,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-lime-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-orange-700",
    6: "text-cyan-700",
    7: "text-amber-800",
    8: "text-stone-700",
  },
  emojis: ["💛", "⭐", "🌙", "☀️", "🍋", "🐥", "🌼", "🟡"],
  glossRgb: "255,255,255",
  shadowRgb: "113,63,18",
  description:
    "A bright yellow emoji Minesweeper skin with sunshine-colored hidden tiles and crisp pale reveals.",
  longDescription:
    "Yellow Zest uses a fully yellow emoji pool for unrevealed Minesweeper cells, mixing stars, moons, suns, lemons, chicks, flowers, and yellow geometric icons. The consistent yellow palette makes the board feel energetic and instantly recognizable. Revealed cells stay restrained and light so the important gameplay information remains easy to read and flags stay visible on top of hidden cells.",
  keywords: [
    "yellow emoji minesweeper skin",
    "yellow minesweeper theme",
    "sunny emoji minesweeper",
    "monochrome yellow game skin",
    "bright minesweeper skin",
    "same color emoji yellow theme",
  ],
  faq: [
    {
      question: "What is the Yellow Zest skin in Minesweeper?",
      answer:
        "Yellow Zest is a published Minesweeper skin that keeps hidden cells inside a yellow-only emoji palette for a bright monochrome look.",
    },
    {
      question: "Which kinds of emojis appear in Yellow Zest?",
      answer:
        "Yellow Zest uses a seeded set of yellow emojis such as stars, moons, suns, lemons, chicks, flowers, and yellow shapes.",
    },
    {
      question: "Does Yellow Zest still prioritize number readability?",
      answer:
        "Yes. The revealed tiles are intentionally clean and pale so numbers remain easy to read during normal gameplay.",
    },
  ],
  translations: {
    fr: {
      name: "Zeste Jaune",
      description:
        "Un skin Démineur emoji jaune vif avec des tuiles cachées couleur soleil et des révélations pâles et nettes.",
      longDescription:
        "Zeste Jaune utilise un pool d'emojis entièrement jaune pour les cellules non révélées du Démineur, mélangeant des étoiles, des lunes, des soleils, des citrons, des poussins, des fleurs et des icônes géométriques jaunes. La palette jaune cohérente rend le plateau énergique et instantanément reconnaissable. Les cellules révélées restent retenues et légères pour que les informations de gameplay importantes restent faciles à lire et les drapeaux restent visibles par-dessus les cellules cachées.",
      keywords: [
        "skin démineur emoji jaune",
        "thème démineur jaune",
        "démineur emoji ensoleillé",
        "skin jeu jaune monochrome",
        "skin démineur lumineux",
        "thème emoji jaune même couleur",
      ],
    },
    es: {
      name: "Zest Amarillo",
      description:
        "Un skin Buscaminas emoji amarillo brillante con baldosas ocultas color sol y revelaciones pálidas y nítidas.",
      longDescription:
        "Zest Amarillo usa un pool de emojis completamente amarillo para las celdas sin revelar del Buscaminas, mezclando estrellas, lunas, soles, limones, pollitos, flores e iconos geométricos amarillos. La paleta amarilla consistente hace que el tablero se sienta enérgico e instantáneamente reconocible. Las celdas reveladas permanecen contenidas y ligeras para que la información importante del gameplay siga siendo fácil de leer y las banderas permanezcan visibles sobre las celdas ocultas.",
      keywords: [
        "skin buscaminas emoji amarillo",
        "tema buscaminas amarillo",
        "buscaminas emoji soleado",
        "skin juego amarillo monocromático",
        "skin buscaminas brillante",
        "tema emoji amarillo mismo color",
      ],
    },
  },
});
