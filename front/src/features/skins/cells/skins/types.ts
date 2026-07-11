import type { CSSProperties } from "react";
import type { Cell } from "@/types/game";

export type NumberSkinMap = Record<number, string>;

export type SkinFaq = {
  question: string;
  answer: string;
};

export type SkinTranslation = {
  name?: string;
  description?: string;
  longDescription?: string;
  keywords?: string[];
  faq?: SkinFaq[];
};

export type CellSkinPatternContext = {
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

export type UnrevealedNeighborContext = Pick<
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

export type CellSkinDefinition = {
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
  name?: string;
  slug?: string;
  description?: string;
  longDescription?: string;
  keywords?: string[];
  faq?: SkinFaq[];
  translations?: Record<string, SkinTranslation>;
};

export type EmojiTileSkinConfig = {
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
  translations?: Record<string, SkinTranslation>;
};
