import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const emojiTilesSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Emoji Tiles",
  slug: "emoji-tiles",
  hiddenA:
    "bg-[linear-gradient(160deg,#1f2937_0%,#111827_100%)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#273449_0%,#172033_100%)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#f7f7f5_0%,#efeee9_52%,#e6e3db_100%)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]",
  revealedB:
    "bg-[linear-gradient(145deg,#ffffff_0%,#f7f5f0_52%,#eeebe3_100%)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-emerald-700",
    3: "text-rose-700",
    4: "text-violet-700",
    5: "text-amber-700",
    6: "text-cyan-700",
    7: "text-orange-700",
    8: "text-slate-700",
  },
  emojis: ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛"],
  glossRgb: "255,255,255",
  shadowRgb: "15,23,42",
  description:
    "A playful emoji Minesweeper skin with full-cell square emoji backgrounds on unrevealed tiles and clean revealed cells for sharp readability.",
  longDescription:
    "The Emoji Tiles skin turns every unrevealed Minesweeper cell into a bold square emoji tile while keeping revealed cells clean, bright, and easy to scan. The emoji art is rendered in the background layer, so flags still sit clearly on top of hidden cells instead of being covered. That makes this skin playful without hurting gameplay clarity. It is ideal for players who want a fun emoji look, high contrast between hidden and revealed states, and readable number colors during fast games.",
  keywords: [
    "emoji minesweeper skin",
    "emoji tiles minesweeper",
    "square emoji minesweeper theme",
    "fun minesweeper skin",
    "playful minesweeper theme",
    "readable minesweeper skin",
  ],
  faq: [
    {
      question: "What is the Emoji Tiles skin in Minesweeper?",
      answer:
        "Emoji Tiles is a published Minesweeper skin that fills unrevealed cells with oversized square emoji artwork while keeping revealed cells clean and neutral for easier number reading.",
    },
    {
      question: "Can I still see flags on the Emoji Tiles skin?",
      answer:
        "Yes. The square emoji artwork is drawn in the cell background, so the flag stays visible on top of hidden cells and remains easy to recognize during play.",
    },
    {
      question: "Why are the revealed cells plain in the Emoji Tiles theme?",
      answer:
        "The revealed cells are intentionally simple so the contrast between hidden and revealed states stays strong and Minesweeper numbers remain readable at gameplay size.",
    },
  ],
  translations: {
    fr: {
      name: "Tuiles Emoji",
      description:
        "Un skin Démineur emoji ludique avec des fonds emoji carrés pleine cellule sur les tuiles non révélées et des cellules révélées propres pour une lisibilité nette.",
      longDescription:
        "Le skin Tuiles Emoji transforme chaque cellule non révélée du Démineur en une tuile emoji carrée audacieuse tout en gardant les cellules révélées propres, lumineuses et faciles à scanner. L'art emoji est rendu dans le calque d'arrière-plan, donc les drapeaux restent clairement visibles par-dessus les cellules cachées au lieu d'être couverts. Cela rend ce skin ludique sans nuire à la clarté du gameplay. Idéal pour les joueurs qui veulent un look emoji amusant, un contraste élevé entre les états cachés et révélés, et des couleurs de nombres lisibles pendant les parties rapides.",
      keywords: [
        "skin démineur emoji",
        "démineur tuiles emoji",
        "thème démineur emoji carré",
        "skin démineur amusant",
        "thème démineur ludique",
        "skin démineur lisible",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin Tuiles Emoji dans le Démineur ?",
          answer:
            "Tuiles Emoji est un skin Démineur publié qui remplit les cellules non révélées avec de grands emojis carrés tout en gardant les cellules révélées propres et neutres pour une lecture plus facile des nombres.",
        },
        {
          question: "Puis-je encore voir les drapeaux avec le skin Tuiles Emoji ?",
          answer:
            "Oui. L'art emoji carré est dessiné dans le fond de la cellule, donc le drapeau reste visible par-dessus les cellules cachées et reste facile à reconnaître pendant le jeu.",
        },
        {
          question: "Pourquoi les cellules révélées sont-elles simples dans le thème Tuiles Emoji ?",
          answer:
            "Les cellules révélées sont intentionnellement simples pour que le contraste entre les états cachés et révélés reste fort et que les nombres du Démineur restent lisibles à la taille du gameplay.",
        },
      ],
    },
    es: {
      name: "Azulejos Emoji",
      description:
        "Un skin Buscaminas emoji lúdico con fondos emoji cuadrados de celda completa en baldosas sin revelar y celdas reveladas limpias para una legibilidad nítida.",
      longDescription:
        "El skin Azulejos Emoji convierte cada celda sin revelar del Buscaminas en un audaz azulejo emoji cuadrado mientras mantiene las celdas reveladas limpias, brillantes y fáciles de escanear. El arte emoji se renderiza en la capa de fondo, por lo que las banderas permanecen claramente visibles sobre las celdas ocultas en lugar de quedar cubiertas. Esto hace que este skin sea lúdico sin perjudicar la claridad del gameplay. Ideal para jugadores que quieren un aspecto emoji divertido, alto contraste entre estados ocultos y revelados, y colores de números legibles durante partidas rápidas.",
      keywords: [
        "skin buscaminas emoji",
        "buscaminas azulejos emoji",
        "tema buscaminas emoji cuadrado",
        "skin buscaminas divertido",
        "tema buscaminas lúdico",
        "skin buscaminas legible",
      ],
      faq: [
        {
          question: "¿Qué es el skin Azulejos Emoji en Buscaminas?",
          answer:
            "Azulejos Emoji es un skin Buscaminas publicado que llena las celdas sin revelar con grandes emojis cuadrados mientras mantiene las celdas reveladas limpias y neutras para una lectura más fácil de los números.",
        },
        {
          question: "¿Puedo seguir viendo las banderas con el skin Azulejos Emoji?",
          answer:
            "Sí. El arte emoji cuadrado se dibuja en el fondo de la celda, por lo que la bandera permanece visible sobre las celdas ocultas y sigue siendo fácil de reconocer durante el juego.",
        },
        {
          question: "¿Por qué las celdas reveladas son simples en el tema Azulejos Emoji?",
          answer:
            "Las celdas reveladas son intencionalmente simples para que el contraste entre estados ocultos y revelados se mantenga fuerte y los números del Buscaminas permanezcan legibles al tamaño del gameplay.",
        },
      ],
    },
  },
});
