import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const redBurstSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Red Burst",
  slug: "red-burst",
  hiddenA:
    "bg-[linear-gradient(160deg,#7f1d1d_0%,#450a0a_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#991b1b_0%,#5f1010_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#fff1f2_0%,#ffe4e6_52%,#fecdd3_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fff7f7_0%,#ffeef2_52%,#ffd5dd_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-emerald-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-orange-700",
    6: "text-cyan-700",
    7: "text-amber-700",
    8: "text-stone-700",
  },
  emojis: ["❤️", "🌹", "🍓", "🍒", "🍎", "🎈", "🧧", "🟥"],
  glossRgb: "255,255,255",
  shadowRgb: "69,10,10",
  description:
    "A red emoji Minesweeper skin that keeps every unrevealed tile inside a bold crimson palette while revealed cells stay clean and readable.",
  longDescription:
    "The Red Burst skin gives hidden Minesweeper cells a fully red emoji pool, mixing symbols like hearts, roses, cherries, strawberries, apples, and other crimson icons. Every unrevealed tile stays in the same color family, which creates a stronger monochrome theme across the board. Revealed cells remain simple and pale so numbers are easy to read and flags still appear clearly over the background artwork.",
  keywords: [
    "red emoji minesweeper skin",
    "red minesweeper theme",
    "monochrome emoji skin",
    "red aesthetic minesweeper",
    "crimson minesweeper skin",
    "same color emoji theme",
  ],
  faq: [
    {
      question: "What is the Red Burst skin in Minesweeper?",
      answer:
        "Red Burst is a published Minesweeper skin that uses only red-themed emojis on unrevealed cells and keeps revealed cells minimal for easy scanning.",
    },
    {
      question:
        "Do all emojis in the Red Burst skin share the same color family?",
      answer:
        "Yes. The unrevealed tiles in Red Burst use a seeded set of emojis that all stay inside a red or crimson palette.",
    },
    {
      question: "Can I still place flags normally with the Red Burst theme?",
      answer:
        "Yes. The emoji artwork is rendered in the background, so the normal flag stays visible on top of hidden cells.",
    },
  ],
  translations: {
    fr: {
      name: "Éclat Rouge",
      description:
        "Un skin Démineur emoji rouge qui garde chaque tuile non révélée dans une palette cramoisie audacieuse tandis que les cellules révélées restent propres et lisibles.",
      longDescription:
        "Le skin Éclat Rouge donne aux cellules cachées du Démineur un pool d'emojis entièrement rouge, mélangeant des symboles comme des cœurs, des roses, des cerises, des fraises, des pommes et d'autres icônes cramoisies. Chaque tuile non révélée reste dans la même famille de couleurs, ce qui crée un thème monochrome plus fort sur tout le plateau. Les cellules révélées restent simples et pâles pour que les nombres soient faciles à lire et les drapeaux apparaissent clairement au-dessus de l'art de fond.",
      keywords: [
        "skin démineur emoji rouge",
        "thème démineur rouge",
        "skin emoji monochrome",
        "démineur esthétique rouge",
        "skin démineur cramoisi",
        "thème emoji même couleur",
      ],
    },
    es: {
      name: "Estallido Rojo",
      description:
        "Un skin Buscaminas emoji rojo que mantiene cada baldosa sin revelar dentro de una paleta carmesí audaz mientras las celdas reveladas permanecen limpias y legibles.",
      longDescription:
        "El skin Estallido Rojo da a las celdas ocultas del Buscaminas un pool de emojis completamente rojo, mezclando símbolos como corazones, rosas, cerezas, fresas, manzanas y otros iconos carmesí. Cada baldosa sin revelar permanece en la misma familia de colores, lo que crea un tema monocromático más fuerte en todo el tablero. Las celdas reveladas permanecen simples y pálidas para que los números sean fáciles de leer y las banderas aparezcan claramente sobre el arte de fondo.",
      keywords: [
        "skin buscaminas emoji rojo",
        "tema buscaminas rojo",
        "skin emoji monocromático",
        "buscaminas estética roja",
        "skin buscaminas carmesí",
        "tema emoji mismo color",
      ],
    },
  },
});
