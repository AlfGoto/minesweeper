import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const greenGardenSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Green Garden",
  slug: "green-garden",
  hiddenA:
    "bg-[linear-gradient(160deg,#166534_0%,#14532d_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#15803d_0%,#166534_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#f7fee7_0%,#ecfccb_52%,#d9f99d_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(132,204,22,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fbffef_0%,#f0fdd8_52%,#dcf7b1_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(101,163,13,0.14)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-emerald-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-amber-700",
    6: "text-teal-700",
    7: "text-orange-700",
    8: "text-stone-700",
  },
  emojis: ["💚", "🍀", "🌵", "🥝", "🐢", "🐸", "🟢", "🍏"],
  glossRgb: "255,255,255",
  shadowRgb: "20,46,22",
  description:
    "A green emoji Minesweeper skin with same-color hidden tiles and fresh readable reveals.",
  longDescription:
    "Green Garden gives unrevealed Minesweeper cells a monochrome green emoji pool built from clovers, cacti, kiwis, turtles, frogs, green hearts, apples, and green shapes. Every hidden tile stays in the same color family, which makes the board feel calm and coherent. Revealed tiles remain simple and lightly tinted so numbers stand out and flags stay easy to identify above the artwork.",
  keywords: [
    "green emoji minesweeper skin",
    "green minesweeper theme",
    "garden emoji minesweeper",
    "same color green emoji skin",
    "nature minesweeper emoji theme",
    "monochrome green game skin",
  ],
  faq: [
    {
      question: "What is the Green Garden skin in Minesweeper?",
      answer:
        "Green Garden is a published Minesweeper skin that uses only green-themed emojis on hidden cells for a calm color-coded board.",
    },
    {
      question:
        "Are all emojis in Green Garden part of the same color family?",
      answer:
        "Yes. Its unrevealed tiles use a seeded set of green emojis so the theme stays visually consistent across the grid.",
    },
    {
      question: "Does Green Garden change how flags work?",
      answer:
        "No. Flags still work the same way and remain visible because the emoji artwork is placed in the background layer.",
    },
  ],
  translations: {
    fr: {
      name: "Jardin Vert",
      description:
        "Un skin Démineur emoji vert avec des tuiles cachées de même couleur et des révélations fraîches et lisibles.",
      longDescription:
        "Jardin Vert donne aux cellules non révélées du Démineur un pool d'emojis vert monochrome construit à partir de trèfles, cactus, kiwis, tortues, grenouilles, cœurs verts, pommes et formes vertes. Chaque tuile cachée reste dans la même famille de couleurs, ce qui rend le plateau calme et cohérent. Les tuiles révélées restent simples et légèrement teintées pour que les nombres ressortent et les drapeaux restent faciles à identifier au-dessus de l'art.",
      keywords: [
        "skin démineur emoji vert",
        "thème démineur vert",
        "démineur emoji jardin",
        "skin emoji vert même couleur",
        "thème démineur emoji nature",
        "skin jeu vert monochrome",
      ],
    },
    es: {
      name: "Jardín Verde",
      description:
        "Un skin Buscaminas emoji verde con baldosas ocultas del mismo color y revelaciones frescas y legibles.",
      longDescription:
        "Jardín Verde da a las celdas sin revelar del Buscaminas un pool de emojis verde monocromático construido a partir de tréboles, cactus, kiwis, tortugas, ranas, corazones verdes, manzanas y formas verdes. Cada baldosa oculta permanece en la misma familia de colores, lo que hace que el tablero se sienta tranquilo y coherente. Las baldosas reveladas permanecen simples y ligeramente teñidas para que los números destaquen y las banderas sigan siendo fáciles de identificar sobre el arte.",
      keywords: [
        "skin buscaminas emoji verde",
        "tema buscaminas verde",
        "buscaminas emoji jardín",
        "skin emoji verde mismo color",
        "tema buscaminas emoji naturaleza",
        "skin juego verde monocromático",
      ],
    },
  },
});
