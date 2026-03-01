import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { Game } from "../../core/game"
import { User } from "../../core/user"
import { BestGame } from "../../core/best-game"
import { status } from "../../core/game/game.entity"

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
  .openapi("UserStats")

export const UserSchema = z
  .object({
    userId: z.string(),
    userName: z.string(),
    userPicture: z.string(),
  })
  .openapi("User")

export const GameSchema = z
  .object({
    status: z.enum(status),
    time: z.number(),
    flags: z.number(),
    revealed: z.number(),
    date: z.string(),
    userName: z.string(),
    userPicture: z.string(),
  })
  .openapi("UserGame")

export const route = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/{userId}",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      responses: {
        200: {
          description: "Get user profile by userId",
          content: {
            "application/json": {
              schema: UserSchema,
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() }),
            },
          },
        },
      },
      description: "Get user profile by userId",
    }),
    async c => {
      const { userId } = c.req.valid("param")

      const user = await User.getUserById(userId)

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      return c.json(
        UserSchema.parse({
          userId: user.userId,
          userName: user.userName,
          userPicture: user.userPicture,
        }),
        200
      )
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{userId}/stats",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      responses: {
        200: {
          description: "Get stats of a user by userId",
          content: {
            "application/json": {
              schema: StatsSchema,
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() }),
            },
          },
        },
      },
      description: "Get stats of a user by userId",
    }),
    async c => {
      const { userId } = c.req.valid("param")

      const user = await User.getUserById(userId)

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      const games = await Game.getAllGames(user.userEmail)

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

      const bestTime = (await BestGame.getBestOfUser(user.userEmail))?.time ?? 0

      return c.json(
        StatsSchema.parse({
          totalGames: games.length,
          totalTime: stats.totalTime,
          totalFlags: stats.totalFlags,
          totalRevealed: stats.totalRevealed,
          totalBombs: stats.totalBombs,
          totalWin: stats.totalWin,
          bestTime,
          totalNoFlagsWin: user.totalNoFlagsWin ?? 0,
          totalRestarts: stats.totalRestarts,
        }),
        200
      )
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{userId}/games/latest",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      responses: {
        200: {
          description: "Get last 10 games of a user by userId",
          content: {
            "application/json": {
              schema: z.array(GameSchema),
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() }),
            },
          },
        },
      },
      description: "Get last 10 games of a user by userId",
    }),
    async c => {
      const { userId } = c.req.valid("param")

      const user = await User.getUserById(userId)

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      const games = await Game.getLast10Ofuser(user.userEmail)

      const gamesWithUser = (games ?? []).map(game => ({
        status: game.status,
        time: game.time,
        flags: game.flags,
        revealed: game.revealed,
        date: game.date,
        userName: user.userName ?? "",
        userPicture: user.userPicture ?? "",
      }))

      return c.json(z.array(GameSchema).parse(gamesWithUser), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/{userId}/games/best",
      request: {
        params: z.object({
          userId: z.string(),
        }),
      },
      responses: {
        200: {
          description: "Get best 10 games of a user by userId",
          content: {
            "application/json": {
              schema: z.array(GameSchema),
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() }),
            },
          },
        },
      },
      description: "Get best 10 games of a user by userId",
    }),
    async c => {
      const { userId } = c.req.valid("param")

      const user = await User.getUserById(userId)

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      const games = await Game.get10BestGames(user.userEmail)

      const gamesWithUser = (games ?? []).map(game => ({
        status: game.status,
        time: game.time,
        flags: game.flags,
        revealed: game.revealed,
        date: game.date,
        userName: user.userName ?? "",
        userPicture: user.userPicture ?? "",
      })).sort((a, b) => a.time - b.time)

      return c.json(z.array(GameSchema).parse(gamesWithUser), 200)
    }
  )
