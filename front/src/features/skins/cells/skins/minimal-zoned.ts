import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";

export const minimalZonedSkin: CellSkinDefinition = {
  green: "bg-white text-black",
  lightGreen: "bg-white text-black",
  gray: "bg-white text-black transition-none",
  silver: "bg-white text-black transition-none",
  number: {
    0: "text-black",
    1: "text-black",
    2: "text-black",
    3: "text-black",
    4: "text-black",
    5: "text-black",
    6: "text-black",
    7: "text-black",
    8: "text-black",
  },
  getOverlayStyle: ({
    cellStatus,
    topIsUnrevealed,
    rightIsUnrevealed,
    bottomIsUnrevealed,
    leftIsUnrevealed,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (cellStatus !== "revealed") {
      return undefined;
    }

    const line = "2px solid #ef4444";

    return {
      borderTop: topIsUnrevealed ? line : "none",
      borderRight: rightIsUnrevealed ? line : "none",
      borderBottom: bottomIsUnrevealed ? line : "none",
      borderLeft: leftIsUnrevealed ? line : "none",
    };
  },
  name: "Minimal Zoned",
  slug: "minimal-zoned",
  description:
    "A clean, modern minimalist design with crisp zone borders, monochromatic palette, and distraction-free gameplay focus.",
  longDescription:
    "Achieve peak focus with the Minimal Zoned skin. This ultra-clean theme strips away visual distractions with a sophisticated white monochromatic palette. Revealed cells feature bold red zone borders that clearly delineate the boundary between safe and unexplored areas, helping you mentally map the grid. The minimal aesthetic keeps everything crisp and scannable. Designed for competitive players and speedrunners who demand a distraction-free interface that lets gameplay take center stage.",
  keywords: [
    "minimal minesweeper skin",
    "clean minesweeper theme",
    "modern minesweeper",
    "simple minesweeper skin",
    "competitive minesweeper theme",
    "speedrun minesweeper design",
  ],
  translations: {
    fr: {
      name: "Zones Minimalistes",
      description:
        "Un design minimaliste propre et moderne avec des bordures de zone nettes, une palette monochromatique et un focus de gameplay sans distraction.",
      longDescription:
        "Atteignez une concentration maximale avec le skin Zones Minimalistes. Ce thème ultra-propre élimine les distractions visuelles avec une palette monochromatique blanche sophistiquée. Les cellules révélées présentent des bordures de zone rouges audacieuses qui délimitent clairement la frontière entre les zones sûres et inexplorées, vous aidant à cartographier mentalement la grille. L'esthétique minimale garde tout net et scannable. Conçu pour les joueurs compétitifs et les speedrunners qui exigent une interface sans distraction qui laisse le gameplay prendre le devant de la scène.",
      keywords: [
        "skin démineur minimal",
        "thème démineur propre",
        "démineur moderne",
        "skin démineur simple",
        "thème démineur compétitif",
        "design démineur speedrun",
      ],
    },
    es: {
      name: "Zonas Minimalistas",
      description:
        "Un diseño minimalista limpio y moderno con bordes de zona nítidos, paleta monocromática y enfoque de gameplay sin distracciones.",
      longDescription:
        "Alcanza la máxima concentración con el skin Zonas Minimalistas. Este tema ultra-limpio elimina las distracciones visuales con una sofisticada paleta monocromática blanca. Las celdas reveladas presentan bordes de zona rojos audaces que delimitan claramente el límite entre áreas seguras e inexploradas, ayudándote a mapear mentalmente la cuadrícula. La estética mínima mantiene todo nítido y escaneable. Diseñado para jugadores competitivos y speedrunners que exigen una interfaz sin distracciones que deje al gameplay tomar el protagonismo.",
      keywords: [
        "skin buscaminas minimal",
        "tema buscaminas limpio",
        "buscaminas moderno",
        "skin buscaminas simple",
        "tema buscaminas competitivo",
        "diseño buscaminas speedrun",
      ],
    },
  },
};
