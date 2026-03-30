import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

export const AlfCoinsEntity = new Entity({
  name: "AlfCoins",
  schema: item({
    userEmail: string().key(),
    points: number()
  }),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: `ALF_COINS#${userEmail}`,
    SK: `ALF_COINS#${userEmail}`
  }),
  table: MinesweeperBffTable
})
export type AlfCoinsEntityType = Omit<
  InputItem<typeof AlfCoinsEntity>,
  "created" | "entity" | "modified"
>
