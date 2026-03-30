import { Entity, item, string, InputItem, number, map, set } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

export const skinTypes = ["cells", "banner", "background"] as const

export const cellsSkins = {
  default: 0,
  flowerfloor: 25,
  "inferno-hard": 25,
  igloo: 25,
  "jade-temple": 25,
  "paper-cutout": 25,
  "void-orchid": 25,
  "minimal-zoned": 25,
  antic: 25
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
  red: 10,
  blue: 10
}
export const backgroundSkinsNames = Object.keys(backgroundSkins) as Array<
  keyof typeof backgroundSkins
>

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
      cells: set(string().enum(...cellsSkinsNames)),
      banner: set(string().enum(...bannerSkinsNames)),
      background: set(string().enum(...backgroundSkinsNames))
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
