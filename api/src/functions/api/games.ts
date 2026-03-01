import { randomUUID } from "crypto"
import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { z } from "zod"
import { BestGame } from "../../core/best-game"
import { Game } from "../../core/game"
import { status } from "../../core/game/game.entity"
import { User } from "../../core/user"

function shortId() {
  const hex = randomUUID().replace(/-/g, "")
  return BigInt("0x" + hex)
    .toString(36)
    .toUpperCase()
    .slice(0, 12)
}

export const GameSchema = z
  .object({
    status: z.enum(status),
    time: z.number(),
    flags: z.number(),
    revealed: z.number(),
    date: z.string(),
    userEmail: z.string(),
    userName: z.string(),
    userPicture: z.string(),
  })
  .openapi("Game")

export const BestGameSchema = z
  .object({
    time: z.number(),
    flags: z.number(),
    date: z.string(),
    userName: z.string(),
    userPicture: z.string(),
  })
  .openapi("BestGame")

export const route = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/best",
      responses: {
        200: {
          description: "Get best games",
          content: {
            "application/json": {
              schema: z.array(BestGameSchema),
            },
          },
        },
      },
      description: "Get best games",
    }),
    async c => {
      const bestGames = await BestGame.getBestGames()

      const games = await Promise.all(
        bestGames.map(async game => {
          const user = await User.getUserByEmail(game.userEmail)
          return {
            ...game,
            userName: user?.userName ?? "",
            userPicture: user?.userPicture ?? "",
          }
        })
      )

      return c.json(
        z
          .array(BestGameSchema)
          .parse(games ?? [])
          .sort((a, b) => a.time - b.time),
        200
      )
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/best/{userEmail}",
      request: {
        params: z.object({
          userEmail: z.string(),
        }),
      },
      responses: {
        200: {
          description: "Get best 10 games of a user",
          content: {
            "application/json": {
              schema: z.array(GameSchema),
            },
          },
        },
      },
      description: "Get best 10 games of a user",
    }),
    async c => {
      const { userEmail } = c.req.valid("param")

      const games = await Game.get10BestGames(userEmail)
      const user = await User.getUserByEmail(userEmail)

      const gamesWithUser = (games ?? []).map(game => ({
        ...game,
        userName: user?.userName ?? "",
        userPicture: user?.userPicture ?? "",
      })).sort((a, b) => a.time - b.time)

      return c.json(z.array(GameSchema).parse(gamesWithUser), 200)
    }
  )
  .openapi(
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
          description: "Get last 10 games of a user",
          content: {
            "application/json": {
              schema: z.array(GameSchema),
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
      description: "Get last 10 games of a user",
    }),
    async c => {
      const { userEmail } = c.req.valid("param")

      const games = await Game.getLast10Ofuser(userEmail)
      const user = await User.getUserByEmail(userEmail)

      const gamesWithUser = (games ?? []).map(game => ({
        ...game,
        userName: user?.userName ?? "",
        userPicture: user?.userPicture ?? "",
      }))

      return c.json(z.array(GameSchema).parse(gamesWithUser), 200)
    }
  )
  .openapi(
    createRoute({
      method: "post",
      path: "/",
      request: {
        body: {
          content: {
            "application/json": {
              schema: GameSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "Create a game",
          content: {
            "application/json": {
              schema: z.string(),
            },
          },
        },
      },
    }),
    async c => {
      const game = c.req.valid("json")

      // Check for best game BEFORE creating the new game to avoid comparing against itself
      const bestGame = game.status === "won" ? await BestGame.getBestOfUser(game.userEmail) : undefined

      await Game.create(game)

      if (game.status === "won") {
        console.log("Game won, checking best game", { userEmail: game.userEmail, time: game.time, existingBest: bestGame?.time })
        if (!bestGame || bestGame.time > game.time) {
          console.log("Updating best game for user", game.userEmail)
          await BestGame.update(game)
          console.log("Best game updated successfully")
        }
      }

      const user = await User.getUserByEmail(game.userEmail)

      let totalNoFlagsWin = user?.totalNoFlagsWin ?? 0
      if (game.status === "won" && game.flags === 0) {
        totalNoFlagsWin++
      }

      await User.update({
        userName: game.userName || user?.userName || "",
        userPicture: game.userPicture || user?.userPicture || "",
        userEmail: game.userEmail,
        userId: user?.userId ?? shortId(),
        totalNoFlagsWin,
      })

      return c.json("success", 200)
    }
  )
