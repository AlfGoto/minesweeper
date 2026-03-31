import {
  $get,
  $set,
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
    skin: CellSkinName | BannerSkinName | BackgroundSkinName,
    currentUser: {
      unlockedSkins?: {
        cells?: Set<string>
        banner?: Set<string>
        background?: Set<string>
      }
      selectedSkin?: {
        cells?: string
        banner?: string
        background?: string
      }
    }
  ) => {
    console.log("currentUser.unlockedSkins:", currentUser.unlockedSkins)
    console.log("currentUser.selectedSkin:", currentUser.selectedSkin)

    const existingSet = currentUser.unlockedSkins?.[skinType] ?? new Set<string>()
    console.log("existingSet:", existingSet)

    const newUnlockedSkins = {
      ...currentUser.unlockedSkins,
      [skinType]: new Set([...existingSet, skin])
    }
    console.log("newUnlockedSkins:", newUnlockedSkins)

    const newSelectedSkin = {
      ...currentUser.selectedSkin,
      [skinType]: skin
    }
    console.log("newSelectedSkin:", newSelectedSkin)

    const item = {
      userEmail,
      userId: $get("userId"),
      userName: $get("userName"),
      userPicture: $get("userPicture"),
      unlockedSkins: $set(newUnlockedSkins),
      selectedSkin: $set(newSelectedSkin)
    }
    console.log("Transaction item:", JSON.stringify(item, (_, v) => v instanceof Set ? [...v] : v, 2))

    return UserEntity.build(UpdateTransaction).item(item)
  }
}
