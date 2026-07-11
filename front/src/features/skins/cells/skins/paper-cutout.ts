import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32, bgLayers } from "./utils";

export const paperCutoutSkin: CellSkinDefinition = {
  green:
    "bg-[linear-gradient(160deg,#f9ecda_0%,#f4e2c6_52%,#ead3b0_100%)] text-amber-950",
  lightGreen:
    "bg-[linear-gradient(160deg,#fcf1de_0%,#f7e7cb_52%,#edd8b8_100%)] text-amber-950",
  gray: "bg-[linear-gradient(145deg,#fffdfa_0%,#fbf4e8_52%,#f3e8d7_100%)] text-amber-950 transition-none",
  silver:
    "bg-[linear-gradient(145deg,#fffefb_0%,#fcf8ee_52%,#f6ecdd_100%)] text-amber-950 transition-none",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-green-700",
    3: "text-red-700",
    4: "text-purple-700",
    5: "text-yellow-700",
    6: "text-cyan-700",
    7: "text-orange-700",
    8: "text-stone-700",
  },
  flagEmoji: "📌",
  bombEmoji: "✂️",
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 28069 + (col + 1) * 76157);
    const stripeAlpha = (0.04 + rand() * 0.05).toFixed(2);
    const grainAlpha = (0.03 + rand() * 0.04).toFixed(2);
    const tearY = (20 + rand() * 58).toFixed(1);

    return bgLayers(
      `repeating-linear-gradient(${Math.floor(rand() * 25)}deg, rgba(146,64,14,${stripeAlpha}) 0 1px, transparent 1px 8px)`,
      `linear-gradient(180deg, transparent 0 ${tearY}%, rgba(120,53,15,0.06) ${tearY}% calc(${tearY}% + 1.2%), transparent calc(${tearY}% + 1.2%) 100%)`,
      `radial-gradient(circle at ${Math.floor(15 + rand() * 70)}% ${Math.floor(15 + rand() * 70)}%, rgba(255,255,255,${grainAlpha}) 0 12%, transparent 24%)`,
    );
  },
  name: "Paper Cutout",
  slug: "paper-cutout",
  description:
    "A playful papercraft aesthetic with layered shadows, soft pastel colors, and a handcrafted arts-and-crafts feel.",
  longDescription:
    "Discover the charming Paper Cutout skin that transforms Minesweeper into a delightful papercraft creation. Unrevealed cells feature soft pastel cream tones with subtle layered stripe effects, while revealed areas display warm craft paper tones. The entire design evokes the feeling of a lovingly handmade art project. Pin flag and scissors bomb emojis add to the playful atmosphere. Ideal for players who appreciate whimsical, artistic game aesthetics.",
  keywords: [
    "paper minesweeper skin",
    "cutout minesweeper theme",
    "craft minesweeper",
    "pastel minesweeper skin",
    "artistic minesweeper theme",
    "handmade minesweeper design",
  ],
  translations: {
    fr: {
      name: "Découpage Papier",
      description:
        "Une esthétique de bricolage papier ludique avec des ombres superposées, des couleurs pastel douces et une sensation artisanale faite main.",
      longDescription:
        "Découvrez le charmant skin Découpage Papier qui transforme le Démineur en une délicieuse création de bricolage papier. Les cellules non révélées présentent des tons crème pastel doux avec des effets de rayures superposées subtils, tandis que les zones révélées affichent des tons de papier kraft chauds. L'ensemble du design évoque la sensation d'un projet artistique fait avec amour. Les emojis drapeau punaise et bombe ciseaux ajoutent à l'atmosphère ludique. Idéal pour les joueurs qui apprécient les esthétiques de jeu fantaisistes et artistiques.",
      keywords: [
        "skin démineur papier",
        "thème démineur découpage",
        "démineur bricolage",
        "skin démineur pastel",
        "thème démineur artistique",
        "design démineur fait main",
      ],
    },
    es: {
      name: "Recorte de Papel",
      description:
        "Una estética de manualidades de papel lúdica con sombras superpuestas, colores pastel suaves y una sensación artesanal hecha a mano.",
      longDescription:
        "Descubre el encantador skin Recorte de Papel que transforma el Buscaminas en una deliciosa creación de manualidades de papel. Las celdas sin revelar presentan tonos crema pastel suaves con sutiles efectos de rayas superpuestas, mientras que las áreas reveladas muestran tonos de papel kraft cálidos. Todo el diseño evoca la sensación de un proyecto artístico hecho con cariño. Los emojis bandera chincheta y bomba tijeras añaden a la atmósfera lúdica. Ideal para jugadores que aprecian estéticas de juego caprichosas y artísticas.",
      keywords: [
        "skin buscaminas papel",
        "tema buscaminas recorte",
        "buscaminas manualidades",
        "skin buscaminas pastel",
        "tema buscaminas artístico",
        "diseño buscaminas hecho a mano",
      ],
    },
  },
};
