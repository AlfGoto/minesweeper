import { Entity, item, string, InputItem, number } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"

export const UserEntity = new Entity({
  name: "User",
  schema: item({
    userEmail: string().key(),
    userId: string().key(),
    userName: string(),
    userPicture: string(),
    totalNoFlagsWin: number()
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
