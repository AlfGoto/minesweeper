import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const amberDunesBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 14% 18%, rgba(255,251,235,0.55) 0 9%, transparent 24%)",
    "radial-gradient(circle at 82% 24%, rgba(254,243,199,0.42) 0 11%, transparent 28%)",
    "radial-gradient(circle at 61% 74%, rgba(251,191,36,0.14) 0 15%, transparent 34%)",
    "repeating-linear-gradient(170deg, rgba(180,83,9,0.08) 0 14px, rgba(245,158,11,0.02) 14px 30px, transparent 30px 52px)",
    "linear-gradient(155deg, #fff7ed 0%, #fde68a 42%, #fdba74 72%, #fb923c 100%)",
  ].join(","),
  backgroundColor: "#fde68a",
};

export const amberDunesSkin: BackgroundSkinData = {
  value: "bg-amber-200",
  style: amberDunesBackgroundStyle,
  name: "Amber Dunes",
  slug: "amber-dunes-background",
  description:
    "A warm desert-inspired background with sandy gradients, sunlit haze, and subtle dune-like texture lines.",
  longDescription:
    "Amber Dunes wraps the page in a sun-baked palette of cream, gold, amber, and orange. The layered streaks imitate soft dune ridges, giving the backdrop a warm windswept look that feels calm rather than harsh.",
  keywords: [
    "desert minesweeper background",
    "warm sand game theme",
    "amber dunes background skin",
  ],
  faq: [
    {
      question: "What is the Amber Dunes background skin in Minesweeper?",
      answer:
        "Amber Dunes is a warm desert-inspired background skin with sandy gradients and subtle dune-like textures.",
    },
    {
      question: "Does the Amber Dunes background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Dunes Ambrées",
      description:
        "Un fond inspiré du désert chaud avec des dégradés de sable, une brume ensoleillée et des lignes de texture subtiles comme des dunes.",
      longDescription:
        "Dunes Ambrées enveloppe la page dans une palette cuite au soleil de crème, or, ambre et orange. Les stries superposées imitent des crêtes de dunes douces, donnant à l'arrière-plan un look balayé par le vent chaud qui semble calme plutôt que rude.",
      keywords: [
        "fond démineur désert",
        "thème jeu sable chaud",
        "skin fond dunes ambrées",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Dunes Ambrées dans le Démineur ?",
          answer:
            "Dunes Ambrées est un skin de fond chaud inspiré du désert avec des dégradés de sable et des textures subtiles comme des dunes.",
        },
        {
          question: "Le fond Dunes Ambrées affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Dunas Ámbar",
      description:
        "Un fondo cálido inspirado en el desierto con gradientes de arena, neblina soleada y líneas de textura sutiles como dunas.",
      longDescription:
        "Dunas Ámbar envuelve la página en una paleta horneada por el sol de crema, oro, ámbar y naranja. Las franjas superpuestas imitan crestas de dunas suaves, dando al fondo un aspecto cálido barrido por el viento que se siente tranquilo en lugar de duro.",
      keywords: [
        "fondo buscaminas desierto",
        "tema juego arena cálida",
        "skin fondo dunas ámbar",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Dunas Ámbar en Buscaminas?",
          answer:
            "Dunas Ámbar es un skin de fondo cálido inspirado en el desierto con gradientes de arena y texturas sutiles como dunas.",
        },
        {
          question: "¿El fondo Dunas Ámbar afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
