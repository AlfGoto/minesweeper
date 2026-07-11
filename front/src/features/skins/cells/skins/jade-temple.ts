import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { defaultSkin } from "./default";
import { mulberry32, bgLayers } from "./utils";

export const jadeTempleSkin: CellSkinDefinition = {
  green:
    "bg-[linear-gradient(160deg,#0f3b2f_0%,#1d5f49_52%,#0d2a22_100%)] text-emerald-50 shadow-[inset_0_0_0_1px_rgba(110,231,183,0.24),inset_0_-8px_14px_rgba(4,47,46,0.4)]",
  lightGreen:
    "bg-[linear-gradient(160deg,#124336_0%,#236d55_52%,#103127_100%)] text-emerald-50 shadow-[inset_0_0_0_1px_rgba(167,243,208,0.22),inset_0_-8px_14px_rgba(4,47,46,0.42)]",
  gray: "bg-[linear-gradient(145deg,#d8efe6_0%,#c7e7d9_50%,#b6dccd_100%)] text-emerald-900 transition-none",
  silver:
    "bg-[linear-gradient(145deg,#e2f3eb_0%,#d1ebde_50%,#c2e1d3_100%)] text-emerald-900 transition-none",
  number: defaultSkin.number,
  flagEmoji: "⛩️",
  bombEmoji: "💥",
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 51749 + (col + 1) * 30269);
    if (rand() < 0.28) return undefined;

    const x = (14 + rand() * 72).toFixed(1);
    const y = (14 + rand() * 72).toFixed(1);
    const ring = (28 + rand() * 22).toFixed(2);
    const ringFade = (Number(ring) + 3 + rand() * 3).toFixed(2);
    const dot = (1.2 + rand() * 1.8).toFixed(2);
    const dotFade = (Number(dot) + 1 + rand() * 1.2).toFixed(2);
    const angle = Math.floor(rand() * 180);

    return bgLayers(
      `radial-gradient(circle at ${x}% ${y}%, rgba(16,185,129,0) 0 ${ring}%, rgba(16,185,129,0.24) ${ring}% ${ringFade}%, transparent ${ringFade}%)`,
      `radial-gradient(circle at ${x}% ${y}%, rgba(6,78,59,0.32) 0 ${dot}%, transparent ${dotFade}%)`,
      `linear-gradient(${angle}deg, rgba(5,150,105,0.07) 0, rgba(16,185,129,0.01) 58%, transparent 100%)`,
    );
  },
  name: "Jade Temple",
  slug: "jade-temple",
  description:
    "An elegant Asian-inspired theme featuring jade green tones, subtle stone textures, and traditional temple aesthetics.",
  longDescription:
    "Enter a serene temple sanctuary with the Jade Temple skin. This elegant theme draws inspiration from traditional Asian architecture with rich jade green unrevealed cells and warm stone-gray revealed tiles. Subtle texture variations evoke ancient temple floors worn smooth by centuries of meditation. The torii gate flag and explosion bomb emojis complete the Zen aesthetic. Perfect for players seeking a calm, focused gaming environment with sophisticated visual design.",
  keywords: [
    "jade minesweeper skin",
    "temple minesweeper theme",
    "asian minesweeper",
    "zen minesweeper skin",
    "green minesweeper theme",
    "elegant minesweeper design",
  ],
  translations: {
    fr: {
      name: "Temple de Jade",
      description:
        "Un thème élégant d'inspiration asiatique avec des tons vert jade, des textures de pierre subtiles et une esthétique de temple traditionnel.",
      longDescription:
        "Entrez dans un sanctuaire de temple serein avec le skin Temple de Jade. Ce thème élégant s'inspire de l'architecture asiatique traditionnelle avec des cellules non révélées vert jade riche et des tuiles révélées gris pierre chaudes. Les variations de texture subtiles évoquent les sols de temples anciens usés par des siècles de méditation. Les emojis drapeau torii et bombe explosion complètent l'esthétique Zen. Parfait pour les joueurs recherchant un environnement de jeu calme et concentré avec un design visuel sophistiqué.",
      keywords: [
        "skin démineur jade",
        "thème démineur temple",
        "démineur asiatique",
        "skin démineur zen",
        "thème démineur vert",
        "design démineur élégant",
      ],
    },
    es: {
      name: "Templo de Jade",
      description:
        "Un elegante tema de inspiración asiática con tonos verde jade, sutiles texturas de piedra y estética de templo tradicional.",
      longDescription:
        "Entra en un santuario de templo sereno con el skin Templo de Jade. Este elegante tema se inspira en la arquitectura asiática tradicional con celdas sin revelar verde jade rico y baldosas reveladas gris piedra cálidas. Las sutiles variaciones de textura evocan los suelos de templos antiguos desgastados por siglos de meditación. Los emojis bandera torii y bomba explosión completan la estética Zen. Perfecto para jugadores que buscan un entorno de juego tranquilo y enfocado con un diseño visual sofisticado.",
      keywords: [
        "skin buscaminas jade",
        "tema buscaminas templo",
        "buscaminas asiático",
        "skin buscaminas zen",
        "tema buscaminas verde",
        "diseño buscaminas elegante",
      ],
    },
  },
};
