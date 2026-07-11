import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const fruitBasketSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Fruit Basket",
  slug: "fruit-basket",
  hiddenA:
    "bg-[linear-gradient(160deg,#14532d_0%,#052e16_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#166534_0%,#14532d_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#f7fee7_0%,#ecfccb_52%,#d9f99d_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(132,204,22,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fbffe9_0%,#f0fdd8_52%,#dcf7b1_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(101,163,13,0.14)]",
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
  emojis: ["🍎", "🍊", "🍋", "🍉", "🍓", "🍒", "🥝", "🍇"],
  glossRgb: "255,255,255",
  shadowRgb: "20,46,22",
  description:
    "A fresh fruit emoji Minesweeper skin with juicy unrevealed cells and crisp light revealed tiles for clear number reading.",
  longDescription:
    "The Fruit Basket skin turns hidden Minesweeper cells into a rotating mix of fruit emojis such as apples, oranges, lemons, watermelons, strawberries, cherries, kiwis, and grapes. Revealed cells stay crisp and lightly tinted so the board remains readable and the color contrast between hidden and revealed states stays obvious. Since the fruit art is painted into the background layer, flags still sit cleanly above the emoji artwork.",
  keywords: [
    "fruit minesweeper skin",
    "fruit emoji minesweeper",
    "food emoji minesweeper theme",
    "fresh minesweeper skin",
    "cute fruit game skin",
    "green minesweeper emoji theme",
  ],
  faq: [
    {
      question: "What is the Fruit Basket skin in Minesweeper?",
      answer:
        "Fruit Basket is a published Minesweeper skin that decorates unrevealed cells with large fruit emoji artwork while keeping revealed cells light and easy to scan.",
    },
    {
      question: "Which emojis appear in the Fruit Basket skin?",
      answer:
        "The Fruit Basket skin uses a seeded mix of fruit emojis including apples, oranges, lemons, watermelons, strawberries, cherries, kiwis, and grapes.",
    },
    {
      question:
        "Does the Fruit Basket skin still support normal flag placement?",
      answer:
        "Yes. The fruit emoji graphics are rendered behind the gameplay content, so flags remain clearly visible on top of hidden cells.",
    },
  ],
  translations: {
    fr: {
      name: "Panier de Fruits",
      description:
        "Un skin Démineur emoji fruit frais avec des cellules non révélées juteuses et des tuiles révélées légères et nettes pour une lecture claire des nombres.",
      longDescription:
        "Le skin Panier de Fruits transforme les cellules cachées du Démineur en un mélange tournant d'emojis fruits tels que pommes, oranges, citrons, pastèques, fraises, cerises, kiwis et raisins. Les cellules révélées restent nettes et légèrement teintées pour que le plateau reste lisible et que le contraste de couleur entre les états cachés et révélés reste évident. Puisque l'art des fruits est peint dans le calque d'arrière-plan, les drapeaux restent proprement au-dessus de l'art emoji.",
      keywords: [
        "skin démineur fruit",
        "démineur emoji fruit",
        "thème démineur emoji nourriture",
        "skin démineur frais",
        "skin jeu fruit mignon",
        "thème démineur emoji vert",
      ],
    },
    es: {
      name: "Cesta de Frutas",
      description:
        "Un skin Buscaminas emoji fruta fresco con celdas sin revelar jugosas y baldosas reveladas ligeras y nítidas para una lectura clara de números.",
      longDescription:
        "El skin Cesta de Frutas convierte las celdas ocultas del Buscaminas en una mezcla rotativa de emojis de frutas como manzanas, naranjas, limones, sandías, fresas, cerezas, kiwis y uvas. Las celdas reveladas permanecen nítidas y ligeramente teñidas para que el tablero siga siendo legible y el contraste de color entre estados ocultos y revelados permanezca obvio. Dado que el arte de las frutas se pinta en la capa de fondo, las banderas permanecen limpiamente sobre el arte emoji.",
      keywords: [
        "skin buscaminas fruta",
        "buscaminas emoji fruta",
        "tema buscaminas emoji comida",
        "skin buscaminas fresco",
        "skin juego fruta lindo",
        "tema buscaminas emoji verde",
      ],
    },
  },
});
