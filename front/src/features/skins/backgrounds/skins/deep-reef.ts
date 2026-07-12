import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const deepReefBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 22% 24%, rgba(255,255,255,0.13) 0 7%, transparent 22%)",
    "radial-gradient(circle at 76% 16%, rgba(186,230,253,0.18) 0 8%, transparent 24%)",
    "radial-gradient(circle at 64% 72%, rgba(34,211,238,0.14) 0 12%, transparent 30%)",
    "linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%, rgba(125,211,252,0.12) 42%, rgba(255,255,255,0) 62%)",
    "linear-gradient(62deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 24%, rgba(34,211,238,0.1) 36%, rgba(255,255,255,0) 54%)",
    "linear-gradient(160deg, #082f49 0%, #0f766e 46%, #042f2e 100%)",
  ].join(","),
  backgroundColor: "#0f766e",
  backgroundBlendMode: "screen, screen, screen, screen, screen, normal",
};

export const deepReefSkin: BackgroundSkinData = {
  value: "bg-cyan-950",
  style: deepReefBackgroundStyle,
  name: "Deep Reef",
  slug: "deep-reef-background",
  description:
    "An underwater-style background with teal depth, cool caustic light bands, and reef-like atmosphere.",
  longDescription:
    "Deep Reef is designed to feel submerged and luminous at the same time. It layers dark ocean blues with moving-looking aqua highlights and soft reef glows, creating a calmer aquatic alternative to the colder Igloo background.",
  keywords: [
    "underwater minesweeper background",
    "ocean game background skin",
    "reef themed minesweeper background",
  ],
  faq: [
    {
      question: "What is the Deep Reef background skin in Minesweeper?",
      answer:
        "Deep Reef is an underwater-style background skin with teal depth and cool caustic light bands.",
    },
    {
      question: "Does the Deep Reef background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Récif Profond",
      description:
        "Un fond de style sous-marin avec une profondeur turquoise, des bandes de lumière caustique fraîches et une atmosphère de récif.",
      longDescription:
        "Récif Profond est conçu pour se sentir submergé et lumineux en même temps. Il superpose des bleus océan sombres avec des reflets aqua semblant bouger et des lueurs de récif douces, créant une alternative aquatique plus calme au fond Igloo plus froid.",
      keywords: [
        "fond démineur sous-marin",
        "skin fond jeu océan",
        "fond démineur thème récif",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Récif Profond dans le Démineur ?",
          answer:
            "Récif Profond est un skin de fond de style sous-marin avec une profondeur turquoise et des bandes de lumière caustique fraîches.",
        },
        {
          question: "Le fond Récif Profond affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Arrecife Profundo",
      description:
        "Un fondo de estilo submarino con profundidad turquesa, bandas de luz cáustica frescas y atmósfera de arrecife.",
      longDescription:
        "Arrecife Profundo está diseñado para sentirse sumergido y luminoso al mismo tiempo. Superpone azules de océano oscuro con reflejos aqua que parecen moverse y brillos de arrecife suaves, creando una alternativa acuática más tranquila al fondo Iglú más frío.",
      keywords: [
        "fondo buscaminas submarino",
        "skin fondo juego océano",
        "fondo buscaminas tema arrecife",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Arrecife Profundo en Buscaminas?",
          answer:
            "Arrecife Profundo es un skin de fondo de estilo submarino con profundidad turquesa y bandas de luz cáustica frescas.",
        },
        {
          question: "¿El fondo Arrecife Profundo afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
