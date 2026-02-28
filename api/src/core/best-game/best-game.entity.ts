import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

export const BestGameEntity = new Entity({
  name: "BestGame",
  schema: item({
    time: number(),
    flags: number(),
    revealed: number(),
    date: string(),
    userEmail: string().key(),
  }),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: "BEST_GAMES",
    SK: `BEST#${userEmail}`,
  }),
  table: MinesweeperBffTable,
})
export type BestGameEntityType = Omit<InputItem<typeof BestGameEntity>, "created" | "entity" | "modified">
