import type { CSSProperties } from "react";
import type { BackgroundSkinData } from "./types";

// Same full-bleed construction technique as Deep Reef / Amber Dunes: a
// handful of soft gradients and a few scattered shell motifs sized to the
// whole viewport (no tiling), so there are no repeat seams. Matches the
// Beach cell skin's sand palette (#e8d5a3 / #f2e4b8) and coquillage.
const beachSandBackgroundStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle at 16% 22%, rgba(255,251,235,0.5) 0 10%, transparent 26%)",
    "radial-gradient(circle at 80% 18%, rgba(254,243,199,0.4) 0 11%, transparent 28%)",
    "radial-gradient(circle at 62% 72%, rgba(251,191,36,0.14) 0 15%, transparent 34%)",
    // a few coquillage accents, sized and placed once across the whole page
    "radial-gradient(ellipse 1.1% 0.7% at 24% 34%, rgba(255,250,240,0.95) 0 55%, transparent 90%)",
    "radial-gradient(circle at 24.3% 34.2%, rgba(150,110,60,0.35) 0 22%, transparent 58%)",
    "radial-gradient(ellipse 1% 0.65% at 70% 46%, rgba(255,250,240,0.92) 0 55%, transparent 90%)",
    "radial-gradient(circle at 70.3% 46.2%, rgba(150,110,60,0.32) 0 22%, transparent 58%)",
    "radial-gradient(ellipse 1.2% 0.75% at 42% 78%, rgba(255,225,235,0.85) 0 55%, transparent 90%)",
    "radial-gradient(circle at 42.3% 78.2%, rgba(219,39,119,0.22) 0 22%, transparent 58%)",
    "radial-gradient(ellipse 1% 0.65% at 87% 66%, rgba(255,250,240,0.9) 0 55%, transparent 90%)",
    "radial-gradient(circle at 87.3% 66.2%, rgba(150,110,60,0.3) 0 22%, transparent 58%)",
    "repeating-linear-gradient(170deg, rgba(180,120,60,0.06) 0 14px, rgba(245,200,140,0.02) 14px 30px, transparent 30px 52px)",
    "linear-gradient(155deg, #fdf6e3 0%, #f2e4b8 42%, #e8d5a3 72%, #dcc389 100%)",
  ].join(","),
  backgroundColor: "#eddcae",
};

export const beachSandSkin: BackgroundSkinData = {
  value: "bg-amber-100",
  style: beachSandBackgroundStyle,
  ogColor: "#eddcae",
  name: "Beach Sand",
  slug: "beach-sand-background",
  description:
    "A sun-warmed sand background skin inspired by the Beach cell skin, with coquillage scattered over a soft tan surface.",
  longDescription:
    "Beach Sand translates the shore half of the Beach cell skin into a page-wide backdrop. It tiles small shell motifs and a soft pink coquillage accent over fine sand-grain speckle on a warm tan-to-cream base, so the page reads like a sunlit beach without ever overwhelming the board and content sitting on top of it.",
  keywords: [
    "beach sand minesweeper background",
    "sand minesweeper background skin",
    "seashell minesweeper theme",
    "tan minesweeper background",
  ],
  faq: [
    {
      question: "What is the Beach Sand background skin in Minesweeper?",
      answer:
        "Beach Sand is a cosmetic background skin that pairs with the Beach cell skin, covering the page in warm tan sand scattered with small shell motifs.",
    },
    {
      question: "Does the Beach Sand background affect gameplay?",
      answer:
        "No. It is a cosmetic background option only, so gameplay behavior, difficulty, and mechanics stay exactly the same.",
    },
  ],
  translations: {
    fr: {
      name: "Sable de Plage",
      description:
        "Un fond de sable ensoleillé inspiré du skin de cellules Plage, avec des coquillages éparpillés sur une surface tan douce.",
      longDescription:
        "Sable de Plage transpose la moitié rivage du skin de cellules Plage en un arrière-plan de page. Il superpose de petits motifs de coquillages et une touche rose de coquillage sur un fin grain de sable, sur une base allant du tan chaud à la crème, pour que la page évoque une plage ensoleillée sans jamais dominer le plateau et le contenu posés dessus.",
      keywords: [
        "fond démineur sable plage",
        "fond démineur sable",
        "thème démineur coquillage",
        "fond démineur tan",
      ],
      faq: [
        {
          question: "Qu'est-ce que le skin de fond Sable de Plage dans le Démineur ?",
          answer:
            "Sable de Plage est un skin de fond cosmétique qui s'associe au skin de cellules Plage, recouvrant la page de sable tan chaud parsemé de petits motifs de coquillages.",
        },
        {
          question: "Le fond Sable de Plage affecte-t-il le gameplay ?",
          answer:
            "Non. C'est uniquement une option de fond cosmétique, donc le comportement du jeu, la difficulté et les mécaniques restent exactement les mêmes.",
        },
      ],
    },
    es: {
      name: "Arena de Playa",
      description:
        "Un fondo de arena soleada inspirado en el skin de celdas Playa, con conchas esparcidas sobre una superficie tan suave.",
      longDescription:
        "Arena de Playa traduce la mitad costera del skin de celdas Playa en un fondo de página. Superpone pequeños motivos de conchas y un toque rosado de concha sobre un fino grano de arena, en una base que va del tan cálido al crema, para que la página se sienta como una playa soleada sin dominar nunca el tablero y el contenido que hay encima.",
      keywords: [
        "fondo buscaminas arena playa",
        "fondo buscaminas arena",
        "tema buscaminas concha",
        "fondo buscaminas tan",
      ],
      faq: [
        {
          question: "¿Qué es el skin de fondo Arena de Playa en Buscaminas?",
          answer:
            "Arena de Playa es un skin de fondo cosmético que combina con el skin de celdas Playa, cubriendo la página de arena tan cálida salpicada de pequeños motivos de conchas.",
        },
        {
          question: "¿El fondo Arena de Playa afecta el gameplay?",
          answer:
            "No. Es solo una opción de fondo cosmético, así que el comportamiento del juego, la dificultad y las mecánicas permanecen exactamente iguales.",
        },
      ],
    },
  },
};
