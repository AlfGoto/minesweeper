import type { BackgroundSkin } from "@/types/bff";
import type {
  BackgroundSkinData,
  BackgroundSkinFaq,
  BackgroundSkinTranslation,
} from "./skins/types";

export type {
  BackgroundSkinData,
  BackgroundSkinFaq,
  BackgroundSkinTranslation,
} from "./skins/types";

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

export type LocalizedBackgroundSkinMeta = {
  name: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: BackgroundSkinFaq[];
};

export const getLocalizedBackgroundSkinMeta = (
  skin: BackgroundSkinData,
  locale: string,
): LocalizedBackgroundSkinMeta => {
  const base: LocalizedBackgroundSkinMeta = {
    name: skin.name,
    description: skin.description,
    longDescription: skin.longDescription,
    keywords: skin.keywords,
    faq: skin.faq,
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

export type BackgroundSkinPreviewMeta = {
  id: string;
  value: string;
  style?: React.CSSProperties;
  slug: string;
} & LocalizedBackgroundSkinMeta;

export const getBackgroundSkinEntries = (
  skinsMap: Record<string, BackgroundSkinData>,
  locale: string = "en",
): BackgroundSkinPreviewMeta[] => {
  return Object.entries(skinsMap).map(([id, skin]) => ({
    id,
    value: skin.value,
    style: skin.style,
    slug: skin.slug,
    ...getLocalizedBackgroundSkinMeta(skin, locale),
  }));
};

export type PublishedBackgroundSkinMeta = BackgroundSkinPreviewMeta & {
  id: BackgroundSkin;
};

export const getPublishedBackgroundSkins = (
  locale: string = "en",
): PublishedBackgroundSkinMeta[] => {
  return getBackgroundSkinEntries(backgroundSkins, locale).map((skin) => ({
    ...skin,
    id: skin.id as BackgroundSkin,
  }));
};

export const getBackgroundSkinMetaBySlug = (
  slug: string,
  locale: string = "en",
): PublishedBackgroundSkinMeta | undefined => {
  return getPublishedBackgroundSkins(locale).find((skin) => skin.slug === slug);
};

export const getAllBackgroundSkinSlugs = (): string[] => {
  return getPublishedBackgroundSkins().map((skin) => skin.slug);
};
