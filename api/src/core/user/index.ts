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
  type UserSkinState = {
    unlockedSkins?: {
      cells?: Set<CellSkinName>
      banner?: Set<BannerSkinName>
      background?: Set<BackgroundSkinName>
    }
    selectedSkin?: {
      cells?: CellSkinName
      banner?: BannerSkinName
      background?: BackgroundSkinName
    }
  }

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
    userId: string,
    skinType: SkinType,
    skin: CellSkinName | BannerSkinName | BackgroundSkinName,
    currentUser: UserSkinState
  ) => {
    const newUnlockedSkins = {
      cells: currentUser.unlockedSkins?.cells,
      banner: currentUser.unlockedSkins?.banner,
      background: currentUser.unlockedSkins?.background
    }

    const newSelectedSkin = {
      cells: currentUser.selectedSkin?.cells,
      banner: currentUser.selectedSkin?.banner,
      background: currentUser.selectedSkin?.background
    }

    if (skinType === "cells") {
      const nextSkin = skin as CellSkinName
      newUnlockedSkins.cells = new Set([
        ...(newUnlockedSkins.cells ?? new Set<CellSkinName>()),
        nextSkin
      ])
      newSelectedSkin.cells = nextSkin
    } else if (skinType === "banner") {
      const nextSkin = skin as BannerSkinName
      newUnlockedSkins.banner = new Set([
        ...(newUnlockedSkins.banner ?? new Set<BannerSkinName>()),
        nextSkin
      ])
      newSelectedSkin.banner = nextSkin
    } else {
      const nextSkin = skin as BackgroundSkinName
      newUnlockedSkins.background = new Set([
        ...(newUnlockedSkins.background ?? new Set<BackgroundSkinName>()),
        nextSkin
      ])
      newSelectedSkin.background = nextSkin
    }

    const item = {
      userEmail,
      userId,
      userName: $get("userName"),
      userPicture: $get("userPicture"),
      unlockedSkins: $set(newUnlockedSkins),
      selectedSkin: $set(newSelectedSkin)
    }

    return UserEntity.build(UpdateTransaction).item(item)
  }
}
