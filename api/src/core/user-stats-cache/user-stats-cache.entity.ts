import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

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
    bestTime: number(),
    totalNoFlagsWin: number(),
    totalRestarts: number(),
  }),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: "USER_STATS_CACHE",
    SK: `USER#${userEmail}`,
  }),
  table: MinesweeperBffTable,
})
export type UserStatsCacheEntityType = Omit<InputItem<typeof UserStatsCacheEntity>, "created" | "entity" | "modified">
