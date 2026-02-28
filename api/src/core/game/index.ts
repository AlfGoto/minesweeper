import { PutItemCommand, QueryCommand } from "dynamodb-toolbox"
import { GameEntity, GameEntityType } from "./game.entity"
import { MinesweeperBffTable } from "../dynamodb"

export namespace Game {
  export const create = async (game: GameEntityType) => {
    await GameEntity.build(PutItemCommand).item(game).send()
  }

  export const getLast10Ofuser = async (userEmail: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `GAME#${userEmail}`,
      })
      .options({
        limit: 10,
        reverse: true,
      })
      .entities(GameEntity)
      .send()
    return Items ?? []
  }

  export const get10BestGames = async (userEmail: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand).query({
      partition: `USER_BEST_GAMES#${userEmail}`,
      index: "GSI1",
    })
      .entities(GameEntity)
      .options({
        reverse: false,
        maxPages: Infinity,
      })
      .send()
    return (Items ?? []).filter(game => game.status === "won").slice(0, 10)
  }

  export const getAllGames = async (userEmail: string) => {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: `GAME#${userEmail}`,
      })
      .entities(GameEntity)
      .send()
    return Items ?? []
  }
}
