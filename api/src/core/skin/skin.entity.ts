import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { backgroundSkinsNames, bannerSkinsNames, cellsSkinsNames, skinTypes } from "./skin.types"
import { MinesweeperBffTable } from "../dynamodb"

export const SkinEntity = new Entity({
  name: "Skin",
  schema: item({
    skinType: string()
      .enum(...skinTypes)
      .key(),
    skinName: string()
      .enum(...cellsSkinsNames, ...bannerSkinsNames, ...backgroundSkinsNames)
      .key(),

    totalGames: number(),
    totalTime: number(),
    totalFlags: number(),
    totalRevealed: number(),
    totalBombs: number(),
    totalWin: number(),
    bestTime: number().optional(),
    totalNoFlagsWin: number(),
    totalRestarts: number()
  }),
  computeKey: ({ skinType, skinName }: { skinType: string; skinName: string }) => ({
    PK: `SKIN#${skinType}`,
    SK: `SKIN#${skinName}`
  }),
  table: MinesweeperBffTable
})
export type SkinEntityType = Omit<InputItem<typeof SkinEntity>, "created" | "entity" | "modified">
