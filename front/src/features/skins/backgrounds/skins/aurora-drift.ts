import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

const auroraDriftBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 18% 16%, rgba(56,189,248,0.2) 0 12%, transparent 28%)",
    "radial-gradient(circle at 82% 12%, rgba(129,140,248,0.2) 0 11%, transparent 28%)",
    "radial-gradient(circle at 68% 78%, rgba(45,212,191,0.16) 0 14%, transparent 32%)",
    "linear-gradient(118deg, transparent 22%, rgba(45,212,191,0.18) 36%, rgba(34,197,94,0.08) 48%, transparent 62%)",
    "linear-gradient(132deg, transparent 28%, rgba(96,165,250,0.22) 42%, rgba(192,132,252,0.12) 54%, transparent 68%)",
    "linear-gradient(160deg, rgba(8,47,73,0.94) 0%, rgba(15,23,42,0.98) 52%, rgba(3,7,18,1) 100%)",
  ].join(","),
  backgroundColor: "#0f172a",
  backgroundBlendMode: "screen, screen, screen, screen, screen, normal",
};

export const auroraDriftSkin: BackgroundSkinData = {
  value: "bg-slate-950",
  style: auroraDriftBackgroundStyle,
  name: "Aurora Drift",
  slug: "aurora-drift-background",
  description:
    "A dark atmospheric background with northern-light ribbons, deep midnight tones, and soft cold glows.",
  longDescription:
    "Aurora Drift is built around the feeling of playing Minesweeper beneath a polar night sky. It mixes deep navy shadows with floating teal, blue, and violet aurora bands so the page feels moody, luminous, and cinematic without becoming too noisy behind the interface.",
  keywords: [
    "aurora minesweeper background",
    "northern lights game background",
    "dark atmospheric minesweeper theme",
  ],
  faq: [
    {
      question: "What is the Aurora Drift background skin in Minesweeper?",
      answer:
        "Aurora Drift is a dark background skin featuring northern-light ribbons and deep midnight tones for a moody, cinematic atmosphere.",
    },
    {
      question: "Does the Aurora Drift background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Dérive Aurore",
      description:
        "Un fond atmosphérique sombre avec des rubans d'aurores boréales, des tons de minuit profonds et des lueurs froides douces.",
      longDescription:
        "Dérive Aurore est construit autour de la sensation de jouer au Démineur sous un ciel polaire nocturne. Il mélange des ombres bleu marine profondes avec des bandes d'aurore flottantes turquoise, bleues et violettes pour que la page soit d'humeur maussade, lumineuse et cinématique sans devenir trop bruyante derrière l'interface.",
      keywords: [
        "fond démineur aurore",
        "fond jeu aurores boréales",
        "thème démineur atmosphérique sombre",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Dérive Aurore dans le Démineur ?",
          answer:
            "Dérive Aurore est un skin de fond sombre présentant des rubans d'aurores boréales et des tons de minuit profonds pour une atmosphère maussade et cinématique.",
        },
        {
          question: "Le fond Dérive Aurore affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Deriva Aurora",
      description:
        "Un fondo atmosférico oscuro con cintas de auroras boreales, tonos de medianoche profundos y brillos fríos suaves.",
      longDescription:
        "Deriva Aurora está construido alrededor de la sensación de jugar Buscaminas bajo un cielo polar nocturno. Mezcla sombras azul marino profundas con bandas de aurora flotantes en turquesa, azul y violeta para que la página se sienta melancólica, luminosa y cinematográfica sin volverse demasiado ruidosa detrás de la interfaz.",
      keywords: [
        "fondo buscaminas aurora",
        "fondo juego auroras boreales",
        "tema buscaminas atmosférico oscuro",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Deriva Aurora en Buscaminas?",
          answer:
            "Deriva Aurora es un skin de fondo oscuro con cintas de auroras boreales y tonos de medianoche profundos para una atmósfera melancólica y cinematográfica.",
        },
        {
          question: "¿El fondo Deriva Aurora afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
