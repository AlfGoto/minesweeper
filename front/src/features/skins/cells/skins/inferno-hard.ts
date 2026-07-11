import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32 } from "./utils";

export const infernoHardSkin: CellSkinDefinition = {
  green:
    "bg-[radial-gradient(circle_at_18%_92%,rgba(251,146,60,0.55)_0%,rgba(251,146,60,0.18)_22%,transparent_46%),radial-gradient(circle_at_82%_94%,rgba(248,113,113,0.48)_0%,rgba(248,113,113,0.14)_24%,transparent_48%),linear-gradient(155deg,#3f0303_0%,#680b0b_45%,#240101_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.28),inset_0_-12px_22px_rgba(0,0,0,0.45)]",
  lightGreen:
    "bg-[radial-gradient(circle_at_26%_88%,rgba(251,191,36,0.46)_0%,rgba(251,191,36,0.16)_22%,transparent_47%),radial-gradient(circle_at_74%_96%,rgba(251,113,133,0.5)_0%,rgba(251,113,133,0.14)_24%,transparent_48%),linear-gradient(155deg,#5f0606_0%,#861414_45%,#2f0202_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.26),inset_0_-12px_22px_rgba(0,0,0,0.5)]",
  gray: "bg-[linear-gradient(145deg,#2d0707_0%,#200505_52%,#160404_100%)] text-rose-100 transition-none",
  silver:
    "bg-[linear-gradient(145deg,#3a0a0a_0%,#280707_52%,#1d0505_100%)] text-rose-100 transition-none",
  number: {
    0: "",
    1: "text-sky-300",
    2: "text-lime-300",
    3: "text-yellow-400",
    4: "text-fuchsia-300",
    5: "text-amber-200",
    6: "text-pink-200",
    7: "text-orange-200",
    8: "text-zinc-200",
  },
  flagEmoji: "🚫",
  bombEmoji: "🔥",
  getOverlayClass: ({
    isHiddenOrFlagged,
  }: CellSkinPatternContext): string => {
    if (!isHiddenOrFlagged) return "";
    return "animate-[infernoFlame_1.7s_ease-in-out_infinite] [background-size:148%_158%,136%_148%,100%_100%]";
  },
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 7919 + (col + 1) * 15401);
    const delaySeconds = (rand() * 1.7).toFixed(2);

    return {
      animationDelay: `-${delaySeconds}s`,
      backgroundRepeat: "no-repeat",
    };
  },
  name: "Inferno",
  slug: "inferno",
  description:
    "A fiery volcanic theme with molten orange and crimson cells, ember particles, and dynamic heat effects for an intense gaming experience.",
  longDescription:
    "Ignite your Minesweeper sessions with the Inferno skin. This intense theme features deep crimson unrevealed cells with glowing ember particles and molten orange revealed tiles. Dynamic heat gradient effects simulate rising flames at cell edges. The fire emoji flag and explosion bomb perfectly complement the volcanic atmosphere. Designed for players who want an adrenaline-pumping visual experience that matches the high-stakes nature of Minesweeper gameplay.",
  keywords: [
    "fire minesweeper skin",
    "inferno minesweeper theme",
    "volcanic minesweeper",
    "lava minesweeper skin",
    "intense minesweeper theme",
    "dark minesweeper design",
  ],
  translations: {
    fr: {
      name: "Inferno",
      description:
        "Un thème volcanique ardent avec des cellules orange fondu et cramoisies, des particules de braise et des effets de chaleur dynamiques pour une expérience de jeu intense.",
      longDescription:
        "Enflammez vos sessions de Démineur avec le skin Inferno. Ce thème intense présente des cellules non révélées cramoisies profondes avec des particules de braise incandescentes et des tuiles révélées orange fondu. Les effets de dégradé de chaleur dynamiques simulent des flammes montantes aux bords des cellules. L'emoji drapeau feu et la bombe explosion complètent parfaitement l'atmosphère volcanique. Conçu pour les joueurs qui veulent une expérience visuelle pleine d'adrénaline qui correspond à la nature à haut risque du gameplay du Démineur.",
      keywords: [
        "skin démineur feu",
        "thème démineur inferno",
        "démineur volcanique",
        "skin démineur lave",
        "thème démineur intense",
        "design démineur sombre",
      ],
    },
    es: {
      name: "Infierno",
      description:
        "Un tema volcánico ardiente con celdas naranja fundido y carmesí, partículas de brasa y efectos de calor dinámicos para una experiencia de juego intensa.",
      longDescription:
        "Enciende tus sesiones de Buscaminas con el skin Infierno. Este intenso tema presenta celdas sin revelar carmesí profundo con partículas de brasa brillantes y baldosas reveladas naranja fundido. Los efectos de degradado de calor dinámicos simulan llamas ascendentes en los bordes de las celdas. El emoji bandera fuego y la bomba explosión complementan perfectamente la atmósfera volcánica. Diseñado para jugadores que quieren una experiencia visual llena de adrenalina que coincida con la naturaleza de alto riesgo del gameplay del Buscaminas.",
      keywords: [
        "skin buscaminas fuego",
        "tema buscaminas infierno",
        "buscaminas volcánico",
        "skin buscaminas lava",
        "tema buscaminas intenso",
        "diseño buscaminas oscuro",
      ],
    },
  },
};
