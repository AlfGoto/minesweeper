export const skinTypes = ["cells", "banner", "background"] as const

const CHIP = 15 as const
const NORMAL = 22 as const
const RARE = 40 as const

export const cellsSkins = {
  default: 0,
  flowerfloor: RARE,
  "inferno-hard": NORMAL,
  igloo: RARE,
  "jade-temple": CHIP,
  "paper-cutout": CHIP,
  "void-orchid": CHIP,
  "minimal-zoned": RARE,
  antic: NORMAL,
  "emoji-tiles": CHIP,
  "heart-tiles": CHIP,
  "laughing-faces": CHIP,
  "fruit-basket": CHIP,
  "red-burst": CHIP,
  "orange-pop": CHIP,
  "yellow-zest": CHIP,
  "green-garden": CHIP,
  "blue-lagoon": CHIP,
  "purple-parade": CHIP,
  classic: NORMAL
}
export const cellsSkinsNames = Object.keys(cellsSkins) as Array<keyof typeof cellsSkins>

export const bannerSkins = {
  default: 0,
  level: 10,
  gold: 10
}
export const bannerSkinsNames = Object.keys(bannerSkins) as Array<keyof typeof bannerSkins>

export const backgroundSkins = {
  default: 0,
  "flower-floor": 15,
  igloo: 15,
  "aurora-drift": 15,
  "retro-grid": 15,
  "amber-dunes": 15,
  "deep-reef": 15
}
export const backgroundSkinsNames = Object.keys(backgroundSkins) as Array<
  keyof typeof backgroundSkins
>

export type SkinType = (typeof skinTypes)[number]
export type CellSkinName = (typeof cellsSkinsNames)[number]
export type BannerSkinName = (typeof bannerSkinsNames)[number]
export type BackgroundSkinName = (typeof backgroundSkinsNames)[number]
export type SkinName = CellSkinName | BannerSkinName | BackgroundSkinName
