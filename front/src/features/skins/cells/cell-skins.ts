import type { CSSProperties } from "react";
import type { Cell } from "@/types/game";
import { HEIGHT } from "@/vars";
import { CellSkin } from "@/types/bff";

type NumberSkinMap = Record<number, string>;

type SkinFaq = {
  question: string;
  answer: string;
};

type EmojiTileSkinConfig = {
  name: string;
  slug: string;
  hiddenA: string;
  hiddenB: string;
  revealedA: string;
  revealedB: string;
  number: NumberSkinMap;
  emojis: string[];
  glossRgb: string;
  shadowRgb: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: SkinFaq[];
};

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
  // SEO metadata for published skins
  name?: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  keywords?: string[];
  faq?: SkinFaq[];
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

const bgLayers = (...layers: string[]): CSSProperties => ({
  backgroundImage: layers.join(","),
  backgroundRepeat: "no-repeat",
});

const svgDataUri = (svg: string) =>
  `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`;

const emojiTileLayer = (emoji: string, rotation: number) =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <text
        x="50"
        y="56"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="88"
        transform="rotate(${rotation} 50 50)"
        font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      >
        ${emoji}
      </text>
    </svg>
  `);

const createEmojiTileSkin = ({
  name,
  slug,
  hiddenA,
  hiddenB,
  revealedA,
  revealedB,
  number,
  emojis,
  glossRgb,
  shadowRgb,
  description,
  longDescription,
  keywords,
  faq,
}: EmojiTileSkinConfig): CellSkinDefinition => ({
  green: hiddenA,
  lightGreen: hiddenB,
  gray: `${revealedA} transition-none`,
  silver: `${revealedB} transition-none`,
  number,
  getOverlayStyle: ({
    row,
    col,
    cellStatus,
    isHiddenOrFlagged,
  }: CellSkinPatternContext): CSSProperties | undefined => {
    if (!isHiddenOrFlagged || cellStatus === "revealed") return undefined;

    const rand = mulberry32((row + 1) * 14387 + (col + 1) * 58217);
    const emoji = emojis[Math.floor(rand() * emojis.length)] ?? emojis[0] ?? "🟪";
    const rotation = Math.floor(-10 + rand() * 21);
    const glossAngle = Math.floor(105 + rand() * 40);
    const glossAlpha = (0.05 + rand() * 0.06).toFixed(2);
    const shadowAlpha = (0.1 + rand() * 0.08).toFixed(2);

    return {
      ...bgLayers(
        `linear-gradient(${glossAngle}deg, rgba(${glossRgb},${glossAlpha}) 0%, rgba(${glossRgb},0) 42%)`,
        `linear-gradient(180deg, rgba(${shadowRgb},0) 0%, rgba(${shadowRgb},${shadowAlpha}) 100%)`,
        emojiTileLayer(emoji, rotation),
      ),
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    };
  },
  name,
  slug,
  description,
  longDescription,
  keywords,
  faq,
});

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
  name: "Classic",
  slug: "classic",
  description:
    "The original Minesweeper look with lime green unrevealed cells and warm tan revealed tiles. A timeless design that brings back nostalgic memories.",
  longDescription:
    "The Classic skin recreates the beloved original Minesweeper aesthetic that millions of players grew up with. Featuring vibrant lime green cells for unrevealed areas and soft wheat-colored revealed tiles, this skin delivers pure nostalgia. The familiar red flag and bomb emojis complete the authentic experience. Perfect for players who appreciate the timeless design that made Minesweeper a worldwide phenomenon.",
  keywords: [
    "classic minesweeper skin",
    "original minesweeper theme",
    "retro minesweeper",
    "nostalgic minesweeper",
    "traditional minesweeper design",
  ],
};

export const CellSkins: Record<string, CellSkinDefinition> = {
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
        ...bgLayers(...gradients),
        backgroundColor: "#ffffff",
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

      return bgLayers(...layers);
    },
  },
  "emoji-tiles": createEmojiTileSkin({
    name: "Emoji Tiles",
    slug: "emoji-tiles",
    hiddenA:
      "bg-[linear-gradient(160deg,#1f2937_0%,#111827_100%)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#273449_0%,#172033_100%)] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#f7f7f5_0%,#efeee9_52%,#e6e3db_100%)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.18)]",
    revealedB:
      "bg-[linear-gradient(145deg,#ffffff_0%,#f7f5f0_52%,#eeebe3_100%)] text-slate-900 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-rose-700",
      4: "text-violet-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-orange-700",
      8: "text-slate-700",
    },
    emojis: ["🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛"],
    glossRgb: "255,255,255",
    shadowRgb: "15,23,42",
    description:
      "A playful emoji Minesweeper skin with full-cell square emoji backgrounds on unrevealed tiles and clean revealed cells for sharp readability.",
    longDescription:
      "The Emoji Tiles skin turns every unrevealed Minesweeper cell into a bold square emoji tile while keeping revealed cells clean, bright, and easy to scan. The emoji art is rendered in the background layer, so flags still sit clearly on top of hidden cells instead of being covered. That makes this skin playful without hurting gameplay clarity. It is ideal for players who want a fun emoji look, high contrast between hidden and revealed states, and readable number colors during fast games.",
    keywords: [
      "emoji minesweeper skin",
      "emoji tiles minesweeper",
      "square emoji minesweeper theme",
      "fun minesweeper skin",
      "playful minesweeper theme",
      "readable minesweeper skin",
    ],
    faq: [
      {
        question: "What is the Emoji Tiles skin in Minesweeper?",
        answer:
          "Emoji Tiles is a published Minesweeper skin that fills unrevealed cells with oversized square emoji artwork while keeping revealed cells clean and neutral for easier number reading.",
      },
      {
        question: "Can I still see flags on the Emoji Tiles skin?",
        answer:
          "Yes. The square emoji artwork is drawn in the cell background, so the flag stays visible on top of hidden cells and remains easy to recognize during play.",
      },
      {
        question: "Why are the revealed cells plain in the Emoji Tiles theme?",
        answer:
          "The revealed cells are intentionally simple so the contrast between hidden and revealed states stays strong and Minesweeper numbers remain readable at gameplay size.",
      },
    ],
  }),
  "heart-tiles": createEmojiTileSkin({
    name: "Heart Tiles",
    slug: "heart-tiles",
    hiddenA:
      "bg-[linear-gradient(160deg,#7f1d1d_0%,#4c0519_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#9f1239_0%,#5b0823_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#fff1f2_0%,#ffe4e6_52%,#fecdd3_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fff7f7_0%,#ffeef2_52%,#ffd8e4_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,114,182,0.15)]",
    number: {
      0: "",
      1: "text-rose-700",
      2: "text-pink-700",
      3: "text-red-700",
      4: "text-fuchsia-700",
      5: "text-orange-700",
      6: "text-purple-700",
      7: "text-amber-700",
      8: "text-stone-700",
    },
    emojis: ["❤️", "💖", "💗", "💘", "💝", "🩷", "💜"],
    glossRgb: "255,255,255",
    shadowRgb: "76,5,25",
    description:
      "A romantic emoji Minesweeper skin with heart-filled unrevealed cells and soft pastel revealed tiles that keep the board readable.",
    longDescription:
      "The Heart Tiles skin fills hidden Minesweeper cells with oversized heart emojis while revealed cells stay soft, bright, and uncluttered. Because the heart artwork lives in the background layer, flags can still be placed clearly on top without losing visibility. The pink and rose palette makes the board feel playful and warm, while the simplified revealed tiles preserve contrast for fast decision-making.",
    keywords: [
      "heart minesweeper skin",
      "heart emoji minesweeper",
      "pink minesweeper theme",
      "cute minesweeper skin",
      "romantic minesweeper theme",
      "emoji heart game skin",
    ],
    faq: [
      {
        question: "What is the Heart Tiles skin in Minesweeper?",
        answer:
          "Heart Tiles is a published Minesweeper skin that covers unrevealed cells with large heart emoji artwork and keeps revealed cells simple and pastel-toned.",
      },
      {
        question: "Does the Heart Tiles skin make flags harder to see?",
        answer:
          "No. The heart emojis are part of the background, so the flag still appears on top and remains easy to identify during gameplay.",
      },
      {
        question: "Who is the Heart Tiles Minesweeper skin for?",
        answer:
          "It is ideal for players who want a cute, expressive, emoji-heavy board without sacrificing number readability or hidden-versus-revealed contrast.",
      },
    ],
  }),
  "laughing-faces": createEmojiTileSkin({
    name: "Laughing Faces",
    slug: "laughing-faces",
    hiddenA:
      "bg-[linear-gradient(160deg,#854d0e_0%,#713f12_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#a16207_0%,#78350f_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#fffbe8_0%,#fef3c7_52%,#fde68a_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(245,158,11,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fffdf0_0%,#fef7d7_52%,#fdeca6_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-lime-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-orange-700",
      6: "text-cyan-700",
      7: "text-amber-800",
      8: "text-stone-700",
    },
    emojis: ["😂", "🤣", "😆", "😄", "😹", "😅"],
    glossRgb: "255,255,255",
    shadowRgb: "120,53,15",
    description:
      "A cheerful emoji Minesweeper skin with laughing faces on unrevealed cells and sunny revealed tiles designed to stay easy to read.",
    longDescription:
      "The Laughing Faces skin gives hidden Minesweeper cells a bright, playful personality with oversized laughing emoji backgrounds. Revealed cells stay clean and warm-toned so the grid remains readable even when you are scanning quickly. The emoji art sits behind the gameplay content, which means flags still appear clearly on top and the board keeps the same functional logic as other published skins.",
    keywords: [
      "laughing emoji minesweeper skin",
      "funny minesweeper theme",
      "laughing faces minesweeper",
      "happy emoji game skin",
      "yellow minesweeper theme",
      "playful minesweeper skin",
    ],
    faq: [
      {
        question: "What is the Laughing Faces skin in Minesweeper?",
        answer:
          "Laughing Faces is a published Minesweeper skin that uses large laughing emoji artwork on unrevealed cells and bright neutral reveals for better readability.",
      },
      {
        question: "Can I still flag cells with the Laughing Faces theme?",
        answer:
          "Yes. The emoji faces are rendered behind the gameplay layer, so flags stay visible and do not get replaced by the artwork.",
      },
      {
        question: "Why does the Laughing Faces skin keep revealed cells simple?",
        answer:
          "The clean revealed tiles help preserve quick board scanning, which is important in Minesweeper when you need to read numbers and patterns at a glance.",
      },
    ],
  }),
  "fruit-basket": createEmojiTileSkin({
    name: "Fruit Basket",
    slug: "fruit-basket",
    hiddenA:
      "bg-[linear-gradient(160deg,#14532d_0%,#052e16_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#166534_0%,#14532d_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#f7fee7_0%,#ecfccb_52%,#d9f99d_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(132,204,22,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fbffe9_0%,#f0fdd8_52%,#dcf7b1_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(101,163,13,0.14)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    emojis: ["🍎", "🍊", "🍋", "🍉", "🍓", "🍒", "🥝", "🍇"],
    glossRgb: "255,255,255",
    shadowRgb: "20,46,22",
    description:
      "A fresh fruit emoji Minesweeper skin with juicy unrevealed cells and crisp light revealed tiles for clear number reading.",
    longDescription:
      "The Fruit Basket skin turns hidden Minesweeper cells into a rotating mix of fruit emojis such as apples, oranges, lemons, watermelons, strawberries, cherries, kiwis, and grapes. Revealed cells stay crisp and lightly tinted so the board remains readable and the color contrast between hidden and revealed states stays obvious. Since the fruit art is painted into the background layer, flags still sit cleanly above the emoji artwork.",
    keywords: [
      "fruit minesweeper skin",
      "fruit emoji minesweeper",
      "food emoji minesweeper theme",
      "fresh minesweeper skin",
      "cute fruit game skin",
      "green minesweeper emoji theme",
    ],
    faq: [
      {
        question: "What is the Fruit Basket skin in Minesweeper?",
        answer:
          "Fruit Basket is a published Minesweeper skin that decorates unrevealed cells with large fruit emoji artwork while keeping revealed cells light and easy to scan.",
      },
      {
        question: "Which emojis appear in the Fruit Basket skin?",
        answer:
          "The Fruit Basket skin uses a seeded mix of fruit emojis including apples, oranges, lemons, watermelons, strawberries, cherries, kiwis, and grapes.",
      },
      {
        question: "Does the Fruit Basket skin still support normal flag placement?",
        answer:
          "Yes. The fruit emoji graphics are rendered behind the gameplay content, so flags remain clearly visible on top of hidden cells.",
      },
    ],
  }),
  "red-burst": createEmojiTileSkin({
    name: "Red Burst",
    slug: "red-burst",
    hiddenA:
      "bg-[linear-gradient(160deg,#7f1d1d_0%,#450a0a_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#991b1b_0%,#5f1010_100%)] text-rose-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#fff1f2_0%,#ffe4e6_52%,#fecdd3_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(244,63,94,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fff7f7_0%,#ffeef2_52%,#ffd5dd_100%)] text-rose-950 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-orange-700",
      6: "text-cyan-700",
      7: "text-amber-700",
      8: "text-stone-700",
    },
    emojis: ["❤️", "🌹", "🍓", "🍒", "🍎", "🎈", "🧧", "🟥"],
    glossRgb: "255,255,255",
    shadowRgb: "69,10,10",
    description:
      "A red emoji Minesweeper skin that keeps every unrevealed tile inside a bold crimson palette while revealed cells stay clean and readable.",
    longDescription:
      "The Red Burst skin gives hidden Minesweeper cells a fully red emoji pool, mixing symbols like hearts, roses, cherries, strawberries, apples, and other crimson icons. Every unrevealed tile stays in the same color family, which creates a stronger monochrome theme across the board. Revealed cells remain simple and pale so numbers are easy to read and flags still appear clearly over the background artwork.",
    keywords: [
      "red emoji minesweeper skin",
      "red minesweeper theme",
      "monochrome emoji skin",
      "red aesthetic minesweeper",
      "crimson minesweeper skin",
      "same color emoji theme",
    ],
    faq: [
      {
        question: "What is the Red Burst skin in Minesweeper?",
        answer:
          "Red Burst is a published Minesweeper skin that uses only red-themed emojis on unrevealed cells and keeps revealed cells minimal for easy scanning.",
      },
      {
        question: "Do all emojis in the Red Burst skin share the same color family?",
        answer:
          "Yes. The unrevealed tiles in Red Burst use a seeded set of emojis that all stay inside a red or crimson palette.",
      },
      {
        question: "Can I still place flags normally with the Red Burst theme?",
        answer:
          "Yes. The emoji artwork is rendered in the background, so the normal flag stays visible on top of hidden cells.",
      },
    ],
  }),
  "orange-pop": createEmojiTileSkin({
    name: "Orange Pop",
    slug: "orange-pop",
    hiddenA:
      "bg-[linear-gradient(160deg,#9a3412_0%,#7c2d12_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#c2410c_0%,#9a3412_100%)] text-orange-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#fff7ed_0%,#ffedd5_52%,#fed7aa_100%)] text-orange-950 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fffaf1_0%,#fff0dc_52%,#ffdcb4_100%)] text-orange-950 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-green-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-orange-700",
      6: "text-cyan-700",
      7: "text-amber-800",
      8: "text-stone-700",
    },
    emojis: ["🧡", "🍊", "🥕", "🦊", "🏀", "🔶", "🟧", "🎃"],
    glossRgb: "255,255,255",
    shadowRgb: "124,45,18",
    description:
      "A vivid orange emoji Minesweeper skin with a same-color emoji pool on hidden cells and warm clean reveals.",
    longDescription:
      "Orange Pop keeps every hidden tile inside an orange emoji palette, using icons like oranges, carrots, foxes, basketballs, orange hearts, and orange geometric shapes. Because all of the emoji artwork belongs to the same color family, the board feels cohesive instead of random. Revealed cells stay warm and light to preserve gameplay readability while flags remain clearly layered above the artwork.",
    keywords: [
      "orange emoji minesweeper skin",
      "orange minesweeper theme",
      "same color emoji minesweeper",
      "warm minesweeper skin",
      "orange aesthetic game skin",
      "emoji color theme minesweeper",
    ],
    faq: [
      {
        question: "What is the Orange Pop skin in Minesweeper?",
        answer:
          "Orange Pop is a published Minesweeper skin that limits unrevealed cells to orange-themed emojis for a consistent color-coded look.",
      },
      {
        question: "Why does the Orange Pop skin feel more unified than mixed emoji skins?",
        answer:
          "Because every hidden tile pulls from the same orange color family, the grid reads as one clear theme instead of a rainbow mix.",
      },
      {
        question: "Is the Orange Pop skin still readable during fast games?",
        answer:
          "Yes. The revealed cells stay intentionally clean, which keeps number recognition and hidden-versus-revealed contrast strong.",
      },
    ],
  }),
  "yellow-zest": createEmojiTileSkin({
    name: "Yellow Zest",
    slug: "yellow-zest",
    hiddenA:
      "bg-[linear-gradient(160deg,#a16207_0%,#713f12_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#ca8a04_0%,#854d0e_100%)] text-yellow-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#fffde8_0%,#fef9c3_52%,#fde68a_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(234,179,8,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fffef0_0%,#fefad8_52%,#fdeaa7_100%)] text-amber-950 shadow-[inset_0_0_0_1px_rgba(250,204,21,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-lime-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-orange-700",
      6: "text-cyan-700",
      7: "text-amber-800",
      8: "text-stone-700",
    },
    emojis: ["💛", "⭐", "🌙", "☀️", "🍋", "🐥", "🌼", "🟡"],
    glossRgb: "255,255,255",
    shadowRgb: "113,63,18",
    description:
      "A bright yellow emoji Minesweeper skin with sunshine-colored hidden tiles and crisp pale reveals.",
    longDescription:
      "Yellow Zest uses a fully yellow emoji pool for unrevealed Minesweeper cells, mixing stars, moons, suns, lemons, chicks, flowers, and yellow geometric icons. The consistent yellow palette makes the board feel energetic and instantly recognizable. Revealed cells stay restrained and light so the important gameplay information remains easy to read and flags stay visible on top of hidden cells.",
    keywords: [
      "yellow emoji minesweeper skin",
      "yellow minesweeper theme",
      "sunny emoji minesweeper",
      "monochrome yellow game skin",
      "bright minesweeper skin",
      "same color emoji yellow theme",
    ],
    faq: [
      {
        question: "What is the Yellow Zest skin in Minesweeper?",
        answer:
          "Yellow Zest is a published Minesweeper skin that keeps hidden cells inside a yellow-only emoji palette for a bright monochrome look.",
      },
      {
        question: "Which kinds of emojis appear in Yellow Zest?",
        answer:
          "Yellow Zest uses a seeded set of yellow emojis such as stars, moons, suns, lemons, chicks, flowers, and yellow shapes.",
      },
      {
        question: "Does Yellow Zest still prioritize number readability?",
        answer:
          "Yes. The revealed tiles are intentionally clean and pale so numbers remain easy to read during normal gameplay.",
      },
    ],
  }),
  "green-garden": createEmojiTileSkin({
    name: "Green Garden",
    slug: "green-garden",
    hiddenA:
      "bg-[linear-gradient(160deg,#166534_0%,#14532d_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#15803d_0%,#166534_100%)] text-lime-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#f7fee7_0%,#ecfccb_52%,#d9f99d_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(132,204,22,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fbffef_0%,#f0fdd8_52%,#dcf7b1_100%)] text-lime-950 shadow-[inset_0_0_0_1px_rgba(101,163,13,0.14)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-amber-700",
      6: "text-teal-700",
      7: "text-orange-700",
      8: "text-stone-700",
    },
    emojis: ["💚", "🍀", "🌵", "🥝", "🐢", "🐸", "🟢", "🍏"],
    glossRgb: "255,255,255",
    shadowRgb: "20,46,22",
    description:
      "A green emoji Minesweeper skin with same-color hidden tiles and fresh readable reveals.",
    longDescription:
      "Green Garden gives unrevealed Minesweeper cells a monochrome green emoji pool built from clovers, cacti, kiwis, turtles, frogs, green hearts, apples, and green shapes. Every hidden tile stays in the same color family, which makes the board feel calm and coherent. Revealed tiles remain simple and lightly tinted so numbers stand out and flags stay easy to identify above the artwork.",
    keywords: [
      "green emoji minesweeper skin",
      "green minesweeper theme",
      "garden emoji minesweeper",
      "same color green emoji skin",
      "nature minesweeper emoji theme",
      "monochrome green game skin",
    ],
    faq: [
      {
        question: "What is the Green Garden skin in Minesweeper?",
        answer:
          "Green Garden is a published Minesweeper skin that uses only green-themed emojis on hidden cells for a calm color-coded board.",
      },
      {
        question: "Are all emojis in Green Garden part of the same color family?",
        answer:
          "Yes. Its unrevealed tiles use a seeded set of green emojis so the theme stays visually consistent across the grid.",
      },
      {
        question: "Does Green Garden change how flags work?",
        answer:
          "No. Flags still work the same way and remain visible because the emoji artwork is placed in the background layer.",
      },
    ],
  }),
  "blue-lagoon": createEmojiTileSkin({
    name: "Blue Lagoon",
    slug: "blue-lagoon",
    hiddenA:
      "bg-[linear-gradient(160deg,#1d4ed8_0%,#1e3a8a_100%)] text-sky-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#2563eb_0%,#1d4ed8_100%)] text-sky-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#eff6ff_0%,#dbeafe_52%,#bfdbfe_100%)] text-sky-950 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#f5f9ff_0%,#e3efff_52%,#cfe1ff_100%)] text-sky-950 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-indigo-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-slate-700",
      8: "text-stone-700",
    },
    emojis: ["💙", "🫐", "🐟", "🦋", "🧢", "🌊", "🔷", "🟦"],
    glossRgb: "255,255,255",
    shadowRgb: "30,58,138",
    description:
      "A blue emoji Minesweeper skin with a same-color hidden emoji pool and cool airy revealed tiles.",
    longDescription:
      "Blue Lagoon keeps every unrevealed Minesweeper tile inside a blue emoji palette, using icons like blue hearts, blueberries, fish, butterflies, waves, caps, and blue shapes. The result is a cleaner monochrome look that still feels lively because each cell can rotate through different blue symbols. Revealed tiles stay light and cool-toned to preserve number readability and maintain strong contrast against hidden cells.",
    keywords: [
      "blue emoji minesweeper skin",
      "blue minesweeper theme",
      "ocean emoji minesweeper",
      "same color blue game skin",
      "cool minesweeper emoji theme",
      "monochrome blue minesweeper",
    ],
    faq: [
      {
        question: "What is the Blue Lagoon skin in Minesweeper?",
        answer:
          "Blue Lagoon is a published Minesweeper skin that uses blue-only emojis for hidden cells and clean cool-toned reveals for readability.",
      },
      {
        question: "Why does Blue Lagoon use only blue emojis?",
        answer:
          "The single-color emoji pool gives the board a stronger identity and makes the theme feel more intentional than a mixed-color set.",
      },
      {
        question: "Can flags still sit over the Blue Lagoon emoji artwork?",
        answer:
          "Yes. The artwork remains in the background layer, so the flag stays visible above the emoji tile.",
      },
    ],
  }),
  "purple-parade": createEmojiTileSkin({
    name: "Purple Parade",
    slug: "purple-parade",
    hiddenA:
      "bg-[linear-gradient(160deg,#6b21a8_0%,#4c1d95_100%)] text-fuchsia-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    hiddenB:
      "bg-[linear-gradient(160deg,#7e22ce_0%,#6b21a8_100%)] text-fuchsia-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
    revealedA:
      "bg-[linear-gradient(145deg,#faf5ff_0%,#f3e8ff_52%,#e9d5ff_100%)] text-purple-950 shadow-[inset_0_0_0_1px_rgba(168,85,247,0.16)]",
    revealedB:
      "bg-[linear-gradient(145deg,#fdf8ff_0%,#f6edff_52%,#eddcff_100%)] text-purple-950 shadow-[inset_0_0_0_1px_rgba(192,132,252,0.15)]",
    number: {
      0: "",
      1: "text-blue-700",
      2: "text-emerald-700",
      3: "text-red-700",
      4: "text-violet-700",
      5: "text-amber-700",
      6: "text-cyan-700",
      7: "text-fuchsia-700",
      8: "text-stone-700",
    },
    emojis: ["💜", "🍆", "🔮", "☂️", "🪻", "🦄", "🟣", "🍇"],
    glossRgb: "255,255,255",
    shadowRgb: "76,29,149",
    description:
      "A purple emoji Minesweeper skin with one-color hidden emoji pools and soft lavender revealed cells.",
    longDescription:
      "Purple Parade builds hidden Minesweeper cells from a purple-only emoji set including hearts, grapes, umbrellas, orbs, lavender flowers, eggplants, unicorns, and purple shapes. Keeping every hidden symbol inside one color family makes the board feel cohesive and stylish without changing gameplay behavior. Revealed cells stay pale and uncluttered so numbers remain readable and flags still appear clearly over hidden tiles.",
    keywords: [
      "purple emoji minesweeper skin",
      "purple minesweeper theme",
      "lavender emoji minesweeper",
      "same color purple game skin",
      "violet minesweeper aesthetic",
      "monochrome emoji theme purple",
    ],
    faq: [
      {
        question: "What is the Purple Parade skin in Minesweeper?",
        answer:
          "Purple Parade is a published Minesweeper skin that uses purple-only emojis on unrevealed cells for a consistent color-first look.",
      },
      {
        question: "Does Purple Parade mix colors on hidden cells?",
        answer:
          "No. Its emoji pool is intentionally limited to purple-toned symbols so the board keeps a monochrome identity.",
      },
      {
        question: "Will the Purple Parade theme still be easy to play with?",
        answer:
          "Yes. The revealed tiles remain simple and light, which keeps number scanning and flag visibility clear during normal play.",
      },
    ],
  }),
};

// Staging area for upcoming cell skins before publishing them in CellSkins.
export const NonPublishedCellSkins = {} as Record<string, CellSkinDefinition>;

// Helper type for published skins with SEO metadata
export type PublishedSkinMeta = {
  id: CellSkin;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: SkinFaq[];
};

// Get all published skins that have SEO metadata
export const getPublishedSkinsWithMeta = (): PublishedSkinMeta[] => {
  return Object.entries(CellSkins)
    .filter(
      ([, skin]) =>
        skin.name && skin.slug && skin.description && skin.longDescription,
    )
    .map(([id, skin]) => ({
      id: id as CellSkin,
      name: skin.name!,
      slug: skin.slug!,
      description: skin.description!,
      longDescription: skin.longDescription!,
      keywords: skin.keywords ?? [],
      faq: skin.faq ?? [],
    }));
};

// Get a single skin by slug
export const getSkinMetaBySlug = (
  slug: string,
): PublishedSkinMeta | undefined => {
  const entry = Object.entries(CellSkins).find(([, skin]) => skin.slug === slug);
  if (!entry || !entry[1].name || !entry[1].description || !entry[1].longDescription) {
    return undefined;
  }
  const [id, skin] = entry;
  return {
    id: id as CellSkin,
    name: skin.name!,
    slug: skin.slug!,
    description: skin.description!,
    longDescription: skin.longDescription!,
    keywords: skin.keywords ?? [],
    faq: skin.faq ?? [],
  };
};

// Get all skin slugs for static generation
export const getAllSkinSlugs = (): string[] => {
  return Object.values(CellSkins)
    .filter((skin) => skin.slug)
    .map((skin) => skin.slug!);
};
