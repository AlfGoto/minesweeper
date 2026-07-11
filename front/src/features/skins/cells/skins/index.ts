import type { CSSProperties } from "react";
import type { Cell } from "@/types/game";
import { HEIGHT } from "@/vars";
import { CellSkin } from "@/types/bff";

import type {
  CellSkinDefinition,
  CellSkinPatternContext,
  UnrevealedNeighborContext,
  SkinFaq,
  NumberSkinMap,
  SkinTranslation,
} from "./types";

import { defaultSkin } from "./default";
import { classicSkin } from "./classic";
import { flowerfloorSkin } from "./flowerfloor";
import { infernoHardSkin } from "./inferno-hard";
import { iglooSkin } from "./igloo";
import { jadeTempleSkin } from "./jade-temple";
import { paperCutoutSkin } from "./paper-cutout";
import { voidOrchidSkin } from "./void-orchid";
import { minimalZonedSkin } from "./minimal-zoned";
import { anticSkin } from "./antic";
import { emojiTilesSkin } from "./emoji-tiles";
import { heartTilesSkin } from "./heart-tiles";
import { laughingFacesSkin } from "./laughing-faces";
import { fruitBasketSkin } from "./fruit-basket";
import { redBurstSkin } from "./red-burst";
import { orangePopSkin } from "./orange-pop";
import { yellowZestSkin } from "./yellow-zest";
import { greenGardenSkin } from "./green-garden";
import { blueLagoonSkin } from "./blue-lagoon";
import { purpleParadeSkin } from "./purple-parade";

export type {
  CellSkinDefinition,
  CellSkinPatternContext,
  UnrevealedNeighborContext,
  SkinFaq,
  NumberSkinMap,
  SkinTranslation,
};

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

type GetSkinContext = CellSkinPatternContext & {
  skin: CellSkin;
};

export const getSkin = ({ skin, ...context }: GetSkinContext) => {
  const definition =
    CellSkins[skin] ?? NonPublishedCellSkins[skin] ?? defaultSkin;
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

export const CellSkins: Record<string, CellSkinDefinition> = {
  default: defaultSkin,
  classic: classicSkin,
  flowerfloor: flowerfloorSkin,
  "inferno-hard": infernoHardSkin,
  igloo: iglooSkin,
  "jade-temple": jadeTempleSkin,
  "paper-cutout": paperCutoutSkin,
  "void-orchid": voidOrchidSkin,
  "minimal-zoned": minimalZonedSkin,
  antic: anticSkin,
  "emoji-tiles": emojiTilesSkin,
  "heart-tiles": heartTilesSkin,
  "laughing-faces": laughingFacesSkin,
  "fruit-basket": fruitBasketSkin,
  "red-burst": redBurstSkin,
  "orange-pop": orangePopSkin,
  "yellow-zest": yellowZestSkin,
  "green-garden": greenGardenSkin,
  "blue-lagoon": blueLagoonSkin,
  "purple-parade": purpleParadeSkin,
};

export const NonPublishedCellSkins = {} as Record<string, CellSkinDefinition>;

export type LocalizedSkinMeta = {
  name: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: SkinFaq[];
};

export const getLocalizedSkinMeta = (
  skin: CellSkinDefinition,
  locale: string,
): LocalizedSkinMeta => {
  const base: LocalizedSkinMeta = {
    name: skin.name ?? "",
    description: skin.description ?? "",
    longDescription: skin.longDescription ?? "",
    keywords: skin.keywords ?? [],
    faq: skin.faq ?? [],
  };

  if (locale === "en" || !skin.translations?.[locale]) {
    return base;
  }

  const localized = skin.translations[locale];
  return {
    name: localized.name ?? base.name,
    description: localized.description ?? base.description,
    longDescription: localized.longDescription ?? base.longDescription,
    keywords: localized.keywords ?? base.keywords,
    faq: localized.faq ?? base.faq,
  };
};

export type PublishedSkinMeta = {
  id: CellSkin;
  slug: string;
} & LocalizedSkinMeta;

export const getPublishedSkinsWithMeta = (
  locale: string = "en",
): PublishedSkinMeta[] => {
  return Object.entries(CellSkins)
    .filter(
      ([, skin]) =>
        skin.name && skin.slug && skin.description && skin.longDescription,
    )
    .map(([id, skin]) => ({
      id: id as CellSkin,
      slug: skin.slug!,
      ...getLocalizedSkinMeta(skin, locale),
    }));
};

export const getSkinMetaBySlug = (
  slug: string,
  locale: string = "en",
): PublishedSkinMeta | undefined => {
  const entry = Object.entries(CellSkins).find(
    ([, skin]) => skin.slug === slug,
  );
  if (
    !entry ||
    !entry[1].name ||
    !entry[1].description ||
    !entry[1].longDescription
  ) {
    return undefined;
  }
  const [id, skin] = entry;
  return {
    id: id as CellSkin,
    slug: skin.slug!,
    ...getLocalizedSkinMeta(skin, locale),
  };
};

export const getAllSkinSlugs = (): string[] => {
  return Object.values(CellSkins)
    .filter((skin) => skin.slug)
    .map((skin) => skin.slug!);
};
