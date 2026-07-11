import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { defaultSkin } from "./default";
import { mulberry32, bgLayers } from "./utils";

export const flowerfloorSkin: CellSkinDefinition = {
  ...defaultSkin,
  flagEmoji: "🌸",
  bombEmoji: "💥",
  getOverlayStyle: ({
    row,
    col,
    cellStatus,
    isHiddenOrFlagged,
    topIsUnrevealed,
    rightIsUnrevealed,
    bottomIsUnrevealed,
    leftIsUnrevealed,
    topLeftIsUnrevealed,
    topRightIsUnrevealed,
    bottomRightIsUnrevealed,
    bottomLeftIsUnrevealed,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (cellStatus === "revealed") {
      const rowOdd = row % 2 === 0;
      const colOdd = col % 2 === 0;
      const isOdd = (rowOdd && colOdd) || (!rowOdd && !colOdd);
      const neighborOdd = !isOdd;
      const grassRgb = neighborOdd ? "50,205,50" : "144,238,144";
      const edgeRand = mulberry32((row + 1) * 35771 + (col + 1) * 81233);
      const bladeAlpha = (0.42 + edgeRand() * 0.18).toFixed(2);
      const mistAlpha = (0.2 + edgeRand() * 0.1).toFixed(2);
      const grainAlpha = (0.12 + edgeRand() * 0.08).toFixed(2);
      const edgeLayers: string[] = [];
      const topBoost =
        topIsUnrevealed &&
        ((leftIsUnrevealed && topLeftIsUnrevealed) ||
          (rightIsUnrevealed && topRightIsUnrevealed));
      const rightBoost =
        rightIsUnrevealed &&
        ((topIsUnrevealed && topRightIsUnrevealed) ||
          (bottomIsUnrevealed && bottomRightIsUnrevealed));
      const bottomBoost =
        bottomIsUnrevealed &&
        ((leftIsUnrevealed && bottomLeftIsUnrevealed) ||
          (rightIsUnrevealed && bottomRightIsUnrevealed));
      const leftBoost =
        leftIsUnrevealed &&
        ((topIsUnrevealed && topLeftIsUnrevealed) ||
          (bottomIsUnrevealed && bottomLeftIsUnrevealed));

      if (topIsUnrevealed) {
        const body = topBoost ? 22 : 16;
        const fade = topBoost ? 42 : 34;
        edgeLayers.push(
          `linear-gradient(166deg, rgba(${grassRgb},${bladeAlpha}) 0%, rgba(${grassRgb},${mistAlpha}) ${body}%, transparent ${fade}%)`,
        );
        edgeLayers.push(
          `linear-gradient(118deg, rgba(${grassRgb},${grainAlpha}) 0%, transparent ${Math.max(24, fade - 10)}%)`,
        );
      }
      if (rightIsUnrevealed) {
        const body = rightBoost ? 22 : 16;
        const fade = rightBoost ? 42 : 34;
        edgeLayers.push(
          `linear-gradient(256deg, rgba(${grassRgb},${bladeAlpha}) 0%, rgba(${grassRgb},${mistAlpha}) ${body}%, transparent ${fade}%)`,
        );
        edgeLayers.push(
          `linear-gradient(208deg, rgba(${grassRgb},${grainAlpha}) 0%, transparent ${Math.max(24, fade - 10)}%)`,
        );
      }
      if (bottomIsUnrevealed) {
        const body = bottomBoost ? 22 : 16;
        const fade = bottomBoost ? 42 : 34;
        edgeLayers.push(
          `linear-gradient(346deg, rgba(${grassRgb},${bladeAlpha}) 0%, rgba(${grassRgb},${mistAlpha}) ${body}%, transparent ${fade}%)`,
        );
        edgeLayers.push(
          `linear-gradient(298deg, rgba(${grassRgb},${grainAlpha}) 0%, transparent ${Math.max(24, fade - 10)}%)`,
        );
      }
      if (leftIsUnrevealed) {
        const body = leftBoost ? 22 : 16;
        const fade = leftBoost ? 42 : 34;
        edgeLayers.push(
          `linear-gradient(76deg, rgba(${grassRgb},${bladeAlpha}) 0%, rgba(${grassRgb},${mistAlpha}) ${body}%, transparent ${fade}%)`,
        );
        edgeLayers.push(
          `linear-gradient(28deg, rgba(${grassRgb},${grainAlpha}) 0%, transparent ${Math.max(24, fade - 10)}%)`,
        );
      }

      if (!edgeLayers.length) return undefined;

      return bgLayers(...edgeLayers);
    }

    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 92821 + (col + 1) * 68917);
    if (rand() < 0.04) return undefined;

    const flowerCount = rand() < 0.45 ? 2 : rand() < 0.8 ? 3 : 4;
    const gradients: string[] = [];

    const flowerColorPairs = [
      { petal: "255,176,220", core: "219,39,119" },
      { petal: "255,244,120", core: "251,146,60" },
      { petal: "194,210,255", core: "79,70,229" },
      { petal: "153,246,228", core: "13,148,136" },
      { petal: "233,213,255", core: "126,34,206" },
      { petal: "254,205,211", core: "225,29,72" },
      { petal: "187,247,208", core: "21,128,61" },
      { petal: "186,230,253", core: "2,132,199" },
      { petal: "254,215,170", core: "194,65,12" },
      { petal: "253,230,138", core: "161,98,7" },
      { petal: "240,253,250", core: "15,118,110" },
      { petal: "224,242,254", core: "3,105,161" },
      { petal: "220,252,231", core: "22,101,52" },
      { petal: "254,242,242", core: "190,18,60" },
      { petal: "237,233,254", core: "109,40,217" },
      { petal: "254,240,138", core: "217,119,6" },
      { petal: "253,186,116", core: "234,88,12" },
      { petal: "251,207,232", core: "190,24,93" },
      { petal: "243,232,255", core: "124,58,237" },
      { petal: "199,210,254", core: "67,56,202" },
    ];

    for (let i = 0; i < flowerCount; i++) {
      const colorPair =
        flowerColorPairs[Math.floor(rand() * flowerColorPairs.length)];
      const x = (12 + rand() * 76).toFixed(1);
      const y = (12 + rand() * 76).toFixed(1);
      const petalSize = (2 + rand() * 11).toFixed(2);
      const petalFade = (Number(petalSize) + 1.6 + rand() * 1.4).toFixed(2);
      const coreSize = (0.7 + rand() * 2.2).toFixed(2);
      const coreFade = (Number(coreSize) + 0.9 + rand() * 0.8).toFixed(2);
      const petalAlpha = (0.88 + rand() * 0.1).toFixed(2);
      const coreAlpha = (0.9 + rand() * 0.1).toFixed(2);

      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, rgba(${colorPair.petal},${petalAlpha}) 0 ${petalSize}%, transparent ${petalFade}%)`,
      );
      gradients.push(
        `radial-gradient(circle at ${x}% ${y}%, rgba(${colorPair.core},${coreAlpha}) 0 ${coreSize}%, transparent ${coreFade}%)`,
      );
    }

    return bgLayers(...gradients);
  },
  name: "Flower Floor",
  slug: "flower-floor",
  description:
    "A vibrant garden theme with colorful flowers scattered across unrevealed cells and soft grass edge effects on revealed tiles.",
  longDescription:
    "Transform your Minesweeper game into a blooming garden with the Flower Floor skin. Each unrevealed cell features randomly generated flowers in a stunning palette of pinks, yellows, purples, and teals. When cells are revealed, delicate grass blade gradients appear at the edges, creating a natural transition effect. The cherry blossom flag and explosion bomb emojis add charm to this nature-inspired theme. Ideal for players who want a cheerful, relaxing visual experience.",
  keywords: [
    "flower minesweeper skin",
    "garden minesweeper theme",
    "floral minesweeper",
    "nature minesweeper skin",
    "colorful minesweeper theme",
    "spring minesweeper design",
  ],
  translations: {
    fr: {
      name: "Sol Fleuri",
      description:
        "Un thème de jardin vibrant avec des fleurs colorées dispersées sur les cellules non révélées et des effets de bordure d'herbe douce sur les tuiles révélées.",
      longDescription:
        "Transformez votre jeu de Démineur en un jardin fleuri avec le skin Sol Fleuri. Chaque cellule non révélée présente des fleurs générées aléatoirement dans une palette époustouflante de roses, jaunes, violets et bleus-verts. Lorsque les cellules sont révélées, de délicats dégradés de brins d'herbe apparaissent aux bords, créant un effet de transition naturel. Les emojis drapeau fleur de cerisier et bombe explosion ajoutent du charme à ce thème inspiré de la nature. Idéal pour les joueurs qui veulent une expérience visuelle joyeuse et relaxante.",
      keywords: [
        "skin démineur fleur",
        "thème démineur jardin",
        "démineur floral",
        "skin démineur nature",
        "thème démineur coloré",
        "design démineur printemps",
      ],
    },
    es: {
      name: "Suelo Florido",
      description:
        "Un vibrante tema de jardín con flores coloridas esparcidas sobre las celdas sin revelar y suaves efectos de borde de hierba en las baldosas reveladas.",
      longDescription:
        "Transforma tu juego de Buscaminas en un jardín floreciente con el skin Suelo Florido. Cada celda sin revelar presenta flores generadas aleatoriamente en una impresionante paleta de rosas, amarillos, morados y turquesas. Cuando las celdas se revelan, delicados degradados de briznas de hierba aparecen en los bordes, creando un efecto de transición natural. Los emojis de bandera flor de cerezo y bomba explosión añaden encanto a este tema inspirado en la naturaleza. Ideal para jugadores que quieren una experiencia visual alegre y relajante.",
      keywords: [
        "skin buscaminas flor",
        "tema buscaminas jardín",
        "buscaminas floral",
        "skin buscaminas naturaleza",
        "tema buscaminas colorido",
        "diseño buscaminas primavera",
      ],
    },
  },
};
