import type { BackgroundSkin } from "@/types/bff";
import type { BackgroundSkinData } from "./skins/types";

export type { BackgroundSkinData, BackgroundSkinFaq } from "./skins/types";

import { defaultSkin } from "./skins/default";
import { flowerFloorSkin } from "./skins/flower-floor";
import { iglooSkin } from "./skins/igloo";
import { auroraDriftSkin } from "./skins/aurora-drift";
import { retroGridSkin } from "./skins/retro-grid";
import { amberDunesSkin } from "./skins/amber-dunes";
import { deepReefSkin } from "./skins/deep-reef";

export const backgroundSkins: Record<BackgroundSkin, BackgroundSkinData> = {
  default: defaultSkin,
  "flower-floor": flowerFloorSkin,
  igloo: iglooSkin,
  "aurora-drift": auroraDriftSkin,
  "retro-grid": retroGridSkin,
  "amber-dunes": amberDunesSkin,
  "deep-reef": deepReefSkin,
};

export const NonPublishedBackgroundSkins: Record<string, BackgroundSkinData> = {};

export type BackgroundSkinPreviewMeta = BackgroundSkinData & {
  id: string;
};

export const getBackgroundSkinEntries = (
  skinsMap: Record<string, BackgroundSkinData>,
): BackgroundSkinPreviewMeta[] => {
  return Object.entries(skinsMap).map(([id, skin]) => ({
    id,
    ...skin,
  }));
};

export type PublishedBackgroundSkinMeta = BackgroundSkinPreviewMeta & {
  id: BackgroundSkin;
};

export const getPublishedBackgroundSkins = (): PublishedBackgroundSkinMeta[] => {
  return getBackgroundSkinEntries(backgroundSkins).map((skin) => ({
    ...skin,
    id: skin.id as BackgroundSkin,
  }));
};

export const getBackgroundSkinMetaBySlug = (
  slug: string,
): PublishedBackgroundSkinMeta | undefined => {
  return getPublishedBackgroundSkins().find((skin) => skin.slug === slug);
};

export const getAllBackgroundSkinSlugs = (): string[] => {
  return getPublishedBackgroundSkins().map((skin) => skin.slug);
};
