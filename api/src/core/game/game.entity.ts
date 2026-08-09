import { Entity, item, string, InputItem, number, map } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"
import { backgroundSkinsNames, bannerSkinsNames, cellsSkinsNames } from "../skin"

export const status = ["won", "lost", "restarted"]

export const GameEntity = new Entity({
  name: "Game",
  schema: item({
    time: number().key(),
    flags: number(),
    revealed: number(),
    status: string().enum(...status),
    date: string().key(),
    userEmail: string().key(),

    selectedSkin: map({
      cells: string()
        .enum(...cellsSkinsNames)
        .optional(),
      banner: string()
        .enum(...bannerSkinsNames)
        .optional(),
      background: string()
        .enum(...backgroundSkinsNames)
        .optional()
    }).optional()
  }).and((prevSchema) => ({
    GSI1PK: string()
      .key()
      .link<typeof prevSchema>(({ userEmail }) => `USER_BEST_GAMES#${userEmail}`),
    GSI1SK: string()
      .key()
      .link<typeof prevSchema>(({ time }) => `TIME#${String(time).padStart(10, "0")}`)
  })),
  computeKey: ({ userEmail, date }: { userEmail: string; date: string }) => ({
    PK: `GAME#${userEmail}`,
    SK: `GAME#${date}`
  }),
  table: MinesweeperBffTable
})
export type GameEntityType = Omit<InputItem<typeof GameEntity>, "created" | "entity" | "modified">
