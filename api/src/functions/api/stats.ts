import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { User } from "../../core/user"
import { UserStatsCache } from "../../core/user-stats-cache"

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
    totalRestarts: z.number()
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

      const statsWithUser = await Promise.all(
        stats.map(async (stat) => {
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

      const cached = await UserStatsCache.getByUserEmail(userEmail)

      if (!cached) {
        return c.json({ message: "Stats not found" }, 404)
      }

      return c.json(StatsSchema.parse(cached), 200)
    }
  )
