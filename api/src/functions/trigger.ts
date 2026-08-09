import { unmarshall } from "@aws-sdk/util-dynamodb"
import type { DynamoDBStreamEvent } from "aws-lambda"
import { format } from "date-fns"
import { EntityParser } from "dynamodb-toolbox"
import { BestGame } from "../core/best-game"
import { BestGameMonth } from "../core/best-game-month"
import { notifyError } from "../core/discord/notify-error"
import { GameEntity } from "../core/game/game.entity"
import { updateUserStatsCache } from "../core/user-stats-cache/compute"

// TODO: faire un package pour simplifier tout ça
export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    await Promise.all(
      event.Records.map(async (record) => {
        const object = record.dynamodb?.NewImage || record.dynamodb?.OldImage

        if (object?._et.S === GameEntity.entityName) {
          const { item } = GameEntity.build(EntityParser).parse(
            unmarshall(object as Record<string, any>)
          )
          if (record.eventName === "INSERT") {
            const effectiveMonth = format(new Date(item.date), "yyyy-MM")

            const [bestTime, bestTimeThisMonth] = await Promise.all([
              updateUserStatsCache(item),
              BestGameMonth.getBestGameForThisMonthsOfUser(effectiveMonth, item.userEmail)
            ])

            if (item.status === "won") {
              if (!bestTime || item.time <= bestTime) {
                await BestGame.update(item)
              }
              if (!bestTimeThisMonth || item.time <= bestTimeThisMonth.time) {
                await BestGameMonth.update({
                  ...item,
                  effectiveMonth
                })
              }
            }
          }
        }
      })
    )
  } catch (error) {
    await notifyError(error)
    throw error
  }
}
