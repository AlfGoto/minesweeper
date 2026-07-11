import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32, bgLayers } from "./utils";

export const iglooSkin: CellSkinDefinition = {
  green:
    "bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.85)_0,rgba(255,255,255,0.85)_8%,transparent_17%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.65)_0,rgba(255,255,255,0.65)_7%,transparent_15%),linear-gradient(155deg,#dbeafe_0%,#cfe8f7_52%,#c4deef_100%)] text-sky-900",
  lightGreen:
    "bg-[radial-gradient(circle_at_65%_18%,rgba(255,255,255,0.8)_0,rgba(255,255,255,0.8)_8%,transparent_16%),radial-gradient(circle_at_30%_76%,rgba(255,255,255,0.58)_0,rgba(255,255,255,0.58)_7%,transparent_14%),linear-gradient(155deg,#e8f3ff_0%,#d8edfa_52%,#cae4f4_100%)] text-sky-900",
  gray: "bg-[linear-gradient(145deg,#f8fcff_0%,#edf6fd_50%,#e2eff9_100%)] text-sky-900 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.85)] transition-none",
  silver:
    "bg-[linear-gradient(145deg,#ffffff_0%,#f3f9ff_50%,#e7f2fb_100%)] text-sky-900 shadow-[inset_0_0_0_1px_rgba(191,219,254,0.85)] transition-none",
  number: {
    0: "",
    1: "text-blue-500",
    2: "text-emerald-500",
    3: "text-rose-500",
    4: "text-indigo-500",
    5: "text-amber-500",
    6: "text-cyan-500",
    7: "text-orange-500",
    8: "text-slate-500",
  },
  flagEmoji: "☃️",
  bombEmoji: "🧊",
  name: "Igloo",
  slug: "igloo",
  description:
    "A frosty winter theme with icy blue unrevealed cells, snow speckles, and crisp white revealed tiles for a cool gaming experience.",
  longDescription:
    "Chill out with the Igloo skin that transforms Minesweeper into an arctic wonderland. Unrevealed cells feature soft icy blue tones with randomly generated snow speckles and occasional frost streaks. Revealed tiles display pristine white and pale blue gradients reminiscent of fresh snow. The snowman flag and ice cube bomb emojis complete the winter atmosphere. Perfect for players who want a calm, cool visual experience.",
  keywords: [
    "igloo minesweeper skin",
    "winter minesweeper theme",
    "ice minesweeper",
    "snow minesweeper skin",
    "cold minesweeper theme",
    "arctic minesweeper design",
  ],
  translations: {
    fr: {
      name: "Igloo",
      description:
        "Un thème hivernal glacé avec des cellules non révélées bleu glacé, des mouchetures de neige et des tuiles révélées blanches nettes pour une expérience de jeu fraîche.",
      longDescription:
        "Détendez-vous avec le skin Igloo qui transforme le Démineur en un pays des merveilles arctique. Les cellules non révélées présentent des tons bleu glacé doux avec des mouchetures de neige générées aléatoirement et des traînées de givre occasionnelles. Les tuiles révélées affichent des dégradés blanc immaculé et bleu pâle rappelant la neige fraîche. Les emojis drapeau bonhomme de neige et bombe glaçon complètent l'atmosphère hivernale. Parfait pour les joueurs qui veulent une expérience visuelle calme et fraîche.",
      keywords: [
        "skin démineur igloo",
        "thème démineur hiver",
        "démineur glace",
        "skin démineur neige",
        "thème démineur froid",
        "design démineur arctique",
      ],
    },
    es: {
      name: "Iglú",
      description:
        "Un tema invernal helado con celdas sin revelar azul hielo, motas de nieve y baldosas reveladas blancas nítidas para una experiencia de juego fresca.",
      longDescription:
        "Relájate con el skin Iglú que transforma el Buscaminas en un país de las maravillas ártico. Las celdas sin revelar presentan tonos azul hielo suaves con motas de nieve generadas aleatoriamente y ocasionales rayas de escarcha. Las baldosas reveladas muestran degradados blanco prístino y azul pálido que recuerdan a la nieve fresca. Los emojis bandera muñeco de nieve y bomba cubo de hielo completan la atmósfera invernal. Perfecto para jugadores que quieren una experiencia visual tranquila y fresca.",
      keywords: [
        "skin buscaminas iglú",
        "tema buscaminas invierno",
        "buscaminas hielo",
        "skin buscaminas nieve",
        "tema buscaminas frío",
        "diseño buscaminas ártico",
      ],
    },
  },
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 119417 + (col + 1) * 67759);
    const gradients: string[] = [];

    const speckleCount = rand() < 0.3 ? 2 : rand() < 0.75 ? 3 : 4;
    for (let i = 0; i < speckleCount; i++) {
      const x = (10 + rand() * 80).toFixed(1);
      const y = (10 + rand() * 80).toFixed(1);
      const size = (0.8 + rand() * 2.3).toFixed(2);
      const fade = (Number(size) + 1.4 + rand() * 1.3).toFixed(2);
      const alpha = (0.52 + rand() * 0.34).toFixed(2);

      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0 ${size}%, transparent ${fade}%)`,
      );
    }

    if (rand() > 0.32) {
      const angle = Math.floor(18 + rand() * 46);
      const stopA = (12 + rand() * 14).toFixed(1);
      const stopB = (45 + rand() * 16).toFixed(1);
      const alphaA = (0.11 + rand() * 0.08).toFixed(2);
      const alphaB = (0.04 + rand() * 0.05).toFixed(2);

      gradients.push(
        `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${alphaA}) ${stopA}%, rgba(219,234,254,${alphaB}) ${stopB}%, rgba(255,255,255,0) 100%)`,
      );
    }

    return {
      ...bgLayers(...gradients),
      backgroundColor: "#ffffff",
    };
  },
};
