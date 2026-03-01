import { GetItemCommand, QueryCommand, UpdateItemCommand } from "dynamodb-toolbox"
import { BestGameEntity, BestGameEntityType } from "./best-game.entity"
import { MinesweeperBffTable } from "../dynamodb"

export namespace BestGame {
  export const update = async (bestGame: BestGameEntityType) => {
    await BestGameEntity.build(UpdateItemCommand).item(bestGame).send()
  }

  export const getBestGames = async () => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: "BEST_GAMES",
      })
      .options({
        limit: 10,
        reverse: true,
      })
      .entities(BestGameEntity)
      .send()
    return Items ?? []
  }

  export const getBestOfUser = async (userEmail: string) => {
    const { Item } = await BestGameEntity.build(GetItemCommand)
      .key({
        userEmail,
      })
      .send()
    return Item
  }
}
