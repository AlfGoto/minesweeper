import { GetItemCommand, QueryCommand, UpdateItemCommand } from "dynamodb-toolbox"
import { SkinEntity, SkinEntityType } from "./skin.entity"
import { MinesweeperBffTable } from "../dynamodb"
import { SkinName, SkinType } from "./skin.types"

export * from "./skin.types"

export namespace Skin {
  export const update = async (skin: SkinEntityType) => {
    await SkinEntity.build(UpdateItemCommand).item(skin).send()
  }

  export const get = async (skinType: SkinType, skinName: SkinName) => {
    const { Item } = await SkinEntity.build(GetItemCommand).key({ skinType, skinName }).send()
    return Item
  }

  export const getBySkinType = async (skinType: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `SKIN#${skinType}`
      })
      .entities(SkinEntity)
      .send()
    return Items ?? []
  }
}
