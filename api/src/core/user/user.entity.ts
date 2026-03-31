import { Entity, item, string, InputItem, number, map, set } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

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
  antic: NORMAL
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
