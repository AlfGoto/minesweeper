import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { BestGame } from "../../core/best-game"
import { User } from "../../core/user"
import { UserStatsCache } from "../../core/user-stats-cache"
import { chunkPromiseAll } from "../../utils"

export const StatsSchema = z
  .object({
    totalGames: z.number(),
    totalTime: z.number(),
    totalFlags: z.number(),
    totalRevealed: z.number(),
    totalBombs: z.number(),
    totalWin: z.number(),
    bestTime: z.number().optional(),
    totalNoFlagsWin: z.number(),
    totalRestarts: z.number(),
    placement: z.number().optional(),
    totalPlayers: z.number()
  })
  .openapi("Stats")

export const StatsAllSchema = z
  .object({
    totalGames: z.number(),
    totalTime: z.number(),
    totalFlags: z.number(),
    totalRevealed: z.number(),
    totalBombs: z.number(),
    totalWin: z.number(),
    bestTime: z.number().optional(),
    totalNoFlagsWin: z.number(),
    totalRestarts: z.number(),

    userPicture: z.string(),
    userName: z.string(),
    userId: z.string()
  })
  .openapi("StatsAll")

export const route = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/best",
      responses: {
        200: {
          description: "Get all stats",
          content: {
            "application/json": {
              schema: z.array(StatsAllSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      const stats = await UserStatsCache.getAll()

      const statsWithUser = await Promise.all(
        stats
          .sort((a, b) => b.totalTime - a.totalTime)
          .slice(0, 10)
          .map(async (stat) => {
            const user = await User.getUserByEmail(stat.userEmail)
            return {
              ...stat,
              userId: user?.userId ?? "",
              userPicture: user?.userPicture ?? "",
              userName: user?.userName ?? ""
            }
          })
      )
      return c.json(z.array(StatsAllSchema).parse(statsWithUser), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/all",
      responses: {
        200: {
          description: "Get all stats",
          content: {
            "application/json": {
              schema: z.array(StatsAllSchema)
            }
          }
        }
      }
    }),
    async (c) => {
      const stats = await UserStatsCache.getAll()

      const statsWithUser = await chunkPromiseAll(
        stats.sort((a, b) => b.totalTime - a.totalTime),
        async (stat) => {
          const user = await User.getUserByEmail(stat.userEmail)
          return {
            ...stat,
            userId: user?.userId ?? "",
            userPicture: user?.userPicture ?? "",
            userName: user?.userName ?? ""
          }
        }
      )
      return c.json(z.array(StatsAllSchema).parse(statsWithUser), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/user/{userEmail}",
      request: {
        params: z.object({
          userEmail: z.string()
        })
      },
      responses: {
        200: {
          description: "Get stats of a user",
          content: {
            "application/json": {
              schema: StatsSchema
            }
          }
        },
        404: {
          description: "Stats not found for this user",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      },
      description: "Get stats of a user (from cache)"
    }),
    async (c) => {
      const { userEmail } = c.req.valid("param")

      const [cached, bestGames] = await Promise.all([
        UserStatsCache.getByUserEmail(userEmail),
        BestGame.getBestGames()
      ])

      if (!cached) {
        return c.json({ message: "Stats not found" }, 404)
      }

      const sortedBestGames = bestGames.sort((a, b) => a.time - b.time)
      const placementIndex = sortedBestGames.findIndex((g) => g.userEmail === userEmail)

      return c.json(
        StatsSchema.parse({
          ...cached,
          placement: placementIndex >= 0 ? placementIndex + 1 : undefined,
          totalPlayers: bestGames.length
        }),
        200
      )
    }
  )
