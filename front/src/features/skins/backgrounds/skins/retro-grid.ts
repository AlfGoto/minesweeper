import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const retroGridBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 50% 18%, rgba(251,191,36,0.22) 0 10%, transparent 24%)",
    "linear-gradient(180deg, rgba(244,114,182,0.22) 0%, rgba(244,114,182,0) 42%)",
    "linear-gradient(rgba(45,212,191,0.2) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(45,212,191,0.18) 1px, transparent 1px)",
    "linear-gradient(180deg, #1e1b4b 0%, #0f172a 55%, #020617 100%)",
  ].join(","),
  backgroundSize: "100% 100%, 100% 100%, 28px 28px, 28px 28px, 100% 100%",
  backgroundPosition: "center, center, center, center, center",
  backgroundColor: "#0f172a",
};

export const retroGridSkin: BackgroundSkinData = {
  value: "bg-indigo-950",
  style: retroGridBackgroundStyle,
  name: "Retro Grid",
  slug: "retro-grid-background",
  description:
    "A neon synthwave-style background with glowing grid lines, dusk gradients, and arcade energy.",
  longDescription:
    "Retro Grid is inspired by old arcade posters and synthwave landscapes. It combines a dark purple night base, a warm horizon glow, and cyan grid lines to create a playful futuristic backdrop that still keeps the app readable.",
  keywords: [
    "retro grid minesweeper background",
    "synthwave game background",
    "neon arcade minesweeper theme",
  ],
  faq: [
    {
      question: "What is the Retro Grid background skin in Minesweeper?",
      answer:
        "Retro Grid is a synthwave-inspired background skin with glowing grid lines and neon arcade energy.",
    },
    {
      question: "Does the Retro Grid background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Grille Rétro",
      description:
        "Un fond de style synthwave néon avec des lignes de grille lumineuses, des dégradés de crépuscule et une énergie d'arcade.",
      longDescription:
        "Grille Rétro est inspiré des vieilles affiches d'arcade et des paysages synthwave. Il combine une base de nuit violette sombre, une lueur chaude à l'horizon et des lignes de grille cyan pour créer un arrière-plan futuriste ludique qui garde l'application lisible.",
      keywords: [
        "fond démineur grille rétro",
        "fond jeu synthwave",
        "thème démineur arcade néon",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Grille Rétro dans le Démineur ?",
          answer:
            "Grille Rétro est un skin de fond inspiré du synthwave avec des lignes de grille lumineuses et une énergie d'arcade néon.",
        },
        {
          question: "Le fond Grille Rétro affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Rejilla Retro",
      description:
        "Un fondo de estilo synthwave neón con líneas de cuadrícula brillantes, gradientes de atardecer y energía de arcade.",
      longDescription:
        "Rejilla Retro está inspirado en viejos pósters de arcade y paisajes synthwave. Combina una base de noche púrpura oscura, un brillo cálido en el horizonte y líneas de cuadrícula cian para crear un fondo futurista divertido que mantiene la aplicación legible.",
      keywords: [
        "fondo buscaminas rejilla retro",
        "fondo juego synthwave",
        "tema buscaminas arcade neón",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Rejilla Retro en Buscaminas?",
          answer:
            "Rejilla Retro es un skin de fondo inspirado en synthwave con líneas de cuadrícula brillantes y energía de arcade neón.",
        },
        {
          question: "¿El fondo Rejilla Retro afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
