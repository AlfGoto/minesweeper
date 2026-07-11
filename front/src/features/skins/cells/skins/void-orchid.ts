import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32, bgLayers } from "./utils";

export const voidOrchidSkin: CellSkinDefinition = {
  green:
    "bg-[linear-gradient(165deg,#090410_0%,#1d0c29_52%,#07030d_100%)] text-fuchsia-100 ",
  lightGreen:
    "bg-[linear-gradient(165deg,#12071c_0%,#28113a_52%,#0e0516_100%)] text-fuchsia-100 ",
  gray: "bg-[linear-gradient(145deg,#f9f1ff_0%,#f0ddff_52%,#e7ccfb_100%)] text-purple-950 transition-none",
  silver:
    "bg-[linear-gradient(145deg,#fff7ff_0%,#f7e9ff_52%,#efdafd_100%)] text-purple-950 transition-none",
  number: {
    0: "",
    1: "text-blue-600",
    2: "text-emerald-600",
    3: "text-rose-600",
    4: "text-violet-600",
    5: "text-amber-600",
    6: "text-cyan-600",
    7: "text-orange-600",
    8: "text-zinc-700",
  },
  flagEmoji: "🪻",
  bombEmoji: "💫",
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) return undefined;

    const rand = mulberry32((row + 1) * 99733 + (col + 1) * 44027);
    const petals = rand() < 0.42 ? 2 : 3;
    const layers: string[] = [];

    for (let i = 0; i < petals; i++) {
      const x = (14 + rand() * 72).toFixed(1);
      const y = (14 + rand() * 72).toFixed(1);
      const angle = Math.floor(rand() * 360);
      const alpha = (0.18 + rand() * 0.16).toFixed(2);

      layers.push(
        `conic-gradient(from ${angle}deg at ${x}% ${y}%, rgba(244,114,182,${alpha}) 0 22deg, transparent 22deg 180deg, rgba(192,132,252,${alpha}) 180deg 206deg, transparent 206deg 360deg)`,
      );
    }

    layers.push(
      `radial-gradient(circle at ${Math.floor(18 + rand() * 64)}% ${Math.floor(18 + rand() * 64)}%, rgba(217,70,239,0.2) 0 6%, transparent 14%)`,
    );

    return bgLayers(...layers);
  },
  name: "Void Orchid",
  slug: "void-orchid",
  description:
    "A mysterious dark theme with deep purple orchid tones, ethereal glow effects, and cosmic void aesthetics.",
  longDescription:
    "Embrace the mysterious depths with the Void Orchid skin. This captivating theme features deep violet unrevealed cells with subtle ethereal petal patterns and soft lavender revealed tiles. Cosmic gradient effects create an otherworldly atmosphere, as if playing Minesweeper at the edge of a celestial nebula. The orchid flower flag and sparkle bomb emojis enhance the mystical vibe. Perfect for players who prefer dark themes and appreciate enigmatic, space-inspired aesthetics.",
  keywords: [
    "dark minesweeper skin",
    "purple minesweeper theme",
    "void minesweeper",
    "orchid minesweeper skin",
    "cosmic minesweeper theme",
    "mystical minesweeper design",
  ],
  translations: {
    fr: {
      name: "Orchidée du Vide",
      description:
        "Un thème sombre mystérieux avec des tons violet orchidée profonds, des effets de lueur éthérée et une esthétique de vide cosmique.",
      longDescription:
        "Embrassez les profondeurs mystérieuses avec le skin Orchidée du Vide. Ce thème captivant présente des cellules non révélées violet profond avec de subtils motifs de pétales éthérés et des tuiles révélées lavande douces. Les effets de dégradé cosmique créent une atmosphère d'un autre monde, comme si vous jouiez au Démineur au bord d'une nébuleuse céleste. Les emojis drapeau fleur d'orchidée et bombe étincelle renforcent l'ambiance mystique. Parfait pour les joueurs qui préfèrent les thèmes sombres et apprécient les esthétiques énigmatiques inspirées de l'espace.",
      keywords: [
        "skin démineur sombre",
        "thème démineur violet",
        "démineur vide",
        "skin démineur orchidée",
        "thème démineur cosmique",
        "design démineur mystique",
      ],
    },
    es: {
      name: "Orquídea del Vacío",
      description:
        "Un misterioso tema oscuro con tonos púrpura orquídea profundos, efectos de brillo etéreo y estética de vacío cósmico.",
      longDescription:
        "Abraza las profundidades misteriosas con el skin Orquídea del Vacío. Este cautivador tema presenta celdas sin revelar violeta profundo con sutiles patrones de pétalos etéreos y baldosas reveladas lavanda suaves. Los efectos de degradado cósmico crean una atmósfera de otro mundo, como si jugaras al Buscaminas al borde de una nebulosa celestial. Los emojis bandera flor de orquídea y bomba destello mejoran el ambiente místico. Perfecto para jugadores que prefieren temas oscuros y aprecian estéticas enigmáticas inspiradas en el espacio.",
      keywords: [
        "skin buscaminas oscuro",
        "tema buscaminas púrpura",
        "buscaminas vacío",
        "skin buscaminas orquídea",
        "tema buscaminas cósmico",
        "diseño buscaminas místico",
      ],
    },
  },
};
