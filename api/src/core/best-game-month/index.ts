import { GetItemCommand, QueryCommand, UpdateItemCommand } from "dynamodb-toolbox"
import { BestGameMonthEntity, BestGameMonthEntityType } from "./best-game-month.entity"
import { MinesweeperBffTable } from "../dynamodb"

export namespace BestGameMonth {
  export const update = async (bestGameMonth: BestGameMonthEntityType) => {
    await BestGameMonthEntity.build(UpdateItemCommand).item(bestGameMonth).send()
  }

  export const getAllBestGameForThisMonths = async (effectiveMonth: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `BEST_GAMES_MONTH#${effectiveMonth}`
      })
      .entities(BestGameMonthEntity)
      .send()
    return Items || []
  }

  export const getBestGameForThisMonthsOfUser = async (
    effectiveMonth: string,
    userEmail: string
  ) => {
    const { Item } = await BestGameMonthEntity.build(GetItemCommand)
      .key({
        userEmail,
        effectiveMonth
      })
      .send()
    return Item
  }
}
