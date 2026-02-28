import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { Game } from "../../core/game"
import { User } from "../../core/user"

export const StatsSchema = z
  .object({
    totalGames: z.number(),
    totalTime: z.number(),
    totalFlags: z.number(),
    totalRevealed: z.number(),
    totalBombs: z.number(),
    totalWin: z.number(),
    bestTime: z.number(),
    totalNoFlagsWin: z.number(),
    totalRestarts: z.number(),
  })
  .openapi("Stats")

export const route = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    path: "/{userEmail}",
    request: {
      params: z.object({
        userEmail: z.string(),
      }),
    },
    responses: {
      200: {
        description: "Get stats of a user",
        content: {
          "application/json": {
            schema: StatsSchema,
          },
        },
      },
      404: {
        description: "user not found",
        content: {
          "application/json": {
            schema: z.object({ message: z.string() }),
          },
        },
      },
    },
    description: "Get stats of a user",
  }),
  async c => {
    const { userEmail } = c.req.valid("param")

    const user = await User.getUserByEmail(userEmail)

    const games = await Game.getAllGames(userEmail)

    const stats = games.reduce(
      (acc, game) => {
        acc.totalTime += game.time
        acc.totalFlags += game.flags
        acc.totalRevealed += game.revealed

        acc.totalBombs += game.status === "won" ? 0 : 1
        acc.totalWin += game.status === "won" ? 1 : 0
        acc.totalRestarts += game.status === "restarted" ? 1 : 0
        return acc
      },
      { totalTime: 0, totalFlags: 0, totalRevealed: 0, totalBombs: 0, totalWin: 0, totalRestarts: 0 }
    )

    const bestTime = (await Game.get10BestGames(userEmail))[0]?.time ?? 0

    return c.json(
      StatsSchema.parse({
        totalGames: games.length,
        totalTime: stats.totalTime,
        totalFlags: stats.totalFlags,
        totalRevealed: stats.totalRevealed,
        totalBombs: stats.totalBombs,
        totalWin: stats.totalWin,
        bestTime,
        totalNoFlagsWin: user?.totalNoFlagsWin ?? 0,
        totalRestarts: stats.totalRestarts,
      }),
      200
    )
  }
)
