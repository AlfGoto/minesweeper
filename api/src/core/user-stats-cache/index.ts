import { QueryCommand, UpdateItemCommand } from "dynamodb-toolbox"
import { MinesweeperBffTable } from "../dynamodb"
import { UserStatsCacheEntity, UserStatsCacheEntityType } from "./user-stats-cache.entity"

export namespace UserStatsCache {
  export async function getAll() {
    const { Items } = await MinesweeperBffTable.build(QueryCommand)
      .query({
        partition: "USER_STATS_CACHE",
      })
      .entities(UserStatsCacheEntity)
      .send()
    return Items ?? []
  }

  export async function update(userStatsCache: UserStatsCacheEntityType) {
    await UserStatsCacheEntity.build(UpdateItemCommand).item(userStatsCache).send()
  }
}
