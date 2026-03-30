import {
  $add,
  $get,
  QueryCommand,
  UpdateAttributesCommand,
  UpdateTransaction
} from "dynamodb-toolbox"
import {
  UserEntity,
  UserEntityType,
  cellsSkinsNames,
  bannerSkinsNames,
  backgroundSkinsNames,
  skinTypes
} from "./user.entity"
import { MinesweeperBffTable } from "../dynamodb"

type SkinType = (typeof skinTypes)[number]
type CellSkinName = (typeof cellsSkinsNames)[number]
type BannerSkinName = (typeof bannerSkinsNames)[number]
type BackgroundSkinName = (typeof backgroundSkinsNames)[number]

export namespace User {
  export const update = async (user: UserEntityType) => {
    await UserEntity.build(UpdateAttributesCommand).item(user).send()
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

  export const getAddUnlockedSkinTransaction = (
    userEmail: string,
    skinType: SkinType,
    skin: CellSkinName | BannerSkinName | BackgroundSkinName
  ) => {
    return UserEntity.build(UpdateTransaction).item({
      userEmail,

      userId: $get("userId"),
      userName: $get("userName"),
      userPicture: $get("userPicture"),
      unlockedSkins: {
        [skinType]: $add(new Set([skin]))
      },
      selectedSkin: {
        [skinType]: skin
      }
    })
  }
}
