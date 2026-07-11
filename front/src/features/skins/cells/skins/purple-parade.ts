import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const purpleParadeSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Purple Parade",
  slug: "purple-parade",
  hiddenA:
    "bg-[linear-gradient(160deg,#6b21a8_0%,#4c1d95_100%)] text-fuchsia-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#7e22ce_0%,#6b21a8_100%)] text-fuchsia-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#faf5ff_0%,#f3e8ff_52%,#e9d5ff_100%)] text-purple-950 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fdf8ff_0%,#f6edff_52%,#eddcff_100%)] text-purple-950 shadow-[inset_0_0_0_1px_rgba(192,132,252,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-emerald-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-amber-700",
    6: "text-cyan-700",
    7: "text-fuchsia-700",
    8: "text-stone-700",
  },
  emojis: ["💜", "🍆", "🔮", "☂️", "🪻", "🦄", "🟣", "🍇"],
  glossRgb: "255,255,255",
  shadowRgb: "76,29,149",
  description:
    "A purple emoji Minesweeper skin with one-color hidden emoji pools and soft lavender revealed cells.",
  longDescription:
    "Purple Parade builds hidden Minesweeper cells from a purple-only emoji set including hearts, grapes, umbrellas, orbs, lavender flowers, eggplants, unicorns, and purple shapes. Keeping every hidden symbol inside one color family makes the board feel cohesive and stylish without changing gameplay behavior. Revealed cells stay pale and uncluttered so numbers remain readable and flags still appear clearly over hidden tiles.",
  keywords: [
    "purple emoji minesweeper skin",
    "purple minesweeper theme",
    "lavender emoji minesweeper",
    "same color purple game skin",
    "violet minesweeper aesthetic",
    "monochrome emoji theme purple",
  ],
  faq: [
    {
      question: "What is the Purple Parade skin in Minesweeper?",
      answer:
        "Purple Parade is a published Minesweeper skin that uses purple-only emojis on unrevealed cells for a consistent color-first look.",
    },
    {
      question: "Does Purple Parade mix colors on hidden cells?",
      answer:
        "No. Its emoji pool is intentionally limited to purple-toned symbols so the board keeps a monochrome identity.",
    },
    {
      question: "Will the Purple Parade theme still be easy to play with?",
      answer:
        "Yes. The revealed tiles remain simple and light, which keeps number scanning and flag visibility clear during normal play.",
    },
  ],
  translations: {
    fr: {
      name: "Parade Violette",
      description:
        "Un skin Démineur emoji violet avec des pools d'emojis cachés d'une seule couleur et des cellules révélées lavande douces.",
      longDescription:
        "Parade Violette construit les cellules cachées du Démineur à partir d'un ensemble d'emojis uniquement violet incluant des cœurs, des raisins, des parapluies, des orbes, des fleurs de lavande, des aubergines, des licornes et des formes violettes. Garder chaque symbole caché dans une seule famille de couleurs rend le plateau cohérent et élégant sans changer le comportement du gameplay. Les cellules révélées restent pâles et épurées pour que les nombres restent lisibles et les drapeaux apparaissent toujours clairement au-dessus des tuiles cachées.",
      keywords: [
        "skin démineur emoji violet",
        "thème démineur violet",
        "démineur emoji lavande",
        "skin jeu violet même couleur",
        "démineur esthétique violet",
        "thème emoji monochrome violet",
      ],
    },
    es: {
      name: "Desfile Púrpura",
      description:
        "Un skin Buscaminas emoji púrpura con pools de emojis ocultos de un solo color y celdas reveladas lavanda suaves.",
      longDescription:
        "Desfile Púrpura construye las celdas ocultas del Buscaminas a partir de un conjunto de emojis solo púrpura incluyendo corazones, uvas, paraguas, orbes, flores de lavanda, berenjenas, unicornios y formas púrpuras. Mantener cada símbolo oculto dentro de una sola familia de colores hace que el tablero se sienta cohesivo y elegante sin cambiar el comportamiento del gameplay. Las celdas reveladas permanecen pálidas y despejadas para que los números sigan siendo legibles y las banderas sigan apareciendo claramente sobre las baldosas ocultas.",
      keywords: [
        "skin buscaminas emoji púrpura",
        "tema buscaminas púrpura",
        "buscaminas emoji lavanda",
        "skin juego púrpura mismo color",
        "buscaminas estética violeta",
        "tema emoji monocromático púrpura",
      ],
    },
  },
});
