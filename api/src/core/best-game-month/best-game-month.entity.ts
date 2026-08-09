import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

export const BestGameMonthEntity = new Entity({
  name: "BestGameMonth",
  schema: item({
    time: number(),
    flags: number(),
    revealed: number(),
    date: string(),
    userEmail: string().key(),
    effectiveMonth: string().key()
  }).and((prevSchema) => ({
    GSI1PK: string()
      .key()
      .link<typeof prevSchema>(() => "BEST_GAMES_MONTH"),
    GSI1SK: string()
      .key()
      .link<typeof prevSchema>(
        ({ effectiveMonth, userEmail }) => `BEST_GAMES_MONTH#${userEmail}#BEST#${effectiveMonth}`
      )
  })),
  computeKey: ({ userEmail, effectiveMonth }: { userEmail: string; effectiveMonth: string }) => ({
    PK: `BEST_GAMES_MONTH#${effectiveMonth}`,
    SK: `BEST#${userEmail}`
  }),
  table: MinesweeperBffTable
})
export type BestGameMonthEntityType = Omit<
  InputItem<typeof BestGameMonthEntity>,
  "created" | "entity" | "modified"
>
