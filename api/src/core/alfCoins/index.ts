import {
  GetItemCommand,
  UpdateItemCommand,
  $add,
  $subtract,
  $get,
  UpdateTransaction
} from "dynamodb-toolbox"
import { AlfCoinsEntity } from "./alf-coins.entity"

export namespace AlfCoins {
  export const get = async (userEmail: string) => {
    const { Item } = await AlfCoinsEntity.build(GetItemCommand).key({ userEmail }).send()
    return Item
  }

  export const update = async (userEmail: string, points: number) => {
    await AlfCoinsEntity.build(UpdateItemCommand).item({ userEmail, points }).send()
  }

  export const addAlfCoins = async (
    userEmail: string,
    oldTotalCells: number,
    newTotalCells: number
  ) => {
    const oldCells = Math.floor(oldTotalCells / 1000)
    const newCells = Math.floor(newTotalCells / 1000)

    if (newCells > oldCells) {
      await AlfCoinsEntity.build(UpdateItemCommand)
        .item({ userEmail, points: $add(1) })
        .send()
    }
  }

  export const createBuyTransaction = (
    userEmail: string,
    points: number,
    baseNumberOfPoints: number
  ) => {
    return AlfCoinsEntity.build(UpdateTransaction)
      .item({
        userEmail,
        points: $subtract($get("points"), points)
      })
      .options({
        condition: { attr: "points", gte: baseNumberOfPoints }
      })
  }
}
