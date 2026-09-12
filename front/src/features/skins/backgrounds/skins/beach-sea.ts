import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

// Same full-bleed construction technique as Deep Reef / Amber Dunes: a
// handful of soft gradients sized to the whole viewport (no tiling), so
// there are no repeat seams. Matches the Beach cell skin's sea palette
// (#1c6e8c / #3aa6c4).
const beachSeaBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.16) 0 8%, transparent 24%)",
    "radial-gradient(circle at 72% 14%, rgba(186,230,253,0.2) 0 9%, transparent 26%)",
    "radial-gradient(circle at 60% 68%, rgba(255,255,255,0.12) 0 12%, transparent 32%)",
    "radial-gradient(circle at 12% 78%, rgba(103,232,249,0.14) 0 10%, transparent 28%)",
    "linear-gradient(124deg, rgba(255,255,255,0.12) 0%, transparent 26%, transparent 68%, rgba(255,255,255,0.1) 100%)",
    "linear-gradient(64deg, rgba(255,255,255,0.08) 0%, transparent 22%, transparent 58%, rgba(255,255,255,0.07) 100%)",
    "linear-gradient(165deg, #3aa6c4 0%, #227d9e 48%, #1c6e8c 100%)",
  ].join(","),
  backgroundColor: "#1c6e8c",
  backgroundBlendMode: "screen, screen, screen, screen, screen, screen, normal",
};

export const beachSeaSkin: BackgroundSkinData = {
  value: "bg-cyan-700",
  style: beachSeaBackgroundStyle,
  ogColor: "#2f93b5",
  name: "Beach Sea",
  slug: "beach-sea-background",
  description:
    "A tropical sea background skin inspired by the Beach cell skin, with rippling ocean blues and scattered foam flecks.",
  longDescription:
    "Beach Sea translates the ocean half of the Beach cell skin into a page-wide backdrop. It tiles small foam-fleck highlights and soft diagonal current streaks over a warm turquoise-to-deep-blue base, so the page reads like open water without ever overwhelming the board and content sitting on top of it.",
  keywords: [
    "beach sea minesweeper background",
    "ocean minesweeper background skin",
    "tropical sea minesweeper theme",
    "blue water minesweeper background",
  ],
  faq: [
    {
      question: "What is the Beach Sea background skin in Minesweeper?",
      answer:
        "Beach Sea is a cosmetic background skin that pairs with the Beach cell skin, covering the page in rippling turquoise-to-blue water with scattered foam flecks.",
    },
    {
      question: "Does the Beach Sea background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Mer de Plage",
      description:
        "Un fond de mer tropicale inspiré du skin de cellules Plage, avec des bleus océan ondulants et des mouchetures d'écume éparpillées.",
      longDescription:
        "Mer de Plage transpose la moitié océan du skin de cellules Plage en un arrière-plan de page. Il superpose de petites mouchetures d'écume et de douces stries de courant diagonales sur une base allant du turquoise au bleu profond, pour que la page évoque l'eau libre sans jamais dominer le plateau et le contenu posés dessus.",
      keywords: [
        "fond démineur mer plage",
        "fond démineur océan",
        "thème démineur mer tropicale",
        "fond démineur eau bleue",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Mer de Plage dans le Démineur ?",
          answer:
            "Mer de Plage est un skin de fond cosmétique qui s'associe au skin de cellules Plage, recouvrant la page d'eau turquoise à bleue ondulante avec des mouchetures d'écume éparpillées.",
        },
        {
          question: "Le fond Mer de Plage affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Mar de Playa",
      description:
        "Un fondo de mar tropical inspirado en el skin de celdas Playa, con azules oceánicos ondulantes y motas de espuma esparcidas.",
      longDescription:
        "Mar de Playa traduce la mitad marina del skin de celdas Playa en un fondo de página. Superpone pequeñas motas de espuma y suaves franjas de corriente diagonales sobre una base que va del turquesa al azul profundo, para que la página se sienta como mar abierto sin dominar nunca el tablero y el contenido que hay encima.",
      keywords: [
        "fondo buscaminas mar playa",
        "fondo buscaminas océano",
        "tema buscaminas mar tropical",
        "fondo buscaminas agua azul",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Mar de Playa en Buscaminas?",
          answer:
            "Mar de Playa es un skin de fondo cosmético que combina con el skin de celdas Playa, cubriendo la página de agua turquesa a azul profundo ondulante con motas de espuma esparcidas.",
        },
        {
          question: "¿El fondo Mar de Playa afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
