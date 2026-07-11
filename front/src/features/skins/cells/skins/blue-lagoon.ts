import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const blueLagoonSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Blue Lagoon",
  slug: "blue-lagoon",
  hiddenA:
    "bg-[linear-gradient(160deg,#1d4ed8_0%,#1e3a8a_100%)] text-sky-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#2563eb_0%,#1d4ed8_100%)] text-sky-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#eff6ff_0%,#dbeafe_52%,#bfdbfe_100%)] text-sky-950 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#f5f9ff_0%,#e3efff_52%,#cfe1ff_100%)] text-sky-950 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-emerald-700",
    3: "text-red-700",
    4: "text-indigo-700",
    5: "text-amber-700",
    6: "text-cyan-700",
    7: "text-slate-700",
    8: "text-stone-700",
  },
  emojis: ["💙", "🫐", "🐟", "🦋", "🧢", "🌊", "🔷", "🟦"],
  glossRgb: "255,255,255",
  shadowRgb: "30,58,138",
  description:
    "A blue emoji Minesweeper skin with a same-color hidden emoji pool and cool airy revealed tiles.",
  longDescription:
    "Blue Lagoon keeps every unrevealed Minesweeper tile inside a blue emoji palette, using icons like blue hearts, blueberries, fish, butterflies, waves, caps, and blue shapes. The result is a cleaner monochrome look that still feels lively because each cell can rotate through different blue symbols. Revealed tiles stay light and cool-toned to preserve number readability and maintain strong contrast against hidden cells.",
  keywords: [
    "blue emoji minesweeper skin",
    "blue minesweeper theme",
    "ocean emoji minesweeper",
    "same color blue game skin",
    "cool minesweeper emoji theme",
    "monochrome blue minesweeper",
  ],
  faq: [
    {
      question: "What is the Blue Lagoon skin in Minesweeper?",
      answer:
        "Blue Lagoon is a published Minesweeper skin that uses blue-only emojis for hidden cells and clean cool-toned reveals for readability.",
    },
    {
      question: "Why does Blue Lagoon use only blue emojis?",
      answer:
        "The single-color emoji pool gives the board a stronger identity and makes the theme feel more intentional than a mixed-color set.",
    },
    {
      question: "Can flags still sit over the Blue Lagoon emoji artwork?",
      answer:
        "Yes. The artwork remains in the background layer, so the flag stays visible above the emoji tile.",
    },
  ],
  translations: {
    fr: {
      name: "Lagon Bleu",
      description:
        "Un skin Démineur emoji bleu avec un pool d'emojis cachés de même couleur et des tuiles révélées fraîches et aérées.",
      longDescription:
        "Lagon Bleu garde chaque tuile non révélée du Démineur dans une palette d'emojis bleu, utilisant des icônes comme des cœurs bleus, des myrtilles, des poissons, des papillons, des vagues, des casquettes et des formes bleues. Le résultat est un look monochrome plus propre qui reste vivant parce que chaque cellule peut tourner à travers différents symboles bleus. Les tuiles révélées restent légères et aux tons froids pour préserver la lisibilité des nombres et maintenir un contraste fort contre les cellules cachées.",
      keywords: [
        "skin démineur emoji bleu",
        "thème démineur bleu",
        "démineur emoji océan",
        "skin jeu bleu même couleur",
        "thème démineur emoji frais",
        "démineur bleu monochrome",
      ],
    },
    es: {
      name: "Laguna Azul",
      description:
        "Un skin Buscaminas emoji azul con un pool de emojis ocultos del mismo color y baldosas reveladas frescas y aireadas.",
      longDescription:
        "Laguna Azul mantiene cada baldosa sin revelar del Buscaminas dentro de una paleta de emojis azul, usando iconos como corazones azules, arándanos, peces, mariposas, olas, gorras y formas azules. El resultado es un aspecto monocromático más limpio que sigue sintiéndose vivo porque cada celda puede rotar a través de diferentes símbolos azules. Las baldosas reveladas permanecen ligeras y en tonos fríos para preservar la legibilidad de los números y mantener un fuerte contraste contra las celdas ocultas.",
      keywords: [
        "skin buscaminas emoji azul",
        "tema buscaminas azul",
        "buscaminas emoji océano",
        "skin juego azul mismo color",
        "tema buscaminas emoji fresco",
        "buscaminas azul monocromático",
      ],
    },
  },
});
