import { timingSafeEqual } from "node:crypto"
import { swaggerUI } from "@hono/swagger-ui"
import { OpenAPIHono } from "@hono/zod-openapi"
import middy from "@middy/core"
import { handle } from "hono/aws-lambda"
import { HTTPException } from "hono/http-exception"
import { route as GameRoute } from "./games"
import { route as SkinsRoute } from "./skins"
import { route as StatsRoute } from "./stats"
import { route as UserStatsRoute } from "./user-stats"
import { notifyError } from "../../core/discord/notify-error"

const SECRET_HEADER = "x-api-secret"

const isValidSecret = (received: string | undefined): boolean => {
  const expected = process.env.API_SECRET
  // Fail closed: no secret configured means every call is rejected.
  if (!expected || !received) return false
  const a = Buffer.from(received)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

const app = new OpenAPIHono()

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") return next()
  if (!isValidSecret(c.req.header(SECRET_HEADER))) {
    throw new HTTPException(401, { message: "Unauthorized" })
  }
  await next()
})

const routes = app
  .route("/games", GameRoute)
  .route("/stats", StatsRoute)
  .route("/users", UserStatsRoute)
  .route("/skins", SkinsRoute)
  .onError(async (error, c) => {
    console.error("Error:", JSON.stringify(error, null, 2))

    if (error instanceof HTTPException) {
      return c.json(error.message, error.status)
    }

    await notifyError(error)

    return c.json(
      {
        code: "internal",
        message: "Internal server error"
      },
      500
    )
  })

app
  .doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "MinesweeperBff Api",
      description: "The api used to manage the minesweeper"
    }
  })
  .get(
    "/ui",
    swaggerUI({
      url: "/doc"
    })
  )

export type Routes = typeof routes

export const handler = middy(handle(app))
