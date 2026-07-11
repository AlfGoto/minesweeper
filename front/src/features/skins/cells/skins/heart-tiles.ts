import type { CellSkinDefinition } from "./types";
import { createEmojiTileSkin } from "./utils";

export const heartTilesSkin: CellSkinDefinition = createEmojiTileSkin({
  name: "Heart Tiles",
  slug: "heart-tiles",
  hiddenA:
    "bg-[linear-gradient(160deg,#7f1d1d_0%,#4c0519_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  hiddenB:
    "bg-[linear-gradient(160deg,#9f1239_0%,#5b0823_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
  revealedA:
    "bg-[linear-gradient(145deg,#fff1f2_0%,#ffe4e6_52%,#fecdd3_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.16)]",
  revealedB:
    "bg-[linear-gradient(145deg,#fff7f7_0%,#ffeef2_52%,#ffd8e4_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,114,182,0.15)]",
  number: {
    0: "",
    1: "text-rose-700",
    2: "text-pink-700",
    3: "text-red-700",
    4: "text-fuchsia-700",
    5: "text-orange-700",
    6: "text-purple-700",
    7: "text-amber-700",
    8: "text-stone-700",
  },
  emojis: ["❤️", "💖", "💗", "💘", "💝", "🩷", "💜"],
  glossRgb: "255,255,255",
  shadowRgb: "76,5,25",
  description:
    "A romantic emoji Minesweeper skin with heart-filled unrevealed cells and soft pastel revealed tiles that keep the board readable.",
  longDescription:
    "The Heart Tiles skin fills hidden Minesweeper cells with oversized heart emojis while revealed cells stay soft, bright, and uncluttered. Because the heart artwork lives in the background layer, flags can still be placed clearly on top without losing visibility. The pink and rose palette makes the board feel playful and warm, while the simplified revealed tiles preserve contrast for fast decision-making.",
  keywords: [
    "heart minesweeper skin",
    "heart emoji minesweeper",
    "pink minesweeper theme",
    "cute minesweeper skin",
    "romantic minesweeper theme",
    "emoji heart game skin",
  ],
  faq: [
    {
      question: "What is the Heart Tiles skin in Minesweeper?",
      answer:
        "Heart Tiles is a published Minesweeper skin that covers unrevealed cells with large heart emoji artwork and keeps revealed cells simple and pastel-toned.",
    },
    {
      question: "Does the Heart Tiles skin make flags harder to see?",
      answer:
        "No. The heart emojis are part of the background, so the flag still appears on top and remains easy to identify during gameplay.",
    },
    {
      question: "Who is the Heart Tiles Minesweeper skin for?",
      answer:
        "It is ideal for players who want a cute, expressive, emoji-heavy board without sacrificing number readability or hidden-versus-revealed contrast.",
    },
  ],
  translations: {
    fr: {
      name: "Tuiles Cœur",
      description:
        "Un skin Démineur emoji romantique avec des cellules non révélées remplies de cœurs et des tuiles révélées pastel douces qui gardent le plateau lisible.",
      longDescription:
        "Le skin Tuiles Cœur remplit les cellules cachées du Démineur avec de grands emojis cœur surdimensionnés tandis que les cellules révélées restent douces, lumineuses et épurées. Parce que l'art des cœurs vit dans le calque d'arrière-plan, les drapeaux peuvent toujours être placés clairement par-dessus sans perdre en visibilité. La palette rose et rose rend le plateau ludique et chaleureux, tandis que les tuiles révélées simplifiées préservent le contraste pour une prise de décision rapide.",
      keywords: [
        "skin démineur cœur",
        "démineur emoji cœur",
        "thème démineur rose",
        "skin démineur mignon",
        "thème démineur romantique",
        "skin jeu emoji cœur",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin Tuiles Cœur dans le Démineur ?",
          answer:
            "Tuiles Cœur est un skin Démineur publié qui couvre les cellules non révélées avec de grands emojis cœur et garde les cellules révélées simples et aux tons pastel.",
        },
        {
          question: "Le skin Tuiles Cœur rend-il les drapeaux plus difficiles à voir ?",
          answer:
            "Non. Les emojis cœur font partie du fond, donc le drapeau apparaît toujours par-dessus et reste facile à identifier pendant le gameplay.",
        },
        {
          question: "À qui s'adresse le skin Tuiles Cœur du Démineur ?",
          answer:
            "Il est idéal pour les joueurs qui veulent un plateau mignon, expressif et rempli d'emojis sans sacrifier la lisibilité des nombres ou le contraste caché/révélé.",
        },
      ],
    },
    es: {
      name: "Azulejos Corazón",
      description:
        "Un skin Buscaminas emoji romántico con celdas sin revelar llenas de corazones y baldosas reveladas pastel suaves que mantienen el tablero legible.",
      longDescription:
        "El skin Azulejos Corazón llena las celdas ocultas del Buscaminas con grandes emojis de corazón sobredimensionados mientras las celdas reveladas permanecen suaves, brillantes y despejadas. Debido a que el arte de los corazones vive en la capa de fondo, las banderas aún se pueden colocar claramente encima sin perder visibilidad. La paleta rosa hace que el tablero se sienta lúdico y cálido, mientras que las baldosas reveladas simplificadas preservan el contraste para la toma de decisiones rápida.",
      keywords: [
        "skin buscaminas corazón",
        "buscaminas emoji corazón",
        "tema buscaminas rosa",
        "skin buscaminas lindo",
        "tema buscaminas romántico",
        "skin juego emoji corazón",
      ],
      faq: [
        {
          question: "¿Qué es el skin Azulejos Corazón en Buscaminas?",
          answer:
            "Azulejos Corazón es un skin Buscaminas publicado que cubre las celdas sin revelar con grandes emojis de corazón y mantiene las celdas reveladas simples y en tonos pastel.",
        },
        {
          question: "¿El skin Azulejos Corazón hace que las banderas sean más difíciles de ver?",
          answer:
            "No. Los emojis de corazón son parte del fondo, por lo que la bandera sigue apareciendo encima y sigue siendo fácil de identificar durante el gameplay.",
        },
        {
          question: "¿Para quién es el skin Azulejos Corazón del Buscaminas?",
          answer:
            "Es ideal para jugadores que quieren un tablero lindo, expresivo y lleno de emojis sin sacrificar la legibilidad de los números o el contraste oculto/revelado.",
        },
      ],
    },
  },
});
