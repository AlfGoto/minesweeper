import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const iglooBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.78) 0 12%, transparent 30%)",
    "radial-gradient(circle at 78% 18%, rgba(255,255,255,0.58) 0 10%, transparent 28%)",
    "radial-gradient(circle at 36% 72%, rgba(255,255,255,0.65) 0 14%, transparent 34%)",
    "radial-gradient(circle at 88% 76%, rgba(219,234,254,0.85) 0 11%, transparent 29%)",
    "radial-gradient(circle at 15% 30%, rgba(255,255,255,0.92) 0 0.9%, transparent 1.8%)",
    "radial-gradient(circle at 42% 14%, rgba(255,255,255,0.88) 0 0.7%, transparent 1.4%)",
    "radial-gradient(circle at 67% 28%, rgba(255,255,255,0.9) 0 0.85%, transparent 1.7%)",
    "radial-gradient(circle at 84% 10%, rgba(255,255,255,0.82) 0 0.65%, transparent 1.3%)",
    "radial-gradient(circle at 24% 62%, rgba(255,255,255,0.86) 0 0.8%, transparent 1.6%)",
    "radial-gradient(circle at 58% 54%, rgba(255,255,255,0.84) 0 0.72%, transparent 1.45%)",
    "radial-gradient(circle at 74% 70%, rgba(255,255,255,0.9) 0 0.9%, transparent 1.75%)",
    "radial-gradient(circle at 91% 56%, rgba(255,255,255,0.82) 0 0.62%, transparent 1.25%)",
    "radial-gradient(circle at 8% 86%, rgba(255,255,255,0.86) 0 0.75%, transparent 1.5%)",
    "radial-gradient(circle at 46% 88%, rgba(255,255,255,0.92) 0 0.88%, transparent 1.72%)",
    "radial-gradient(circle at 82% 92%, rgba(255,255,255,0.84) 0 0.7%, transparent 1.4%)",
    "linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%, rgba(191,219,254,0.2) 100%)",
    "linear-gradient(180deg, #eff8ff 0%, #dbeafe 48%, #cfe8f7 100%)",
  ].join(","),
  backgroundSize:
    "100% 100%, 100% 100%, 100% 100%, 100% 100%, 24% 24%, 21% 21%, 26% 26%, 18% 18%, 22% 22%, 20% 20%, 24% 24%, 18% 18%, 23% 23%, 20% 20%, 25% 25%, 100% 100%, 100% 100%",
  backgroundPosition:
    "center, center, center, center, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, center, center",
  backgroundRepeat:
    "no-repeat, no-repeat, no-repeat, no-repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, no-repeat, no-repeat",
  backgroundColor: "#dbeafe",
};

export const iglooSkin: BackgroundSkinData = {
  value: "bg-sky-100",
  style: iglooBackgroundStyle,
  name: "Igloo Background",
  slug: "igloo-background",
  description:
    "A snowy background skin with icy blues, powder drifts, and scattered snow speckles inspired by the Igloo cell skin.",
  longDescription:
    "Igloo Background is built to make the whole page feel cold, airy, and snow-covered. It uses pale glacier blues, soft powder-like snow banks, and repeating white speckles to suggest falling or wind-swept snow without making the interface hard to read.",
  keywords: [
    "igloo minesweeper background",
    "snow minesweeper background",
    "winter minesweeper theme",
  ],
  faq: [
    {
      question: "What is the Igloo background skin in Minesweeper?",
      answer:
        "The Igloo background skin gives the page a cold, snowy atmosphere with icy blues and scattered snow speckles.",
    },
    {
      question: "Does the Igloo background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Fond Igloo",
      description:
        "Un skin de fond enneigé avec des bleus glacés, des congères poudreuses et des flocons de neige éparpillés inspiré du skin de cellules Igloo.",
      longDescription:
        "Le fond Igloo est conçu pour donner à toute la page une sensation froide, aérée et enneigée. Il utilise des bleus glacier pâles, des bancs de neige poudreuse douce et des mouchetures blanches répétées pour suggérer une neige tombante ou balayée par le vent sans rendre l'interface difficile à lire.",
      keywords: [
        "fond démineur igloo",
        "fond démineur neige",
        "thème démineur hiver",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Igloo dans le Démineur ?",
          answer:
            "Le skin de fond Igloo donne à la page une atmosphère froide et enneigée avec des bleus glacés et des flocons de neige éparpillés.",
        },
        {
          question: "Le fond Igloo affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Fondo Iglú",
      description:
        "Un skin de fondo nevado con azules helados, montículos de nieve en polvo y motas de nieve esparcidas inspirado en el skin de celdas Iglú.",
      longDescription:
        "El fondo Iglú está construido para hacer que toda la página se sienta fría, aireada y cubierta de nieve. Usa azules glaciares pálidos, bancos de nieve suave como polvo y motas blancas repetidas para sugerir nieve cayendo o arrastrada por el viento sin hacer la interfaz difícil de leer.",
      keywords: [
        "fondo buscaminas iglú",
        "fondo buscaminas nieve",
        "tema buscaminas invierno",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Iglú en Buscaminas?",
          answer:
            "El skin de fondo Iglú da a la página una atmósfera fría y nevada con azules helados y motas de nieve esparcidas.",
        },
        {
          question: "¿El fondo Iglú afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
