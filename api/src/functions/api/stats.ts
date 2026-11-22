import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { BestGame } from "../../core/best-game"
import { BestGameMonth } from "../../core/best-game-month"
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

const FIRST_MONTH = "2026-07"
const MonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected yyyy-MM")

export const MonthlyEntrySchema = z
  .object({
    time: z.number(),
    flags: z.number(),
    revealed: z.number(),
    date: z.string(),
    userPicture: z.string(),
    userName: z.string(),
    userId: z.string()
  })
  .openapi("MonthlyEntry")

export const MonthlyTop3Schema = z
  .object({
    month: z.string(),
    top3: z.array(MonthlyEntrySchema)
  })
  .openapi("MonthlyTop3")

// Months from FIRST_MONTH to the current UTC month, as yyyy-MM
const listMonths = () => {
  const current = new Date().toISOString().slice(0, 7)
  const months: string[] = []
  let [year, month] = FIRST_MONTH.split("-").map(Number)
  for (;;) {
    const key = `${year}-${String(month).padStart(2, "0")}`
    if (key > current) break
    months.push(key)
    month++
    if (month > 12) {
      month = 1
      year++
    }
  }
  return months
}

// Reads one month partition only, sorted by time (fastest first)
const getMonthlyTop = async (month: string, limit: number) => {
  const games = await BestGameMonth.getAllBestGameForThisMonths(month)
  return Promise.all(
    games
      .sort((a, b) => a.time - b.time)
      .slice(0, limit)
      .map(async (game) => {
        const user = await User.getUserByEmail(game.userEmail)
        return {
          time: game.time,
          flags: game.flags,
          revealed: game.revealed,
          date: game.date,
          userId: user?.userId ?? "",
          userPicture: user?.userPicture ?? "",
          userName: user?.userName ?? ""
        }
      })
  )
}

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
  .openapi(
    createRoute({
      method: "get",
      path: "/month/{month}",
      request: {
        params: z.object({
          month: MonthSchema
        })
      },
      responses: {
        200: {
          description: "Monthly leaderboard (top 100 at most, fastest first)",
          content: {
            "application/json": {
              schema: z.array(MonthlyEntrySchema)
            }
          }
        }
      },
      description: "Get the monthly leaderboard of one UTC month (yyyy-MM). Empty month: empty list."
    }),
    async (c) => {
      const { month } = c.req.valid("param")
      const entries = await getMonthlyTop(month, 100)
      return c.json(z.array(MonthlyEntrySchema).parse(entries), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/months",
      responses: {
        200: {
          description: "Every month with at least one game, with its top 3",
          content: {
            "application/json": {
              schema: z.array(MonthlyTop3Schema)
            }
          }
        }
      },
      description: `Get every month from ${FIRST_MONTH} to the current month that has at least one game, with its top 3`
    }),
    async (c) => {
      const months = await Promise.all(
        listMonths().map(async (month) => ({ month, top3: await getMonthlyTop(month, 3) }))
      )
      return c.json(
        z.array(MonthlyTop3Schema).parse(months.filter((m) => m.top3.length > 0)),
        200
      )
    }
  )
