import type { CSSProperties } from "react";
import type { Cell } from "@/types/game";
import { HEIGHT } from "@/vars";
import { CellSkin } from "@/types/bff";

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
  const definition =
    CellSkins[skin] ??
    NonPublishedCellSkins[skin] ??
    defaultSkin;
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

// Staging area for upcoming cell skins before publishing them in CellSkins.
export const NonPublishedCellSkins = {
  "sunken-atoll": {
    green:
      "bg-[linear-gradient(166deg,#0b3a51_0%,#14617d_52%,#09293a_100%)] text-cyan-50",
    lightGreen:
      "bg-[linear-gradient(166deg,#0f4560_0%,#1a7090_52%,#0b3349_100%)] text-cyan-50",
    gray: "bg-[linear-gradient(145deg,#dbf2f8_0%,#cde6ef_52%,#c0d9e4_100%)] text-sky-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#e8f7fc_0%,#dceef5_52%,#cfe4ee_100%)] text-sky-900 transition-none",
    number: {
      0: "",
      1: "text-blue-600",
      2: "text-emerald-600",
      3: "text-rose-600",
      4: "text-indigo-600",
      5: "text-amber-600",
      6: "text-cyan-600",
      7: "text-orange-600",
      8: "text-slate-600",
    },
    flagEmoji: "🪸",
    bombEmoji: "🦈",
    getOverlayStyle: ({
      row,
      col,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
      isHiddenOrFlagged,
      cellStatus,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const tideA = (row * 2 + col) % 5;
      const tideB = (row + col * 2) % 5;

      if (isHiddenOrFlagged) {
        return {
          backgroundImage: `linear-gradient(${150 + tideA * 4}deg, transparent 0 26%, rgba(186,230,253,0.18) 36% 56%, transparent 66% 100%), linear-gradient(${28 + tideB * 4}deg, rgba(8,47,73,0.24) 0 18%, transparent 32% 74%, rgba(8,47,73,0.22) 88% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const shoreline: string[] = [];
      if (topIsUnrevealed) {
        shoreline.push(
          "linear-gradient(180deg, rgba(125,211,252,0.34) 0 8%, transparent 14%)",
        );
      }
      if (rightIsUnrevealed) {
        shoreline.push(
          "linear-gradient(270deg, rgba(125,211,252,0.34) 0 8%, transparent 14%)",
        );
      }
      if (bottomIsUnrevealed) {
        shoreline.push(
          "linear-gradient(0deg, rgba(125,211,252,0.34) 0 8%, transparent 14%)",
        );
      }
      if (leftIsUnrevealed) {
        shoreline.push(
          "linear-gradient(90deg, rgba(125,211,252,0.34) 0 8%, transparent 14%)",
        );
      }

      if (!shoreline.length) return undefined;
      return {
        backgroundImage: shoreline.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: revealed cells draw seam-connected neon traces where
  // neighboring cells are also revealed, creating deterministic cluster circuits.
  "neon-circuit": {
    green:
      "bg-[linear-gradient(160deg,#09192a_0%,#13324e_52%,#071321_100%)] text-cyan-100",
    lightGreen:
      "bg-[linear-gradient(160deg,#0c2236_0%,#19405f_52%,#0a1b2d_100%)] text-cyan-100",
    gray: "bg-[linear-gradient(145deg,#0b1a2b_0%,#10253a_52%,#0a1827_100%)] text-cyan-100 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#0d1f32_0%,#15304a_52%,#0c1d30_100%)] text-cyan-100 transition-none",
    number: {
      0: "",
      1: "text-sky-300",
      2: "text-lime-300",
      3: "text-rose-300",
      4: "text-violet-300",
      5: "text-amber-300",
      6: "text-teal-300",
      7: "text-orange-300",
      8: "text-zinc-200",
    },
    flagEmoji: "🛰️",
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
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged || cellStatus !== "revealed") {
        const phase = (row * 2 + col) % 4;
        return {
          backgroundImage: `linear-gradient(${22 + phase * 8}deg, transparent 0 38%, rgba(34,211,238,0.16) 44% 56%, transparent 62% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      const topOpen = !topIsUnrevealed;
      const rightOpen = !rightIsUnrevealed;
      const bottomOpen = !bottomIsUnrevealed;
      const leftOpen = !leftIsUnrevealed;
      const openCount = [topOpen, rightOpen, bottomOpen, leftOpen].filter(Boolean)
        .length;

      if (openCount < 1) return undefined;
      const segments: string[] = [];

      if (topOpen) {
        segments.push(
          "linear-gradient(0deg, transparent 0 48%, rgba(34,211,238,0.5) 48% 54%, rgba(34,211,238,0.22) 54% 100%)",
        );
      }
      if (rightOpen) {
        segments.push(
          "linear-gradient(270deg, transparent 0 48%, rgba(45,212,191,0.5) 48% 54%, rgba(45,212,191,0.22) 54% 100%)",
        );
      }
      if (bottomOpen) {
        segments.push(
          "linear-gradient(180deg, transparent 0 48%, rgba(34,211,238,0.5) 48% 54%, rgba(34,211,238,0.22) 54% 100%)",
        );
      }
      if (leftOpen) {
        segments.push(
          "linear-gradient(90deg, transparent 0 48%, rgba(45,212,191,0.5) 48% 54%, rgba(45,212,191,0.22) 54% 100%)",
        );
      }
      if (openCount >= 2) {
        segments.push(
          "linear-gradient(135deg, transparent 0 42%, rgba(16,185,129,0.18) 47% 53%, transparent 58% 100%)",
        );
      }

      return {
        backgroundImage: segments.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "moss-ruins": {
    green:
      "bg-[linear-gradient(160deg,#1f341b_0%,#33552d_52%,#162917_100%)] text-lime-100",
    lightGreen:
      "bg-[linear-gradient(160deg,#294728_0%,#3f6840_52%,#213c22_100%)] text-lime-100",
    gray: "bg-[linear-gradient(145deg,#dfe5d1_0%,#d3dbc0_52%,#c6cfb2_100%)] text-lime-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#e9efdc_0%,#dde5cd_52%,#d0dac0_100%)] text-lime-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🗿",
    bombEmoji: "💀",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const seamBand = (row + col) % 3;

      if (isHiddenOrFlagged) {
        return {
          backgroundImage: `linear-gradient(${132 + seamBand * 12}deg, rgba(132,204,22,0.16) 0 24%, transparent 34% 100%), linear-gradient(${36 + seamBand * 9}deg, transparent 0 38%, rgba(101,163,13,0.2) 46% 62%, transparent 72% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const revealedEdges: string[] = [];
      if (topIsUnrevealed) revealedEdges.push("linear-gradient(180deg, rgba(82,82,40,0.32) 0 8%, transparent 12%)");
      if (rightIsUnrevealed)
        revealedEdges.push("linear-gradient(270deg, rgba(82,82,40,0.32) 0 8%, transparent 12%)");
      if (bottomIsUnrevealed) revealedEdges.push("linear-gradient(0deg, rgba(82,82,40,0.32) 0 8%, transparent 12%)");
      if (leftIsUnrevealed) revealedEdges.push("linear-gradient(90deg, rgba(82,82,40,0.32) 0 8%, transparent 12%)");

      const crackDirection = (row + col) % 2 === 0 ? 32 : 148;
      revealedEdges.push(
        `linear-gradient(${crackDirection}deg, transparent 0 34%, rgba(82,82,40,0.2) 42% 48%, transparent 56% 100%)`,
      );

      if (!revealedEdges.length) return undefined;
      return {
        backgroundImage: revealedEdges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "arcade-pop": {
    green:
      "bg-[linear-gradient(160deg,#451070_0%,#7a2ec2_52%,#2f0a50_100%)] text-fuchsia-50",
    lightGreen:
      "bg-[linear-gradient(160deg,#552088_0%,#9546d8_52%,#3b1260_100%)] text-fuchsia-50",
    gray: "bg-[linear-gradient(145deg,#fff2fd_0%,#fbe7f7_52%,#f2dbef_100%)] text-fuchsia-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#fff8ff_0%,#fdf0fa_52%,#f5e3f1_100%)] text-fuchsia-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-800",
    },
    flagEmoji: "🕹️",
    bombEmoji: "💣",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const block = (row + col) % 4;
      const hueA = 286 + block * 10;
      const hueB = 192 + block * 8;

      if (!isHiddenOrFlagged && cellStatus === "revealed") {
        return {
          backgroundImage: `linear-gradient(${38 + block * 16}deg, transparent 0 34%, hsla(${hueA},84%,66%,0.2) 42% 58%, transparent 66% 100%), linear-gradient(${132 + block * 12}deg, transparent 0 38%, hsla(${hueB},86%,62%,0.18) 46% 60%, transparent 68% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (!isHiddenOrFlagged) return undefined;
      return {
        backgroundImage: `linear-gradient(${44 + block * 18}deg, transparent 0 32%, hsla(${hueA},94%,72%,0.24) 40% 62%, transparent 70% 100%)`,
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "ember-keep": {
    green:
      "bg-[linear-gradient(160deg,#4b2017_0%,#6a2f22_50%,#35140f_100%)] text-orange-50",
    lightGreen:
      "bg-[linear-gradient(160deg,#5a2a1f_0%,#7d3d2f_50%,#401910_100%)] text-orange-50",
    gray: "bg-[linear-gradient(145deg,#efe0d2_0%,#e3d0be_52%,#d8c2ad_100%)] text-orange-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f6eade_0%,#ecdcc9_52%,#e1cfbc_100%)] text-orange-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🏰",
    bombEmoji: "🌋",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const rowPhase = row % 2;
      const colPhase = col % 3;

      if (isHiddenOrFlagged) {
        const jointX = 18 + colPhase * 10;
        const battlement = rowPhase === 0 ? 18 : 26;
        return {
          backgroundImage: `linear-gradient(180deg, rgba(120,53,15,0.26) 0 ${battlement}%, transparent ${battlement}% 100%), linear-gradient(90deg, transparent 0 ${jointX}%, rgba(120,53,15,0.22) ${jointX}% ${jointX + 6}%, transparent ${jointX + 6}% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed) edges.push("linear-gradient(180deg, rgba(120,53,15,0.36) 0 8%, transparent 12%)");
      if (rightIsUnrevealed)
        edges.push("linear-gradient(270deg, rgba(120,53,15,0.36) 0 8%, transparent 12%)");
      if (bottomIsUnrevealed) edges.push("linear-gradient(0deg, rgba(120,53,15,0.36) 0 8%, transparent 12%)");
      if (leftIsUnrevealed) edges.push("linear-gradient(90deg, rgba(120,53,15,0.36) 0 8%, transparent 12%)");
      edges.push(
        `linear-gradient(${rowPhase === 0 ? 26 : 154}deg, transparent 0 34%, rgba(124,45,18,0.18) 44% 52%, transparent 62% 100%)`,
      );

      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "petal-parlor": {
    green:
      "bg-[linear-gradient(160deg,#3a2a1f_0%,#5a422d_52%,#2b1f15_100%)] text-rose-50",
    lightGreen:
      "bg-[linear-gradient(160deg,#4a3728_0%,#6a533a_52%,#37281d_100%)] text-rose-50",
    gray: "bg-[linear-gradient(145deg,#f4f7ea_0%,#e9f0dd_52%,#dde7d1_100%)] text-rose-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f8faef_0%,#eef4e4_52%,#e3ebd8_100%)] text-rose-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🌷",
    bombEmoji: "🪲",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const bed = (row + col) % 4;
      const petalTilt = 26 + bed * 18;
      const leafTilt = 144 - bed * 14;

      if (isHiddenOrFlagged) {
        return {
          backgroundImage: `linear-gradient(${petalTilt}deg, transparent 0 28%, rgba(251,113,133,0.24) 40% 58%, transparent 70% 100%), linear-gradient(${leafTilt}deg, transparent 0 26%, rgba(74,222,128,0.2) 38% 56%, transparent 68% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const bedEdges: string[] = [];
      if (topIsUnrevealed) bedEdges.push("linear-gradient(180deg, rgba(74,222,128,0.24) 0 8%, transparent 14%)");
      if (rightIsUnrevealed) bedEdges.push("linear-gradient(270deg, rgba(74,222,128,0.24) 0 8%, transparent 14%)");
      if (bottomIsUnrevealed) bedEdges.push("linear-gradient(0deg, rgba(74,222,128,0.24) 0 8%, transparent 14%)");
      if (leftIsUnrevealed) bedEdges.push("linear-gradient(90deg, rgba(74,222,128,0.24) 0 8%, transparent 14%)");
      bedEdges.push(
        `linear-gradient(${petalTilt + 50}deg, transparent 0 36%, rgba(244,114,182,0.16) 44% 56%, transparent 64% 100%)`,
      );

      return {
        backgroundImage: bedEdges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "harbor-blueprint": {
    green:
      "bg-[linear-gradient(168deg,#0a3854_0%,#0f5f87_52%,#07263a_100%)] text-cyan-50",
    lightGreen:
      "bg-[linear-gradient(168deg,#0d4261_0%,#16709a_52%,#0a2f45_100%)] text-cyan-50",
    gray: "bg-[linear-gradient(145deg,#e6f4ff_0%,#d8ebfb_52%,#c8e1f2_100%)] text-sky-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f2f9ff_0%,#e7f2fb_52%,#d8e9f5_100%)] text-sky-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-slate-700",
    },
    flagEmoji: "⚓",
    bombEmoji: "🧨",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const gridPhase = (row % 3) * 3 + (col % 3);
      const route = 20 + ((row + col) % 4) * 8;
      const tide = (row * 2 + col) % 5;

      if (isHiddenOrFlagged) {
        const oceanX = col * 18;
        const oceanY = row * 14;
        return {
          backgroundImage: `linear-gradient(${148 + tide * 4}deg, transparent 0 22%, rgba(186,230,253,0.18) 36% 58%, transparent 72% 100%), linear-gradient(${24 + tide * 4}deg, rgba(8,47,73,0.24) 0 16%, transparent 32% 76%, rgba(8,47,73,0.22) 90% 100%)`,
          backgroundPosition: `${-oceanX}% ${-oceanY}%, ${-(oceanX * 0.55)}% ${-(oceanY * 0.55)}%`,
          backgroundSize: "300% 300%, 320% 320%",
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const frame: string[] = [];
      if (topIsUnrevealed) frame.push("linear-gradient(180deg, rgba(14,116,144,0.3) 0 8%, transparent 14%)");
      if (rightIsUnrevealed) frame.push("linear-gradient(270deg, rgba(14,116,144,0.3) 0 8%, transparent 14%)");
      if (bottomIsUnrevealed) frame.push("linear-gradient(0deg, rgba(14,116,144,0.3) 0 8%, transparent 14%)");
      if (leftIsUnrevealed) frame.push("linear-gradient(90deg, rgba(14,116,144,0.3) 0 8%, transparent 14%)");
      frame.push(`linear-gradient(${35 + gridPhase * 8}deg, transparent 0 ${route}%, rgba(2,132,199,0.2) ${route}% ${route + 7}%, transparent ${route + 7}% 100%)`);
      return {
        backgroundImage: frame.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: deterministic parallax panes shift toward revealed space,
  // creating directional depth that changes with neighborhood openness.
  "prism-parallax": {
    green:
      "bg-[linear-gradient(165deg,#1a2654_0%,#354587_52%,#121b41_100%)] text-indigo-50",
    lightGreen:
      "bg-[linear-gradient(165deg,#232f62_0%,#43539a_52%,#18224f_100%)] text-indigo-50",
    gray: "bg-[linear-gradient(145deg,#f2f5ff_0%,#e7ecff_52%,#dde4ff_100%)] text-indigo-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f9f9ff_0%,#f0f1ff_52%,#e7e9ff_100%)] text-indigo-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-slate-700",
    },
    flagEmoji: "🪩",
    bombEmoji: "☄️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const revealTop = Number(!topIsUnrevealed);
      const revealRight = Number(!rightIsUnrevealed);
      const revealBottom = Number(!bottomIsUnrevealed);
      const revealLeft = Number(!leftIsUnrevealed);
      const openness = revealTop + revealRight + revealBottom + revealLeft;
      const driftX = (revealRight - revealLeft) * 8 + ((col % 3) - 1) * 3;
      const driftY = (revealBottom - revealTop) * 8 + ((row % 3) - 1) * 3;

      if (isHiddenOrFlagged) {
        const hiddenX = driftX * 0.45;
        const hiddenY = driftY * 0.45;
        return {
          backgroundImage:
            "linear-gradient(140deg, transparent 0 34%, rgba(99,102,241,0.22) 42% 58%, transparent 66% 100%), linear-gradient(45deg, transparent 0 40%, rgba(129,140,248,0.18) 48% 52%, transparent 60% 100%)",
          backgroundPosition: "0 0, 0 0",
          backgroundSize: `${100 + hiddenX * 0.2}% ${100 + hiddenY * 0.2}%, ${100 - hiddenX * 0.25}% ${100 - hiddenY * 0.25}%`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const nearX = driftX + openness * 2;
      const nearY = driftY + openness * 2;
      const farX = driftX * 0.5;
      const farY = driftY * 0.5;

      return {
        backgroundImage:
          "linear-gradient(135deg, transparent 0 36%, rgba(79,70,229,0.24) 44% 56%, transparent 64% 100%), linear-gradient(45deg, transparent 0 40%, rgba(99,102,241,0.2) 48% 52%, transparent 60% 100%)",
        backgroundPosition: "0 0, 0 0",
        backgroundSize: `${100 + nearX * 0.18}% ${100 + nearY * 0.18}%, ${100 - farX * 0.15}% ${100 - farY * 0.15}%`,
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "copper-patina": {
    green:
      "bg-[linear-gradient(158deg,#5c2e0a_0%,#8b4513_52%,#3d1d06_100%)] text-amber-50",
    lightGreen:
      "bg-[linear-gradient(158deg,#6b3610_0%,#9c4e1e_52%,#4a2308_100%)] text-amber-50",
    gray: "bg-[linear-gradient(145deg,#c2ddd0_0%,#aed1c1_52%,#9ac5b2_100%)] text-emerald-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#cde5d9_0%,#bbd9ca_52%,#a8cebc_100%)] text-emerald-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "⚙️",
    bombEmoji: "🔔",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const oxideBand = (row * 2 + col) % 5;
      const flowAngle = 132 + oxideBand * 8;

      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 41263 + (col + 1) * 73891);
        const streakAlpha = (0.12 + rand() * 0.14).toFixed(2);
        const spotX = (20 + rand() * 60).toFixed(1);
        const spotY = (20 + rand() * 60).toFixed(1);
        const spotSize = (4 + rand() * 8).toFixed(1);

        return {
          backgroundImage: `linear-gradient(${flowAngle}deg, transparent 0 28%, rgba(0,128,128,${streakAlpha}) 38% 52%, transparent 62% 100%), radial-gradient(circle at ${spotX}% ${spotY}%, rgba(64,224,208,0.18) 0 ${spotSize}%, transparent ${Number(spotSize) + 4}%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(139,69,19,0.28) 0 8%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(139,69,19,0.28) 0 8%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(139,69,19,0.28) 0 8%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(139,69,19,0.28) 0 8%, transparent 14%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "bioluminescence": {
    green:
      "bg-[linear-gradient(162deg,#020818_0%,#061230_52%,#010510_100%)] text-cyan-100",
    lightGreen:
      "bg-[linear-gradient(162deg,#040a20_0%,#0a1a3a_52%,#020814_100%)] text-cyan-100",
    gray: "bg-[linear-gradient(145deg,#0c1824_0%,#142838_52%,#0a1420_100%)] text-cyan-100 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#10202e_0%,#183040_52%,#0e1a26_100%)] text-cyan-100 transition-none",
    number: {
      0: "",
      1: "text-sky-300",
      2: "text-lime-300",
      3: "text-rose-300",
      4: "text-violet-300",
      5: "text-amber-300",
      6: "text-teal-300",
      7: "text-orange-300",
      8: "text-zinc-300",
    },
    flagEmoji: "🪼",
    bombEmoji: "🐙",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 83461 + (col + 1) * 29753);
        if (rand() < 0.08) return undefined;

        const glowColors = [
          "0,255,255",
          "0,200,255",
          "100,255,200",
          "0,255,180",
          "80,200,255",
        ];

        const count = rand() < 0.4 ? 2 : rand() < 0.8 ? 3 : 4;
        const layers: string[] = [];

        for (let i = 0; i < count; i++) {
          const color = glowColors[Math.floor(rand() * glowColors.length)];
          const x = (10 + rand() * 80).toFixed(1);
          const y = (10 + rand() * 80).toFixed(1);
          const coreSize = (1 + rand() * 2.5).toFixed(2);
          const glowSize = (Number(coreSize) + 3 + rand() * 4).toFixed(2);
          const alpha = (0.5 + rand() * 0.35).toFixed(2);
          const glowAlpha = (0.12 + rand() * 0.1).toFixed(2);

          layers.push(
            `radial-gradient(circle at ${x}% ${y}%, rgba(${color},${alpha}) 0 ${coreSize}%, rgba(${color},${glowAlpha}) ${coreSize}% ${glowSize}%, transparent ${glowSize}%)`,
          );
        }

        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(0,200,255,0.18) 0 8%, transparent 16%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(0,200,255,0.18) 0 8%, transparent 16%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(0,200,255,0.18) 0 8%, transparent 16%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(0,200,255,0.18) 0 8%, transparent 16%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "honeycomb": {
    green:
      "bg-[linear-gradient(155deg,#7a5008_0%,#c8860f_52%,#624006_100%)] text-amber-50",
    lightGreen:
      "bg-[linear-gradient(155deg,#886010_0%,#d89618_52%,#705008_100%)] text-amber-50",
    gray: "bg-[linear-gradient(145deg,#fef3cd_0%,#fde9a8_52%,#fce090_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#fef7d8_0%,#fdefbc_52%,#fce7a0_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-800",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-800",
    },
    flagEmoji: "🐝",
    bombEmoji: "🍯",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const cell = (row + col) % 3;

      if (isHiddenOrFlagged) {
        const angle1 = 60 + cell * 60;
        const angle2 = angle1 + 60;
        return {
          backgroundImage: `linear-gradient(${angle1}deg, transparent 0 36%, rgba(120,53,15,0.18) 42% 48%, transparent 54% 100%), linear-gradient(${angle2}deg, transparent 0 38%, rgba(120,53,15,0.14) 44% 50%, transparent 56% 100%), radial-gradient(circle at 50% 50%, rgba(255,200,50,0.2) 0 16%, transparent 28%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(180,120,20,0.28) 0 8%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(180,120,20,0.28) 0 8%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(180,120,20,0.28) 0 8%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(180,120,20,0.28) 0 8%, transparent 14%)",
        );
      edges.push(
        "radial-gradient(circle at 50% 50%, rgba(200,150,50,0.1) 0 14%, transparent 24%)",
      );

      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: aurora curtain intensity scales with revealed-neighbor
  // density. Isolated revealed cells show faint single-band green aurora;
  // deep cluster cells show bright multi-band aurora shifting green → blue → purple.
  "aurora-veil": {
    green:
      "bg-[linear-gradient(170deg,#0a1628_0%,#152340_52%,#060e1c_100%)] text-emerald-100",
    lightGreen:
      "bg-[linear-gradient(170deg,#0e1a30_0%,#1c2d4c_52%,#0a1222_100%)] text-emerald-100",
    gray: "bg-[linear-gradient(145deg,#e8eef6_0%,#dce4f0_52%,#cfd9e8_100%)] text-slate-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f0f4fa_0%,#e5ecf5_52%,#d8e2ef_100%)] text-slate-900 transition-none",
    number: {
      0: "",
      1: "text-blue-600",
      2: "text-green-600",
      3: "text-red-600",
      4: "text-purple-600",
      5: "text-amber-600",
      6: "text-cyan-600",
      7: "text-orange-600",
      8: "text-slate-600",
    },
    flagEmoji: "🏔️",
    bombEmoji: "☄️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 67331 + (col + 1) * 28057);
        if (rand() < 0.3) return undefined;
        const starX = (15 + rand() * 70).toFixed(1);
        const starY = (10 + rand() * 50).toFixed(1);
        const starAlpha = (0.3 + rand() * 0.4).toFixed(2);
        const starSize = (0.8 + rand() * 1.8).toFixed(2);

        return {
          backgroundImage: `radial-gradient(circle at ${starX}% ${starY}%, rgba(255,255,255,${starAlpha}) 0 ${starSize}%, transparent ${(Number(starSize) + 1.5).toFixed(2)}%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;

      const revealedCount = [
        !topIsUnrevealed,
        !rightIsUnrevealed,
        !bottomIsUnrevealed,
        !leftIsUnrevealed,
      ].filter(Boolean).length;

      const auroraColors = [
        { r: 74, g: 222, b: 128 },
        { r: 56, g: 189, b: 248 },
        { r: 139, g: 92, b: 246 },
        { r: 244, g: 114, b: 182 },
      ];

      const bands: string[] = [];
      const bandCount = Math.max(1, revealedCount);
      const baseAlpha = 0.08 + revealedCount * 0.04;

      for (let i = 0; i < bandCount; i++) {
        const color = auroraColors[Math.min(i, auroraColors.length - 1)];
        const yCenter = 18 + i * 14;
        const alpha = (baseAlpha + i * 0.02).toFixed(2);
        const spread = 8 + i * 2;

        bands.push(
          `linear-gradient(180deg, transparent 0 ${yCenter - spread}%, rgba(${color.r},${color.g},${color.b},${alpha}) ${yCenter - 2}% ${yCenter + 2}%, transparent ${yCenter + spread}% 100%)`,
        );
      }

      const wavePhase = (row * 3 + col) % 5;
      const waveX = 20 + wavePhase * 14;
      bands.push(
        `linear-gradient(90deg, transparent 0 ${waveX}%, rgba(74,222,128,0.06) ${waveX}% ${waveX + 12}%, transparent ${waveX + 12}% 100%)`,
      );

      return {
        backgroundImage: bands.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "stained-glass": {
    green:
      "bg-[#1a1a22] text-amber-100 shadow-[inset_0_0_0_1.5px_rgba(60,60,60,0.85)]",
    lightGreen:
      "bg-[#222230] text-amber-100 shadow-[inset_0_0_0_1.5px_rgba(60,60,60,0.85)]",
    gray: "bg-[linear-gradient(145deg,#ece6f2_0%,#e0d8ec_52%,#d4cce0_100%)] text-purple-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f2ecf8_0%,#e8e0f0_52%,#dcd4e6_100%)] text-purple-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🕯️",
    bombEmoji: "💎",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (!isHiddenOrFlagged) return undefined;

      const rand = mulberry32((row + 1) * 54301 + (col + 1) * 19927);
      const jewelColors = [
        { main: "180,40,40", glow: "220,80,80" },
        { main: "30,60,180", glow: "80,120,240" },
        { main: "100,20,160", glow: "160,80,220" },
        { main: "20,130,60", glow: "60,180,100" },
        { main: "180,130,20", glow: "220,180,60" },
        { main: "20,100,130", glow: "60,160,190" },
      ];
      const color = jewelColors[Math.floor(rand() * jewelColors.length)];
      const cx = (38 + rand() * 24).toFixed(1);
      const cy = (38 + rand() * 24).toFixed(1);

      return {
        backgroundImage: `radial-gradient(ellipse at ${cx}% ${cy}%, rgba(${color.glow},0.55) 0%, rgba(${color.main},0.4) 28%, rgba(${color.main},0.15) 52%, transparent 70%)`,
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "sandstone-canyon": {
    green:
      "bg-[linear-gradient(162deg,#6b3a1a_0%,#9c5428_52%,#4a280f_100%)] text-orange-50",
    lightGreen:
      "bg-[linear-gradient(162deg,#7a4220_0%,#ab6030_52%,#553015_100%)] text-orange-50",
    gray: "bg-[linear-gradient(145deg,#f5e6d0_0%,#eddcc2_52%,#e4d1b5_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f9edd8_0%,#f2e3ca_52%,#e9d8bc_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🏜️",
    bombEmoji: "⛏️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const strataPhase = row % 4;
      const strataAlphas = [0.18, 0.14, 0.12, 0.2];
      const alpha = strataAlphas[strataPhase];
      const strataY = 32 + strataPhase * 8;
      const secondY = strataY + 20 + (col % 3) * 4;

      if (isHiddenOrFlagged) {
        return {
          backgroundImage: `linear-gradient(0deg, transparent 0 ${strataY}%, rgba(139,69,19,${alpha}) ${strataY}% ${strataY + 5}%, transparent ${strataY + 5}% 100%), linear-gradient(0deg, transparent 0 ${secondY}%, rgba(160,82,45,${(alpha * 0.8).toFixed(2)}) ${secondY}% ${secondY + 3}%, transparent ${secondY + 3}% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(139,90,43,0.24) 0 8%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(139,90,43,0.24) 0 8%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(139,90,43,0.24) 0 8%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(139,90,43,0.24) 0 8%, transparent 14%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "terracotta-kiln": {
    green:
      "bg-[linear-gradient(155deg,#8b3518_0%,#cc5030_52%,#6a2810_100%)] text-orange-50",
    lightGreen:
      "bg-[linear-gradient(155deg,#9c3e20_0%,#da5e38_52%,#783218_100%)] text-orange-50",
    gray: "bg-[linear-gradient(145deg,#faf2e8_0%,#f2e8da_52%,#e8dcc8_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#fdf6f0_0%,#f6eee2_52%,#ede4d4_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🏺",
    bombEmoji: "💥",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 62147 + (col + 1) * 38923);
        const glowAlpha = (0.2 + rand() * 0.15).toFixed(2);
        const crackAngle = Math.floor(rand() * 160);
        const crackPos = (30 + rand() * 40).toFixed(1);
        const crackAlpha = (0.08 + rand() * 0.06).toFixed(2);

        return {
          backgroundImage: `linear-gradient(0deg, rgba(255,120,20,${glowAlpha}) 0%, rgba(255,80,10,0.08) 28%, transparent 48%), linear-gradient(${crackAngle}deg, transparent 0 ${crackPos}%, rgba(60,20,5,${crackAlpha}) ${crackPos}% calc(${crackPos}% + 1.2%), transparent calc(${crackPos}% + 1.2%) 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(139,58,26,0.22) 0 8%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(139,58,26,0.22) 0 8%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(139,58,26,0.22) 0 8%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(139,58,26,0.22) 0 8%, transparent 14%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: directional field-line arcs emanate from revealed cells
  // toward revealed neighbors via elliptical gradients. Intensity and center
  // glow scale with connection count; cross-flux lines form for opposing pairs.
  "magnetic-field": {
    green:
      "bg-[linear-gradient(160deg,#1a1e2e_0%,#2a3048_52%,#12161f_100%)] text-blue-100",
    lightGreen:
      "bg-[linear-gradient(160deg,#1e2234_0%,#303850_52%,#161a24_100%)] text-blue-100",
    gray: "bg-[linear-gradient(145deg,#161a26_0%,#1e2434_52%,#121620_100%)] text-blue-100 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#1a1e2c_0%,#22283a_52%,#141824_100%)] text-blue-100 transition-none",
    number: {
      0: "",
      1: "text-sky-300",
      2: "text-lime-300",
      3: "text-rose-300",
      4: "text-violet-300",
      5: "text-amber-300",
      6: "text-teal-300",
      7: "text-orange-300",
      8: "text-zinc-300",
    },
    flagEmoji: "🧭",
    bombEmoji: "⚡",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const phase = (row + col * 2) % 4;
        return {
          backgroundImage: `linear-gradient(${45 + phase * 22}deg, transparent 0 40%, rgba(96,165,250,0.1) 46% 54%, transparent 60% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;

      const revealedTop = !topIsUnrevealed;
      const revealedRight = !rightIsUnrevealed;
      const revealedBottom = !bottomIsUnrevealed;
      const revealedLeft = !leftIsUnrevealed;
      const openCount = [
        revealedTop,
        revealedRight,
        revealedBottom,
        revealedLeft,
      ].filter(Boolean).length;

      if (openCount === 0) {
        return {
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.2) 0 10%, rgba(96,165,250,0.06) 10% 24%, transparent 30%)",
          backgroundRepeat: "no-repeat",
        };
      }

      const lines: string[] = [];
      const intensity = (0.12 + openCount * 0.05).toFixed(2);
      const innerIntensity = (Number(intensity) * 0.45).toFixed(2);

      if (revealedTop) {
        lines.push(
          `radial-gradient(ellipse at 50% 0%, rgba(96,165,250,${intensity}) 0%, transparent 44%)`,
        );
        lines.push(
          `radial-gradient(ellipse at 50% 0%, rgba(147,197,253,${innerIntensity}) 0%, transparent 28%)`,
        );
      }
      if (revealedRight) {
        lines.push(
          `radial-gradient(ellipse at 100% 50%, rgba(96,165,250,${intensity}) 0%, transparent 44%)`,
        );
        lines.push(
          `radial-gradient(ellipse at 100% 50%, rgba(147,197,253,${innerIntensity}) 0%, transparent 28%)`,
        );
      }
      if (revealedBottom) {
        lines.push(
          `radial-gradient(ellipse at 50% 100%, rgba(96,165,250,${intensity}) 0%, transparent 44%)`,
        );
        lines.push(
          `radial-gradient(ellipse at 50% 100%, rgba(147,197,253,${innerIntensity}) 0%, transparent 28%)`,
        );
      }
      if (revealedLeft) {
        lines.push(
          `radial-gradient(ellipse at 0% 50%, rgba(96,165,250,${intensity}) 0%, transparent 44%)`,
        );
        lines.push(
          `radial-gradient(ellipse at 0% 50%, rgba(147,197,253,${innerIntensity}) 0%, transparent 28%)`,
        );
      }

      if (revealedTop && revealedBottom) {
        lines.push(
          "linear-gradient(0deg, rgba(147,197,253,0.06) 0%, transparent 18%, rgba(147,197,253,0.04) 44% 56%, transparent 82%, rgba(147,197,253,0.06) 100%)",
        );
      }
      if (revealedLeft && revealedRight) {
        lines.push(
          "linear-gradient(90deg, rgba(147,197,253,0.06) 0%, transparent 18%, rgba(147,197,253,0.04) 44% 56%, transparent 82%, rgba(147,197,253,0.06) 100%)",
        );
      }

      const centerAlpha = (0.1 + openCount * 0.04).toFixed(2);
      lines.push(
        `radial-gradient(circle at 50% 50%, rgba(96,165,250,${centerAlpha}) 0 8%, transparent 16%)`,
      );

      return {
        backgroundImage: lines.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "mycelium-web": {
    green:
      "bg-[linear-gradient(162deg,#0d1a0d_0%,#1a3020_52%,#0a140a_100%)] text-lime-100",
    lightGreen:
      "bg-[linear-gradient(162deg,#112218_0%,#1f3a26_52%,#0e1a0e_100%)] text-lime-100",
    gray: "bg-[linear-gradient(145deg,#f4f0e6_0%,#e8e0d2_52%,#ddd4c4_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f8f4ec_0%,#ede6d8_52%,#e3dcce_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🍄",
    bombEmoji: "☠️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 47359 + (col + 1) * 91283);
        if (rand() < 0.06) return undefined;

        const glowColors = [
          "200,180,60",
          "180,220,80",
          "100,200,180",
          "220,140,180",
          "160,200,100",
        ];

        const count = rand() < 0.35 ? 1 : rand() < 0.75 ? 2 : 3;
        const layers: string[] = [];

        for (let i = 0; i < count; i++) {
          const color = glowColors[Math.floor(rand() * glowColors.length)];
          const x = (12 + rand() * 76).toFixed(1);
          const y = (12 + rand() * 76).toFixed(1);
          const capSize = (2 + rand() * 4).toFixed(2);
          const haloSize = (Number(capSize) + 3 + rand() * 3).toFixed(2);
          const capAlpha = (0.6 + rand() * 0.25).toFixed(2);
          const haloAlpha = (0.15 + rand() * 0.1).toFixed(2);

          layers.push(
            `radial-gradient(circle at ${x}% ${y}%, rgba(${color},${capAlpha}) 0 ${capSize}%, rgba(${color},${haloAlpha}) ${capSize}% ${haloSize}%, transparent ${haloSize}%)`,
          );
        }

        const threadAngle = Math.floor(rand() * 180);
        layers.push(
          `linear-gradient(${threadAngle}deg, transparent 0 40%, rgba(180,200,100,0.08) 46% 54%, transparent 60% 100%)`,
        );

        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const threads: string[] = [];
      if (!topIsUnrevealed)
        threads.push(
          "linear-gradient(0deg, transparent 0 40%, rgba(180,160,100,0.18) 46% 54%, rgba(180,160,100,0.06) 54% 100%)",
        );
      if (!rightIsUnrevealed)
        threads.push(
          "linear-gradient(270deg, transparent 0 40%, rgba(180,160,100,0.18) 46% 54%, rgba(180,160,100,0.06) 54% 100%)",
        );
      if (!bottomIsUnrevealed)
        threads.push(
          "linear-gradient(180deg, transparent 0 40%, rgba(180,160,100,0.18) 46% 54%, rgba(180,160,100,0.06) 54% 100%)",
        );
      if (!leftIsUnrevealed)
        threads.push(
          "linear-gradient(90deg, transparent 0 40%, rgba(180,160,100,0.18) 46% 54%, rgba(180,160,100,0.06) 54% 100%)",
        );

      if (!threads.length) return undefined;
      return {
        backgroundImage: threads.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "obsidian-fracture": {
    green:
      "bg-[linear-gradient(160deg,#08040e_0%,#160c24_52%,#06030a_100%)] text-purple-100",
    lightGreen:
      "bg-[linear-gradient(160deg,#0c0614_0%,#1e102e_52%,#0a050e_100%)] text-purple-100",
    gray: "bg-[linear-gradient(145deg,#ede8f4_0%,#e2daea_52%,#d8cee2_100%)] text-purple-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f2eef8_0%,#e8e2ee_52%,#dfd8e8_100%)] text-purple-950 transition-none",
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
    flagEmoji: "🔮",
    bombEmoji: "💥",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 58331 + (col + 1) * 42191);
        const layers: string[] = [];
        const highlightCount = rand() < 0.5 ? 1 : 2;

        for (let i = 0; i < highlightCount; i++) {
          const hx = (18 + rand() * 64).toFixed(1);
          const hy = (18 + rand() * 64).toFixed(1);
          const hSize = (3 + rand() * 6).toFixed(2);
          const hAlpha = (0.12 + rand() * 0.14).toFixed(2);
          layers.push(
            `radial-gradient(ellipse at ${hx}% ${hy}%, rgba(200,180,255,${hAlpha}) 0 ${hSize}%, transparent ${(Number(hSize) + 6).toFixed(2)}%)`,
          );
        }

        const sheenAngle = Math.floor(140 + rand() * 40);
        layers.push(
          `linear-gradient(${sheenAngle}deg, transparent 0 20%, rgba(160,140,220,0.08) 34% 46%, transparent 60% 100%)`,
        );

        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const fractures: string[] = [];
      const fracAngle = (row + col) % 2 === 0 ? 35 : 145;

      if (topIsUnrevealed)
        fractures.push(
          "linear-gradient(180deg, rgba(100,60,140,0.28) 0 6%, rgba(100,60,140,0.08) 6% 12%, transparent 16%)",
        );
      if (rightIsUnrevealed)
        fractures.push(
          "linear-gradient(270deg, rgba(100,60,140,0.28) 0 6%, rgba(100,60,140,0.08) 6% 12%, transparent 16%)",
        );
      if (bottomIsUnrevealed)
        fractures.push(
          "linear-gradient(0deg, rgba(100,60,140,0.28) 0 6%, rgba(100,60,140,0.08) 6% 12%, transparent 16%)",
        );
      if (leftIsUnrevealed)
        fractures.push(
          "linear-gradient(90deg, rgba(100,60,140,0.28) 0 6%, rgba(100,60,140,0.08) 6% 12%, transparent 16%)",
        );

      fractures.push(
        `linear-gradient(${fracAngle}deg, transparent 0 38%, rgba(100,60,140,0.14) 44% 48%, transparent 54% 100%)`,
      );

      return {
        backgroundImage: fractures.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "rice-paddy": {
    green:
      "bg-[linear-gradient(158deg,#1a4a18_0%,#2e7028_52%,#153a12_100%)] text-lime-50",
    lightGreen:
      "bg-[linear-gradient(158deg,#225420_0%,#3a8032_52%,#1c4418_100%)] text-lime-50",
    gray: "bg-[linear-gradient(145deg,#f5e8c4_0%,#eddcac_52%,#e4d098_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f9eece_0%,#f2e4b8_52%,#e9d8a4_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🌾",
    bombEmoji: "🐸",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const terrace = row % 3;

      if (isHiddenOrFlagged) {
        const reflectionY = 28 + terrace * 16;
        const reflectionAlpha = (0.18 + (col % 2) * 0.06).toFixed(2);
        return {
          backgroundImage: `linear-gradient(0deg, transparent 0 ${reflectionY}%, rgba(180,220,255,${reflectionAlpha}) ${reflectionY}% ${reflectionY + 6}%, transparent ${reflectionY + 6}% 100%), linear-gradient(${92 + terrace * 2}deg, rgba(255,255,255,0.06) 0 38%, transparent 42% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];

      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(160,120,40,0.3) 0 6%, rgba(160,120,40,0.12) 6% 12%, transparent 16%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(160,120,40,0.3) 0 6%, rgba(160,120,40,0.12) 6% 12%, transparent 16%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(160,120,40,0.3) 0 6%, rgba(160,120,40,0.12) 6% 12%, transparent 16%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(160,120,40,0.3) 0 6%, rgba(160,120,40,0.12) 6% 12%, transparent 16%)",
        );

      const grainPhase = (row * 2 + col) % 4;
      edges.push(
        `linear-gradient(${80 + grainPhase * 12}deg, transparent 0 32%, rgba(180,140,40,0.1) 40% 48%, transparent 56% 100%)`,
      );

      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: 8-direction crystal arms grow toward each revealed
  // neighbor using conic gradients. Cardinal neighbors produce wider/brighter
  // arms, diagonal neighbors produce narrower/softer arms. No existing skin
  // uses diagonal neighbors as primary visual drivers on revealed cells.
  "crystal-lattice": {
    green:
      "bg-[linear-gradient(165deg,#0c1830_0%,#182a4a_52%,#08101e_100%)] text-sky-100",
    lightGreen:
      "bg-[linear-gradient(165deg,#101e38_0%,#1e3254_52%,#0c1624_100%)] text-sky-100",
    gray: "bg-[linear-gradient(145deg,#eef2fa_0%,#e2e8f4_52%,#d6deee_100%)] text-indigo-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f4f6fc_0%,#eaeff6_52%,#dee6f0_100%)] text-indigo-950 transition-none",
    number: {
      0: "",
      1: "text-blue-600",
      2: "text-emerald-600",
      3: "text-rose-600",
      4: "text-violet-600",
      5: "text-amber-600",
      6: "text-cyan-600",
      7: "text-orange-600",
      8: "text-slate-600",
    },
    flagEmoji: "💠",
    bombEmoji: "✴️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
      topLeftIsUnrevealed,
      topRightIsUnrevealed,
      bottomRightIsUnrevealed,
      bottomLeftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const facet = (row * 3 + col * 2) % 6;
        return {
          backgroundImage: `linear-gradient(${60 + facet * 30}deg, transparent 0 36%, rgba(147,197,253,0.14) 44% 56%, transparent 64% 100%), linear-gradient(${120 + facet * 15}deg, transparent 0 42%, rgba(99,102,241,0.1) 48% 52%, transparent 58% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;

      const arm = (fromDeg: number, width: number, alpha: number) =>
        `conic-gradient(from ${fromDeg}deg at 50% 50%, rgba(99,165,255,${alpha}) 0deg ${width}deg, transparent ${width}deg 360deg)`;

      const arms: string[] = [];
      if (!topIsUnrevealed) arms.push(arm(340, 40, 0.2));
      if (!topRightIsUnrevealed) arms.push(arm(30, 28, 0.13));
      if (!rightIsUnrevealed) arms.push(arm(70, 40, 0.2));
      if (!bottomRightIsUnrevealed) arms.push(arm(120, 28, 0.13));
      if (!bottomIsUnrevealed) arms.push(arm(160, 40, 0.2));
      if (!bottomLeftIsUnrevealed) arms.push(arm(210, 28, 0.13));
      if (!leftIsUnrevealed) arms.push(arm(250, 40, 0.2));
      if (!topLeftIsUnrevealed) arms.push(arm(300, 28, 0.13));

      if (!arms.length) return undefined;

      const centerAlpha = (0.06 + arms.length * 0.025).toFixed(2);
      const centerSize = (6 + arms.length * 1.2).toFixed(1);
      arms.push(
        `radial-gradient(circle at 50% 50%, rgba(99,165,255,${centerAlpha}) 0 ${centerSize}%, transparent ${(Number(centerSize) + 8).toFixed(1)}%)`,
      );

      return {
        backgroundImage: arms.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "sumi-ink": {
    green:
      "bg-[linear-gradient(155deg,#121210_0%,#1e1e1a_52%,#0e0e0c_100%)] text-stone-200",
    lightGreen:
      "bg-[linear-gradient(155deg,#181816_0%,#282824_52%,#141412_100%)] text-stone-200",
    gray: "bg-[linear-gradient(145deg,#f4ede0_0%,#ebe2d0_52%,#e0d6c2_100%)] text-stone-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f8f2e6_0%,#f0e8d8_52%,#e6dcc8_100%)] text-stone-900 transition-none",
    number: {
      0: "",
      1: "text-indigo-800",
      2: "text-emerald-800",
      3: "text-red-800",
      4: "text-purple-800",
      5: "text-amber-800",
      6: "text-teal-800",
      7: "text-orange-800",
      8: "text-stone-600",
    },
    flagEmoji: "🎌",
    bombEmoji: "💢",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 52489 + (col + 1) * 38371);
        const strokeAngle = Math.floor(75 + rand() * 30);
        const inkAlpha = (0.08 + rand() * 0.12).toFixed(2);
        const washX = (30 + rand() * 40).toFixed(1);
        const washY = (30 + rand() * 40).toFixed(1);
        const washSize = (18 + rand() * 16).toFixed(1);
        const washAlpha = (0.15 + rand() * 0.12).toFixed(2);

        return {
          backgroundImage: `linear-gradient(${strokeAngle}deg, transparent 0 24%, rgba(60,50,40,${inkAlpha}) 32% 38%, transparent 46% 100%), radial-gradient(ellipse at ${washX}% ${washY}%, rgba(40,30,20,${washAlpha}) 0 ${washSize}%, transparent ${(Number(washSize) + 12).toFixed(1)}%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(30,20,10,0.2) 0 8%, transparent 16%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(30,20,10,0.2) 0 8%, transparent 16%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(30,20,10,0.2) 0 8%, transparent 16%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(30,20,10,0.2) 0 8%, transparent 16%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "pressed-tin": {
    green:
      "bg-[linear-gradient(155deg,#2a3228_0%,#3e4e38_52%,#1e2820_100%)] text-emerald-50 shadow-[inset_0_0_0_1px_rgba(180,180,160,0.2)]",
    lightGreen:
      "bg-[linear-gradient(155deg,#324030_0%,#485a40_52%,#263228_100%)] text-emerald-50 shadow-[inset_0_0_0_1px_rgba(180,180,160,0.18)]",
    gray: "bg-[linear-gradient(145deg,#d8dce0_0%,#ccd2d8_52%,#c0c6cc_100%)] text-slate-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#e4e8ec_0%,#d8dee4_52%,#ccd4da_100%)] text-slate-900 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-600",
    },
    flagEmoji: "🔩",
    bombEmoji: "⚒️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const phase = (row + col) % 2;

      if (isHiddenOrFlagged) {
        const crossAlpha = phase === 0 ? 0.16 : 0.12;
        const medallionAlpha = phase === 0 ? 0.2 : 0.16;
        return {
          backgroundImage: `linear-gradient(0deg, transparent 44%, rgba(200,200,180,${crossAlpha}) 44% 56%, transparent 56%), linear-gradient(90deg, transparent 44%, rgba(200,200,180,${crossAlpha}) 44% 56%, transparent 56%), radial-gradient(circle at 50% 50%, rgba(220,210,180,${medallionAlpha}) 0 8%, rgba(200,200,180,0.08) 8% 14%, transparent 18%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(60,60,60,0.2) 0 6%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(60,60,60,0.2) 0 6%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(60,60,60,0.2) 0 6%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(60,60,60,0.2) 0 6%, transparent 14%)",
        );

      const sheenAngle = 140 + phase * 20;
      edges.push(
        `linear-gradient(${sheenAngle}deg, transparent 0 30%, rgba(255,255,255,0.12) 44% 56%, transparent 70% 100%)`,
      );

      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "meteor-shower": {
    green:
      "bg-[linear-gradient(170deg,#04071a_0%,#0c1430_52%,#030510_100%)] text-blue-100",
    lightGreen:
      "bg-[linear-gradient(170deg,#060a20_0%,#101c3a_52%,#050816_100%)] text-blue-100",
    gray: "bg-[linear-gradient(145deg,#c8c0b0_0%,#bcb4a2_52%,#b0a896_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#d4ccbc_0%,#c8c0ae_52%,#bcb4a4_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-600",
    },
    flagEmoji: "🛸",
    bombEmoji: "🌠",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 73019 + (col + 1) * 51647);
        const layers: string[] = [];

        if (rand() > 0.25) {
          const streakAngle = Math.floor(200 + rand() * 50);
          const streakPos = (20 + rand() * 60).toFixed(1);
          const streakAlpha = (0.3 + rand() * 0.25).toFixed(2);
          const trailAlpha = (0.08 + rand() * 0.08).toFixed(2);
          layers.push(
            `linear-gradient(${streakAngle}deg, transparent 0 ${streakPos}%, rgba(255,240,200,${streakAlpha}) ${streakPos}% calc(${streakPos}% + 1.5%), rgba(255,180,80,${trailAlpha}) calc(${streakPos}% + 1.5%) calc(${streakPos}% + 8%), transparent calc(${streakPos}% + 8%) 100%)`,
          );
        }

        const starCount = 1 + Math.floor(rand() * 2);
        for (let i = 0; i < starCount; i++) {
          const sx = (10 + rand() * 80).toFixed(1);
          const sy = (10 + rand() * 80).toFixed(1);
          const sAlpha = (0.4 + rand() * 0.4).toFixed(2);
          const sSize = (0.6 + rand() * 1.2).toFixed(2);
          layers.push(
            `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,${sAlpha}) 0 ${sSize}%, transparent ${(Number(sSize) + 1.5).toFixed(2)}%)`,
          );
        }

        if (!layers.length) return undefined;
        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(80,70,50,0.3) 0 6%, rgba(80,70,50,0.1) 6% 14%, transparent 18%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(80,70,50,0.3) 0 6%, rgba(80,70,50,0.1) 6% 14%, transparent 18%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(80,70,50,0.3) 0 6%, rgba(80,70,50,0.1) 6% 14%, transparent 18%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(80,70,50,0.3) 0 6%, rgba(80,70,50,0.1) 6% 14%, transparent 18%)",
        );

      const rand = mulberry32((row + 1) * 59317 + (col + 1) * 27491);
      if (rand() > 0.4) {
        const cx = (30 + rand() * 40).toFixed(1);
        const cy = (30 + rand() * 40).toFixed(1);
        const craterSize = (8 + rand() * 10).toFixed(1);
        edges.push(
          `radial-gradient(circle at ${cx}% ${cy}%, rgba(60,50,35,0.18) 0 ${craterSize}%, rgba(90,80,60,0.06) ${craterSize}% ${(Number(craterSize) + 8).toFixed(1)}%, transparent ${(Number(craterSize) + 12).toFixed(1)}%)`,
        );
      }

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: cellValue drives concentric contour ring density on
  // revealed cells. 0 = flat terrain (no rings), high values = dense tight
  // elevation rings with color shift from green to brown. No existing skin
  // uses cellValue as a visual overlay driver.
  "contour-map": {
    green:
      "bg-[linear-gradient(158deg,#1a4028_0%,#2a6040_52%,#14321e_100%)] text-lime-50",
    lightGreen:
      "bg-[linear-gradient(158deg,#225030_0%,#347048_52%,#1c3c24_100%)] text-lime-50",
    gray: "bg-[linear-gradient(145deg,#f0e8d0_0%,#e6dcc0_52%,#dcd0b2_100%)] text-stone-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f5eedc_0%,#ece4cc_52%,#e2d8be_100%)] text-stone-900 transition-none",
    number: {
      0: "",
      1: "text-green-800",
      2: "text-emerald-700",
      3: "text-amber-800",
      4: "text-orange-800",
      5: "text-red-800",
      6: "text-rose-700",
      7: "text-purple-800",
      8: "text-stone-800",
    },
    flagEmoji: "📍",
    bombEmoji: "🕳️",
    getOverlayStyle: ({
      row,
      col,
      cellValue,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 62893 + (col + 1) * 43517);
        const canopyX = (20 + rand() * 60).toFixed(1);
        const canopyY = (20 + rand() * 60).toFixed(1);
        const canopyAlpha = (0.18 + rand() * 0.12).toFixed(2);
        const canopySize = (12 + rand() * 18).toFixed(1);

        return {
          backgroundImage: `radial-gradient(circle at ${canopyX}% ${canopyY}%, rgba(34,197,94,${canopyAlpha}) 0 ${canopySize}%, transparent ${(Number(canopySize) + 10).toFixed(1)}%), linear-gradient(${Math.floor(140 + rand() * 40)}deg, transparent 0 38%, rgba(22,163,74,0.1) 46% 54%, transparent 62% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const value = typeof cellValue === "number" ? cellValue : 0;
      const rings: string[] = [];

      if (value > 0) {
        const ringCount = Math.min(Math.ceil(value / 2), 4);
        const baseAlpha = 0.12 + (value / 8) * 0.16;
        const minR = 12;
        const maxR = 44;
        const contourColor =
          value <= 3
            ? "34,120,60"
            : value <= 6
              ? "140,100,30"
              : "160,50,30";

        for (let i = 0; i < ringCount; i++) {
          const r = minR + ((maxR - minR) * (i + 1)) / (ringCount + 1);
          const ringWidth = 1.5;
          const alpha = (baseAlpha + i * 0.02).toFixed(2);
          rings.push(
            `radial-gradient(circle at 50% 50%, transparent 0 ${(r - ringWidth).toFixed(1)}%, rgba(${contourColor},${alpha}) ${(r - ringWidth).toFixed(1)}% ${r.toFixed(1)}%, transparent ${r.toFixed(1)}% 100%)`,
          );
        }
      }

      if (topIsUnrevealed)
        rings.push(
          "linear-gradient(180deg, rgba(100,80,40,0.28) 0 6%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        rings.push(
          "linear-gradient(270deg, rgba(100,80,40,0.28) 0 6%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        rings.push(
          "linear-gradient(0deg, rgba(100,80,40,0.28) 0 6%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        rings.push(
          "linear-gradient(90deg, rgba(100,80,40,0.28) 0 6%, transparent 14%)",
        );

      if (!rings.length) return undefined;
      return {
        backgroundImage: rings.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "tidal-pool": {
    green:
      "bg-[linear-gradient(158deg,#1a1e28_0%,#2a323e_52%,#12161e_100%)] text-sky-100",
    lightGreen:
      "bg-[linear-gradient(158deg,#222832_0%,#323c48_52%,#1a1e28_100%)] text-sky-100",
    gray: "bg-[linear-gradient(145deg,#e8dcc8_0%,#ddd0b8_52%,#d2c4a8_100%)] text-stone-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f0e4d0_0%,#e5d8c4_52%,#daceb6_100%)] text-stone-900 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-600",
    },
    flagEmoji: "🐚",
    bombEmoji: "🦑",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 61843 + (col + 1) * 97321);
        if (rand() < 0.1) return undefined;

        const anemoneColors = [
          { body: "180,60,160", tip: "220,120,200" },
          { body: "240,100,60", tip: "255,160,80" },
          { body: "60,180,120", tip: "120,220,160" },
          { body: "100,60,200", tip: "160,120,240" },
          { body: "220,180,40", tip: "250,220,80" },
        ];
        const count = rand() < 0.4 ? 1 : rand() < 0.8 ? 2 : 3;
        const layers: string[] = [];

        for (let i = 0; i < count; i++) {
          const color = anemoneColors[Math.floor(rand() * anemoneColors.length)];
          const x = (14 + rand() * 72).toFixed(1);
          const y = (14 + rand() * 72).toFixed(1);
          const bodySize = (3 + rand() * 5).toFixed(2);
          const tipSize = (Number(bodySize) + 2 + rand() * 3).toFixed(2);
          const bodyAlpha = (0.55 + rand() * 0.2).toFixed(2);
          const tipAlpha = (0.2 + rand() * 0.15).toFixed(2);

          layers.push(
            `radial-gradient(circle at ${x}% ${y}%, rgba(${color.body},${bodyAlpha}) 0 ${bodySize}%, rgba(${color.tip},${tipAlpha}) ${bodySize}% ${tipSize}%, transparent ${tipSize}%)`,
          );
        }

        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(100,200,220,0.3) 0 6%, rgba(100,200,220,0.1) 6% 14%, transparent 18%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(100,200,220,0.3) 0 6%, rgba(100,200,220,0.1) 6% 14%, transparent 18%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(100,200,220,0.3) 0 6%, rgba(100,200,220,0.1) 6% 14%, transparent 18%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(100,200,220,0.3) 0 6%, rgba(100,200,220,0.1) 6% 14%, transparent 18%)",
        );

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "woven-textile": {
    green:
      "bg-[linear-gradient(160deg,#0e1530_0%,#1c2848_52%,#0a1020_100%)] text-indigo-100",
    lightGreen:
      "bg-[linear-gradient(160deg,#141c38_0%,#243252_52%,#0e1628_100%)] text-indigo-100",
    gray: "bg-[linear-gradient(145deg,#f0e8d6_0%,#e6dcc6_52%,#dcd0b8_100%)] text-stone-900 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#f6eede_0%,#ece4d0_52%,#e2d8c2_100%)] text-stone-900 transition-none",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-purple-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    flagEmoji: "🧵",
    bombEmoji: "✂️",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      const warpPhase = row % 3;
      const weftPhase = col % 3;

      if (isHiddenOrFlagged) {
        const warpY = 24 + warpPhase * 18;
        const weftX = 24 + weftPhase * 18;
        const warpAlpha = (0.14 + (col % 2) * 0.04).toFixed(2);
        const weftAlpha = (0.12 + (row % 2) * 0.04).toFixed(2);
        return {
          backgroundImage: `linear-gradient(0deg, transparent 0 ${warpY}%, rgba(180,160,220,${warpAlpha}) ${warpY}% ${warpY + 4}%, transparent ${warpY + 4}% 100%), linear-gradient(0deg, transparent 0 ${warpY + 28}%, rgba(160,140,200,${(Number(warpAlpha) * 0.7).toFixed(2)}) ${warpY + 28}% ${warpY + 31}%, transparent ${warpY + 31}% 100%), linear-gradient(90deg, transparent 0 ${weftX}%, rgba(200,180,140,${weftAlpha}) ${weftX}% ${weftX + 4}%, transparent ${weftX + 4}% 100%), linear-gradient(90deg, transparent 0 ${weftX + 28}%, rgba(180,160,120,${(Number(weftAlpha) * 0.7).toFixed(2)}) ${weftX + 28}% ${weftX + 31}%, transparent ${weftX + 31}% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(80,60,40,0.22) 0 6%, rgba(80,60,40,0.06) 6% 14%, transparent 18%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(80,60,40,0.22) 0 6%, rgba(80,60,40,0.06) 6% 14%, transparent 18%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(80,60,40,0.22) 0 6%, rgba(80,60,40,0.06) 6% 14%, transparent 18%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(80,60,40,0.22) 0 6%, rgba(80,60,40,0.06) 6% 14%, transparent 18%)",
        );

      const revealedWeft = 24 + weftPhase * 18;
      edges.push(
        `linear-gradient(90deg, transparent 0 ${revealedWeft}%, rgba(160,140,100,0.1) ${revealedWeft}% ${revealedWeft + 3}%, transparent ${revealedWeft + 3}% 100%)`,
      );

      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  "amber-resin": {
    green:
      "bg-[linear-gradient(162deg,#6a3a08_0%,#9c5c14_52%,#4a2804_100%)] text-amber-50",
    lightGreen:
      "bg-[linear-gradient(162deg,#7a4410_0%,#b06a1c_52%,#563008_100%)] text-amber-50",
    gray: "bg-[linear-gradient(145deg,#f8ecc8_0%,#f2e2b4_52%,#ecd8a0_100%)] text-amber-950 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#faf2d4_0%,#f6e8c0_52%,#f0deae_100%)] text-amber-950 transition-none",
    number: {
      0: "",
      1: "text-blue-800",
      2: "text-green-800",
      3: "text-red-800",
      4: "text-purple-800",
      5: "text-amber-900",
      6: "text-teal-800",
      7: "text-orange-800",
      8: "text-stone-700",
    },
    flagEmoji: "🦟",
    bombEmoji: "💥",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const rand = mulberry32((row + 1) * 88397 + (col + 1) * 36551);
        const layers: string[] = [];

        const bubbleCount = rand() < 0.3 ? 1 : rand() < 0.7 ? 2 : 3;
        for (let i = 0; i < bubbleCount; i++) {
          const bx = (12 + rand() * 76).toFixed(1);
          const by = (12 + rand() * 76).toFixed(1);
          const bSize = (1.5 + rand() * 3).toFixed(2);
          const bFade = (Number(bSize) + 1.5 + rand() * 1.5).toFixed(2);
          const bAlpha = (0.25 + rand() * 0.2).toFixed(2);
          layers.push(
            `radial-gradient(circle at ${bx}% ${by}%, rgba(255,240,180,${bAlpha}) 0 ${bSize}%, rgba(255,220,120,${(Number(bAlpha) * 0.3).toFixed(2)}) ${bSize}% ${bFade}%, transparent ${bFade}%)`,
          );
        }

        if (rand() > 0.4) {
          const veinAngle = Math.floor(120 + rand() * 60);
          const veinPos = (28 + rand() * 44).toFixed(1);
          const veinAlpha = (0.1 + rand() * 0.08).toFixed(2);
          layers.push(
            `linear-gradient(${veinAngle}deg, transparent 0 ${veinPos}%, rgba(120,60,0,${veinAlpha}) ${veinPos}% calc(${veinPos}% + 1.5%), transparent calc(${veinPos}% + 1.5%) 100%)`,
          );
        }

        return {
          backgroundImage: layers.join(","),
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;
      const edges: string[] = [];
      if (topIsUnrevealed)
        edges.push(
          "linear-gradient(180deg, rgba(160,100,20,0.24) 0 6%, transparent 14%)",
        );
      if (rightIsUnrevealed)
        edges.push(
          "linear-gradient(270deg, rgba(160,100,20,0.24) 0 6%, transparent 14%)",
        );
      if (bottomIsUnrevealed)
        edges.push(
          "linear-gradient(0deg, rgba(160,100,20,0.24) 0 6%, transparent 14%)",
        );
      if (leftIsUnrevealed)
        edges.push(
          "linear-gradient(90deg, rgba(160,100,20,0.24) 0 6%, transparent 14%)",
        );

      const rand = mulberry32((row + 1) * 44729 + (col + 1) * 81563);
      if (rand() > 0.5) {
        const fx = (30 + rand() * 40).toFixed(1);
        const fy = (20 + rand() * 60).toFixed(1);
        edges.push(
          `radial-gradient(ellipse at ${fx}% ${fy}%, rgba(255,250,220,0.22) 0 8%, transparent 18%)`,
        );
      }

      if (!edges.length) return undefined;
      return {
        backgroundImage: edges.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
  // New mechanic skin: 8-neighbor state-agreement resonance. Each revealed cell
  // counts how many of all 8 neighbors are also revealed, yielding a density
  // score 0-8. Ring count, glow intensity, and hue shift (blue→green→amber)
  // scale with score. No existing skin uses all 8 neighbors as a continuous
  // scalar density metric.
  "resonance-grid": {
    green:
      "bg-[linear-gradient(165deg,#0a0e1e_0%,#161e34_52%,#060a14_100%)] text-blue-100",
    lightGreen:
      "bg-[linear-gradient(165deg,#0e1224_0%,#1c263e_52%,#0a0e1a_100%)] text-blue-100",
    gray: "bg-[linear-gradient(145deg,#101828_0%,#182236_52%,#0c1420_100%)] text-blue-100 transition-none",
    silver:
      "bg-[linear-gradient(145deg,#141c2e_0%,#1c283c_52%,#101824_100%)] text-blue-100 transition-none",
    number: {
      0: "",
      1: "text-sky-300",
      2: "text-emerald-300",
      3: "text-rose-300",
      4: "text-violet-300",
      5: "text-amber-300",
      6: "text-teal-300",
      7: "text-orange-300",
      8: "text-zinc-200",
    },
    flagEmoji: "📡",
    bombEmoji: "⚡",
    getOverlayStyle: ({
      row,
      col,
      isHiddenOrFlagged,
      cellStatus,
      topIsUnrevealed,
      rightIsUnrevealed,
      bottomIsUnrevealed,
      leftIsUnrevealed,
      topLeftIsUnrevealed,
      topRightIsUnrevealed,
      bottomRightIsUnrevealed,
      bottomLeftIsUnrevealed,
    }: CellSkinPatternContext): CSSProperties | undefined => {
      if (isHiddenOrFlagged) {
        const band = (row * 2 + col) % 5;
        return {
          backgroundImage: `linear-gradient(${30 + band * 12}deg, transparent 0 38%, rgba(96,165,250,0.12) 44% 56%, transparent 62% 100%), linear-gradient(${150 + band * 8}deg, transparent 0 42%, rgba(56,189,248,0.08) 48% 52%, transparent 58% 100%)`,
          backgroundRepeat: "no-repeat",
        };
      }

      if (cellStatus !== "revealed") return undefined;

      const revealedNeighbors = [
        !topIsUnrevealed,
        !topRightIsUnrevealed,
        !rightIsUnrevealed,
        !bottomRightIsUnrevealed,
        !bottomIsUnrevealed,
        !bottomLeftIsUnrevealed,
        !leftIsUnrevealed,
        !topLeftIsUnrevealed,
      ].filter(Boolean).length;

      if (revealedNeighbors === 0) {
        return {
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(96,165,250,0.12) 0 6%, transparent 14%)",
          backgroundRepeat: "no-repeat",
        };
      }

      const t = revealedNeighbors / 8;
      const r = Math.round(96 + t * 160);
      const g = Math.round(165 + t * (180 - 165) * (1 - t));
      const b = Math.round(250 * (1 - t * 0.7));
      const colorStr = `${r},${g},${b}`;

      const rings: string[] = [];
      const ringCount = Math.min(Math.ceil(revealedNeighbors / 2), 4);
      const baseAlpha = 0.08 + t * 0.14;

      for (let i = 0; i < ringCount; i++) {
        const radius = 10 + ((36 - 10) * (i + 1)) / (ringCount + 1);
        const ringWidth = 1.8;
        const alpha = (baseAlpha + i * 0.015).toFixed(3);
        rings.push(
          `radial-gradient(circle at 50% 50%, transparent 0 ${(radius - ringWidth).toFixed(1)}%, rgba(${colorStr},${alpha}) ${(radius - ringWidth).toFixed(1)}% ${radius.toFixed(1)}%, transparent ${radius.toFixed(1)}% 100%)`,
        );
      }

      const glowAlpha = (0.1 + t * 0.2).toFixed(2);
      const glowSize = (6 + t * 10).toFixed(1);
      rings.push(
        `radial-gradient(circle at 50% 50%, rgba(${colorStr},${glowAlpha}) 0 ${glowSize}%, transparent ${(Number(glowSize) + 8).toFixed(1)}%)`,
      );

      const phase = (row + col * 3) % 6;
      rings.push(
        `linear-gradient(${60 + phase * 30}deg, transparent 0 42%, rgba(${colorStr},0.04) 48% 52%, transparent 58% 100%)`,
      );

      return {
        backgroundImage: rings.join(","),
        backgroundRepeat: "no-repeat",
      };
    },
  },
} as Record<string, CellSkinDefinition>;
