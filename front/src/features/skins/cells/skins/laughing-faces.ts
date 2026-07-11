import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const laughingFacesSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Laughing Faces",
  slug: "laughing-faces",
  hiddenA:
    "bg-[linear-gradient(160deg,#854d0e_0%,#713f12_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#a16207_0%,#78350f_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#fffbe8_0%,#fef3c7_52%,#fde68a_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fffdf0_0%,#fef7d7_52%,#fdeca6_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.15)]",
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
  emojis: ["😂", "🤣", "😆", "😄", "😹", "😅"],
  glossRgb: "255,255,255",
  shadowRgb: "120,53,15",
  description:
    "A cheerful emoji Minesweeper skin with laughing faces on unrevealed cells and sunny revealed tiles designed to stay easy to read.",
  longDescription:
    "The Laughing Faces skin gives hidden Minesweeper cells a bright, playful personality with oversized laughing emoji backgrounds. Revealed cells stay clean and warm-toned so the grid remains readable even when you are scanning quickly. The emoji art sits behind the gameplay content, which means flags still appear clearly on top and the board keeps the same functional logic as other published skins.",
  keywords: [
    "laughing emoji minesweeper skin",
    "funny minesweeper theme",
    "laughing faces minesweeper",
    "happy emoji game skin",
    "yellow minesweeper theme",
    "playful minesweeper skin",
  ],
  faq: [
    {
      question: "What is the Laughing Faces skin in Minesweeper?",
      answer:
        "Laughing Faces is a published Minesweeper skin that uses large laughing emoji artwork on unrevealed cells and bright neutral reveals for better readability.",
    },
    {
      question: "Can I still flag cells with the Laughing Faces theme?",
      answer:
        "Yes. The emoji faces are rendered behind the gameplay layer, so flags stay visible and do not get replaced by the artwork.",
    },
    {
      question:
        "Why does the Laughing Faces skin keep revealed cells simple?",
      answer:
        "The clean revealed tiles help preserve quick board scanning, which is important in Minesweeper when you need to read numbers and patterns at a glance.",
    },
  ],
  translations: {
    fr: {
      name: "Visages Rieurs",
      description:
        "Un skin Démineur emoji joyeux avec des visages rieurs sur les cellules non révélées et des tuiles révélées ensoleillées conçues pour rester faciles à lire.",
      longDescription:
        "Le skin Visages Rieurs donne aux cellules cachées du Démineur une personnalité vive et ludique avec de grands fonds emoji rieurs surdimensionnés. Les cellules révélées restent propres et aux tons chauds pour que la grille reste lisible même lorsque vous scannez rapidement. L'art emoji est placé derrière le contenu du gameplay, ce qui signifie que les drapeaux apparaissent toujours clairement par-dessus et que le plateau garde la même logique fonctionnelle que les autres skins publiés.",
      keywords: [
        "skin démineur emoji rieur",
        "thème démineur drôle",
        "démineur visages rieurs",
        "skin jeu emoji joyeux",
        "thème démineur jaune",
        "skin démineur ludique",
      ],
    },
    es: {
      name: "Caras Risueñas",
      description:
        "Un skin Buscaminas emoji alegre con caras risueñas en las celdas sin revelar y baldosas reveladas soleadas diseñadas para mantenerse fáciles de leer.",
      longDescription:
        "El skin Caras Risueñas da a las celdas ocultas del Buscaminas una personalidad brillante y lúdica con grandes fondos emoji risueños sobredimensionados. Las celdas reveladas permanecen limpias y en tonos cálidos para que la cuadrícula siga siendo legible incluso cuando escaneas rápidamente. El arte emoji se coloca detrás del contenido del gameplay, lo que significa que las banderas siguen apareciendo claramente encima y el tablero mantiene la misma lógica funcional que otros skins publicados.",
      keywords: [
        "skin buscaminas emoji risueño",
        "tema buscaminas divertido",
        "buscaminas caras risueñas",
        "skin juego emoji feliz",
        "tema buscaminas amarillo",
        "skin buscaminas lúdico",
      ],
    },
  },
});
