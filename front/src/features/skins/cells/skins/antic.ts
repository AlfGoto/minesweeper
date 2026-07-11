import type { CSSProperties } from "react";
import type { CellSkinDefinition, CellSkinPatternContext } from "./types";
import { mulberry32, bgLayers } from "./utils";

export const anticSkin: CellSkinDefinition = {
  green: "bg-[#0a2614] ring-1 ring-amber-900/30",
  lightGreen: "bg-[#0d2e1a] ring-1 ring-amber-900/25",
  gray: "bg-[#d0dfca] transition-none",
  silver: "bg-[#dce8d6] transition-none",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-green-700",
    3: "text-red-700",
    4: "text-purple-700",
    5: "text-amber-700",
    6: "text-teal-700",
    7: "text-orange-700",
    8: "text-stone-600",
  },
  flagEmoji: "📚",
  bombEmoji: "📕",
  getOverlayStyle: ({
    row,
    col,
    isHiddenOrFlagged,
    cellStatus,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged) {
      if (cellStatus !== "revealed") return undefined;
      return {
        outline: "1.5px solid rgba(174,110,43,0.4)",
        outlineOffset: "-3px",
      };
    }

    const rand = mulberry32((row + 1) * 34667 + (col + 1) * 78901);
    const layers: string[] = [];

    layers.push(
      "linear-gradient(0deg, transparent 44%, rgba(194,130,63,0.16) 44%, rgba(194,130,63,0.22) 50%, rgba(194,130,63,0.16) 56%, transparent 56%)",
    );
    layers.push(
      "linear-gradient(90deg, transparent 44%, rgba(194,130,63,0.16) 44%, rgba(194,130,63,0.22) 50%, rgba(194,130,63,0.16) 56%, transparent 56%)",
    );

    layers.push(
      "radial-gradient(circle at 50% 50%, rgba(218,165,80,0.4) 0 4%, rgba(194,130,63,0.15) 4% 7%, transparent 8%)",
    );

    if (rand() > 0.7) {
      const vx =
        rand() > 0.5
          ? (15 + rand() * 20).toFixed(1)
          : (65 + rand() * 20).toFixed(1);
      const vy =
        rand() > 0.5
          ? (15 + rand() * 20).toFixed(1)
          : (65 + rand() * 20).toFixed(1);
      layers.push(
        `radial-gradient(circle at ${vx}% ${vy}%, rgba(4,20,10,0.7) 0 2%, rgba(194,130,63,0.4) 2% 4.5%, transparent 5.5%)`,
      );
    }

    if (rand() > 0.5) {
      const dx = (8 + rand() * 84).toFixed(1);
      const dy = (8 + rand() * 84).toFixed(1);
      layers.push(
        `radial-gradient(circle at ${dx}% ${dy}%, rgba(218,165,80,0.25) 0 1.5%, transparent 3%)`,
      );
    }

    return bgLayers(...layers);
  },
};
