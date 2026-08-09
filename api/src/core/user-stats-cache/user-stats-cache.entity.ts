import { Entity, item, string, InputItem, number, map, record } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"
import { CellSkinName, BannerSkinName, BackgroundSkinName } from "../skin"

const skinStatsSchema = map({
  totalGames: number(),
  totalTime: number(),
  totalFlags: number(),
  totalRevealed: number(),
  totalBombs: number(),
  totalWin: number(),
  bestTime: number().optional(),
  totalNoFlagsWin: number(),
  totalRestarts: number()
})

const skinTypeStatsSchema = record(string(), skinStatsSchema)

export const UserStatsCacheEntity = new Entity({
  name: "UserStatsCache",
  schema: item({
    userEmail: string().key(),
    totalGames: number(),
    totalTime: number(),
    totalFlags: number(),
    totalRevealed: number(),
    totalBombs: number(),
    totalWin: number(),
    bestTime: number().optional(),
    totalNoFlagsWin: number(),
    totalRestarts: number(),

    skinStats: map({
      cells: skinTypeStatsSchema.optional(),
      banner: skinTypeStatsSchema.optional(),
      background: skinTypeStatsSchema.optional()
    }).optional()
  }),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: "USER_STATS_CACHE",
    SK: `USER#${userEmail}`
  }),
  table: MinesweeperBffTable
})
export type UserStatsCacheEntityType = Omit<
  InputItem<typeof UserStatsCacheEntity>,
  "created" | "entity" | "modified"
>

export type SkinStatsType = {
  totalGames: number
  totalTime: number
  totalFlags: number
  totalRevealed: number
  totalBombs: number
  totalWin: number
  bestTime?: number
  totalNoFlagsWin: number
  totalRestarts: number
}

export type UserSkinStatsType = {
  cells?: Partial<Record<CellSkinName, SkinStatsType>>
  banner?: Partial<Record<BannerSkinName, SkinStatsType>>
  background?: Partial<Record<BackgroundSkinName, SkinStatsType>>
}
