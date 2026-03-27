import { QueryCommand, UpdateItemCommand } from "dynamodb-toolbox"
import { UserEntity, UserEntityType } from "./user.entity.ts"
import { MinesweeperBffTable } from "../dynamodb"

export namespace User {
  export const update = async (user: UserEntityType) => {
    await UserEntity.build(UpdateItemCommand).item(user).send()
  }

  export const getUserById = async (userId: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `USERID#${userId}`,
        index: "GSI1"
      })
      .entities(UserEntity)
      .send()
    return Items?.[0] ?? null
  }

  export const getUserByEmail = async (userEmail: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `USER#${userEmail}`
      })
      .entities(UserEntity)
      .send()

    return Items?.[0] ?? null
  }
}
