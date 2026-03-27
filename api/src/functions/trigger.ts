import { unmarshall } from "@aws-sdk/util-dynamodb"
import type { DynamoDBStreamEvent } from "aws-lambda"
import { EntityParser } from "dynamodb-toolbox"
import { BestGame } from "../core/best-game"
import { GameEntity } from "../core/game/game.entity"
import { updateUserStatsCache } from "../core/user-stats-cache/compute"

// TODO: faire un package pour simplifier tout ça
export const handler = async (event: DynamoDBStreamEvent) => {
  await Promise.all(
    event.Records.map(async (record) => {
      const object = record.dynamodb?.NewImage || record.dynamodb?.OldImage

      if (object?._et.S === GameEntity.entityName) {
        const { item } = GameEntity.build(EntityParser).parse(
          unmarshall(object as Record<string, any>)
        )
        if (record.eventName === "INSERT") {
          const bestTime = await updateUserStatsCache(item)

          if (item.status === "won" && (!bestTime || item.time <= bestTime)) {
            await BestGame.update({
              userEmail: item.userEmail,
              time: item.time,
              flags: item.flags,
              revealed: item.revealed,
              date: item.date
            })
          }
        }
      }
    })
  )
}
