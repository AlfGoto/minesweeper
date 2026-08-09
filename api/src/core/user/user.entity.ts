import { Entity, item, string, InputItem, number, map, set } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"
import { cellsSkinsNames, bannerSkinsNames, backgroundSkinsNames } from "../skin"

export const UserEntity = new Entity({
  name: "User",
  schema: item({
    userEmail: string().key(),
    userId: string().key(),
    userName: string(),
    userPicture: string(),

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
    }).optional(),

    unlockedSkins: map({
      cells: set(string().enum(...cellsSkinsNames)).optional(),
      banner: set(string().enum(...bannerSkinsNames)).optional(),
      background: set(string().enum(...backgroundSkinsNames)).optional()
    }).optional(),

    totalNoFlagsWin: number().optional() // deprecated
  }).and((prevSchema) => ({
    GSI1PK: string()
      .key()
      .link<typeof prevSchema>(({ userId }) => `USERID#${userId}`),
    GSI1SK: string()
      .key()
      .link<typeof prevSchema>(({ userId }) => `USERID#${userId}`)
  })),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: `USER#${userEmail}`,
    SK: `USER#${userEmail}`
  }),
  table: MinesweeperBffTable
})
export type UserEntityType = Omit<InputItem<typeof UserEntity>, "created" | "entity" | "modified">
