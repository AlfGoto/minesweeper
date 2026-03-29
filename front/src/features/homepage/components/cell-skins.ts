import type { CSSProperties } from "react";
import type { Cell } from "@/types/game";
import { HEIGHT } from "@/vars";

export type CellSkin =
  | "default"
  | "flowerfloor"
  | "inferno-hard"
  | "igloo"
  | "jade-temple"
  | "paper-cutout"
  | "void-orchid"
  | "minimal-zoned"
  | "antic";

type NumberSkinMap = Record<number, string>;

type CellSkinPatternContext = {
  row: number;
  col: number;
  odd: boolean;
  cellValue: Cell["value"];
  cellStatus: Cell["status"];
  isHiddenOrFlagged: boolean;
  topIsUnrevealed: boolean;
  rightIsUnrevealed: boolean;
  bottomIsUnrevealed: boolean;
  leftIsUnrevealed: boolean;
  topLeftIsUnrevealed: boolean;
  topRightIsUnrevealed: boolean;
  bottomRightIsUnrevealed: boolean;
  bottomLeftIsUnrevealed: boolean;
};

type UnrevealedNeighborContext = Pick<
  CellSkinPatternContext,
  | "topIsUnrevealed"
  | "rightIsUnrevealed"
  | "bottomIsUnrevealed"
  | "leftIsUnrevealed"
  | "topLeftIsUnrevealed"
  | "topRightIsUnrevealed"
  | "bottomRightIsUnrevealed"
  | "bottomLeftIsUnrevealed"
>;

type GetUnrevealedNeighborContextArgs = {
  id: number;
  getCellSnapshot: (cellId: number) => Cell;
};

export const getUnrevealedNeighborContext = ({
  id,
  getCellSnapshot,
}: GetUnrevealedNeighborContextArgs): UnrevealedNeighborContext => {
  const rowCount = HEIGHT;
  const colCount = HEIGHT;
  const row = Math.floor(id / colCount);
  const col = id % colCount;

  const topId = row > 0 ? id - colCount : undefined;
  const rightId = col < colCount - 1 ? id + 1 : undefined;
  const bottomId = row < rowCount - 1 ? id + colCount : undefined;
  const leftId = col > 0 ? id - 1 : undefined;
  const topLeftId = row > 0 && col > 0 ? id - colCount - 1 : undefined;
  const topRightId =
    row > 0 && col < colCount - 1 ? id - colCount + 1 : undefined;
  const bottomRightId =
    row < rowCount - 1 && col < colCount - 1 ? id + colCount + 1 : undefined;
  const bottomLeftId =
    row < rowCount - 1 && col > 0 ? id + colCount - 1 : undefined;

  const isUnrevealed = (cellId: number | undefined) => {
    if (cellId === undefined) return false;
    const neighbor = getCellSnapshot(cellId);
    return neighbor.status === "hidden" || neighbor.status === "flagged";
  };

  return {
    topIsUnrevealed: isUnrevealed(topId),
    rightIsUnrevealed: isUnrevealed(rightId),
    bottomIsUnrevealed: isUnrevealed(bottomId),
    leftIsUnrevealed: isUnrevealed(leftId),
    topLeftIsUnrevealed: isUnrevealed(topLeftId),
    topRightIsUnrevealed: isUnrevealed(topRightId),
    bottomRightIsUnrevealed: isUnrevealed(bottomRightId),
    bottomLeftIsUnrevealed: isUnrevealed(bottomLeftId),
  };
};

export const getSkin = ({ skin, ...context }: GetSkinContext) => {
  const definition = CellSkins[skin];
  const baseClass = context.isHiddenOrFlagged
    ? context.odd
      ? definition.green
      : definition.lightGreen
    : context.odd
      ? definition.gray
      : definition.silver;
  const overlayClass = definition.getOverlayClass?.(context) ?? "";
  const className = overlayClass ? `${baseClass} ${overlayClass}` : baseClass;
  const style = definition.getOverlayStyle?.(context);

  return {
    className,
    style,
    definition,
  };
};

type CellSkinDefinition = {
  green: string;
  lightGreen: string;
  gray: string;
  silver: string;
  number: NumberSkinMap;
  flagEmoji?: string;
  bombEmoji?: string;
  getOverlayClass?: (context: CellSkinPatternContext) => string;
  getOverlayStyle?: (
    context: CellSkinPatternContext,
  ) => CSSProperties | undefined;
};

type GetSkinContext = CellSkinPatternContext & {
  skin: CellSkin;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
};

const defaultSkin = {
  green: "bg-[limegreen] contrast-[0.8]",
  lightGreen: "bg-[lightgreen] contrast-[0.8]",
  gray: "bg-[tan] contrast-[0.9] transition-none",
  silver: "bg-[wheat] contrast-[0.9] transition-none",
  flagEmoji: "🚩",
  bombEmoji: "💣",
  number: {
    0: "",
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-red-600",
    4: "text-purple-600",
    5: "text-yellow-600",
    6: "text-pink-600",
    7: "text-orange-600",
    8: "text-gray-600",
  },
};

export const CellSkins: Record<CellSkin, CellSkinDefinition> = {
  default: defaultSkin,
  "flowerfloor": {
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
        const neighborOdd = !isOdd; // Cardinal neighbors always flip parity.
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

        return {
          backgroundImage: edgeLayers.join(","),
          backgroundRepeat: "no-repeat",
        };
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
        const petalSize = (2 + rand() * 11).toFixed(2); // 2% -> 13%
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

      return {
        backgroundImage: gradients.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "inferno-hard": {
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
    getOverlayClass: ({ isHiddenOrFlagged }: CellSkinPatternContext): string => {
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
  },
  igloo: {
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
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (!isHiddenOrFlagged) return undefined;

      const rand = mulberry32((row + 1) * 119417 + (col + 1) * 67759);
      const gradients: string[] = [];

      // Add a few tiny snow speckles with varied alpha/size.
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

      // Occasionally add one soft wind-swept frost streak.
      if (rand() > 0.32) {
        const angle = Math.floor(18 + rand() * 46); // diagonal drift
        const stopA = (12 + rand() * 14).toFixed(1);
        const stopB = (45 + rand() * 16).toFixed(1);
        const alphaA = (0.11 + rand() * 0.08).toFixed(2);
        const alphaB = (0.04 + rand() * 0.05).toFixed(2);

        gradients.push(
          `linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${alphaA}) ${stopA}%, rgba(219,234,254,${alphaB}) ${stopB}%, rgba(255,255,255,0) 100%)`,
        );
      }

      return {
        backgroundImage: gradients.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "jade-temple": {
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

      return {
        backgroundImage: `radial-gradient(circle at ${x}% ${y}%, rgba(16,185,129,0) 0 ${ring}%, rgba(16,185,129,0.24) ${ring}% ${ringFade}%, transparent ${ringFade}%), radial-gradient(circle at ${x}% ${y}%, rgba(6,78,59,0.32) 0 ${dot}%, transparent ${dotFade}%), linear-gradient(${angle}deg, rgba(5,150,105,0.07) 0, rgba(16,185,129,0.01) 58%, transparent 100%)`,
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "paper-cutout": {
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

      return {
        backgroundImage: `repeating-linear-gradient(${Math.floor(rand() * 25)}deg, rgba(146,64,14,${stripeAlpha}) 0 1px, transparent 1px 8px), linear-gradient(180deg, transparent 0 ${tearY}%, rgba(120,53,15,0.06) ${tearY}% calc(${tearY}% + 1.2%), transparent calc(${tearY}% + 1.2%) 100%), radial-gradient(circle at ${Math.floor(15 + rand() * 70)}% ${Math.floor(15 + rand() * 70)}%, rgba(255,255,255,${grainAlpha}) 0 12%, transparent 24%)`,
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "void-orchid": {
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

      return {
        backgroundImage: layers.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "minimal-zoned": {
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
  },
  antic: {
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

      return {
        backgroundImage: layers.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
};
