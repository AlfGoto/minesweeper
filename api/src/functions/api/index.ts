import { swaggerUI } from "@hono/swagger-ui"
import { OpenAPIHono } from "@hono/zod-openapi"
import middy from "@middy/core"
import { handle } from "hono/aws-lambda"
import { HTTPException } from "hono/http-exception"
import { route as GameRoute } from "./games"
import { route as StatsRoute } from "./stats"
import { route as UserStatsRoute } from "./user-stats"

const app = new OpenAPIHono()

const routes = app
  .route("/games", GameRoute)
  .route("/stats", StatsRoute)
  .route("/users", UserStatsRoute)
  .onError((error, c) => {
    console.error("Error:", JSON.stringify(error, null, 2))

    if (error instanceof HTTPException) {
      return c.json(error.message, error.status)
    }
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
