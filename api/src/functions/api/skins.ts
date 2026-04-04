import { createRoute, OpenAPIHono } from "@hono/zod-openapi"
import { executeTransactWrite } from "dynamodb-toolbox"
import { z } from "zod"
import { AlfCoins } from "../../core/alfCoins"
import { User } from "../../core/user"
import {
  bannerSkins,
  backgroundSkins,
  cellsSkins,
  bannerSkinsNames,
  backgroundSkinsNames,
  cellsSkinsNames,
  skinTypes
} from "../../core/user/user.entity"

export const SkinTypeSchema = z.enum(skinTypes).openapi("SkinType")
export const SkinTypesResponseSchema = z.array(SkinTypeSchema).openapi("SkinTypesResponse")

export const CellSkinSchema = z.enum(cellsSkinsNames).openapi("CellSkin")
export const CellSkinsSchema = z.array(CellSkinSchema)
export const BannerSkinSchema = z.enum(bannerSkinsNames).openapi("BannerSkin")
export const BannerSkinsSchema = z.array(BannerSkinSchema)
export const BackgroundSkinSchema = z.enum(backgroundSkinsNames).openapi("BackgroundSkin")
export const BackgroundSkinsSchema = z.array(BackgroundSkinSchema)

export const CellSkinsNamesEnumSchema = z.enum(cellsSkinsNames).openapi("CellSkinsNamesEnum")
export const CellSkinsNamesArraySchema = z
  .array(CellSkinsNamesEnumSchema)
  .openapi("CellSkinsNamesArray")
export const BannerSkinsNamesEnumSchema = z.enum(bannerSkinsNames)
export const BannerSkinsNamesArraySchema = z
  .array(BannerSkinsNamesEnumSchema)
  .openapi("BannerSkinsNamesArray")
export const BackgroundSkinsNamesEnumSchema = z
  .enum(backgroundSkinsNames)
  .openapi("BackgroundSkinsNamesEnum")
export const BackgroundSkinsNamesArraySchema = z
  .array(BackgroundSkinsNamesEnumSchema)
  .openapi("BackgroundSkinsNamesArray")
export const CellSkinsCatalogSchema = z.record(CellSkinsNamesEnumSchema, z.number())
export const BannerSkinsCatalogSchema = z.record(BannerSkinsNamesEnumSchema, z.number())
export const BackgroundSkinsCatalogSchema = z.record(BackgroundSkinsNamesEnumSchema, z.number())

const BuySkinBodySchema = z.discriminatedUnion("skinType", [
  z.object({
    skinType: z.literal("cells"),
    skin: CellSkinsNamesEnumSchema
  }),
  z.object({
    skinType: z.literal("banner"),
    skin: BannerSkinsNamesEnumSchema
  }),
  z.object({
    skinType: z.literal("background"),
    skin: BackgroundSkinsNamesEnumSchema
  })
])

export const UserSchema = z
  .object({
    userId: z.string(),
    userName: z.string(),
    userPicture: z.string(),

    coins: z.number(),

    selectedSkin: z
      .object({
        cells: CellSkinSchema.optional(),
        banner: BannerSkinSchema.optional(),
        background: BackgroundSkinSchema.optional()
      })
      .optional(),
    unlockedSkins: z
      .object({
        cells: CellSkinsSchema.optional(),
        banner: BannerSkinsSchema.optional(),
        background: BackgroundSkinsSchema.optional()
      })
      .optional()
  })
  .openapi("UserSkins")

const normalizeUnlockedSkinsForResponse = (
  unlockedSkins:
    | {
        cells?: Set<string>
        banner?: Set<string>
        background?: Set<string>
      }
    | undefined
) => {
  if (!unlockedSkins) {
    return undefined
  }

  return {
    cells: unlockedSkins.cells ? Array.from(unlockedSkins.cells) : undefined,
    banner: unlockedSkins.banner ? Array.from(unlockedSkins.banner) : undefined,
    background: unlockedSkins.background ? Array.from(unlockedSkins.background) : undefined
  }
}

export const route = new OpenAPIHono()
  .openapi(
    createRoute({
      method: "get",
      path: "/types",
      responses: {
        200: {
          description: "Get all skin types",
          content: {
            "application/json": {
              schema: SkinTypesResponseSchema
            }
          }
        }
      }
    }),
    async (c) => {
      return c.json(SkinTypesResponseSchema.parse(skinTypes), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/cells",
      responses: {
        200: {
          description: "Get all skins",
          content: {
            "application/json": {
              schema: CellSkinsCatalogSchema
            }
          }
        }
      }
    }),
    async (c) => {
      return c.json(CellSkinsCatalogSchema.parse(cellsSkins), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/banners",
      responses: {
        200: {
          description: "Get all banners",
          content: {
            "application/json": {
              schema: BannerSkinsCatalogSchema
            }
          }
        },
        404: {
          description: "Banners not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      },
      description: "Get all banners"
    }),
    async (c) => {
      return c.json(BannerSkinsCatalogSchema.parse(bannerSkins), 200)
    }
  )
  .openapi(
    createRoute({
      method: "get",
      path: "/backgrounds",
      responses: {
        200: {
          description: "Get all backgrounds",
          content: {
            "application/json": {
              schema: BackgroundSkinsCatalogSchema
            }
          }
        },
        404: {
          description: "Backgrounds not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      },
      description: "Get all backgrounds"
    }),
    async (c) => {
      return c.json(BackgroundSkinsCatalogSchema.parse(backgroundSkins), 200)
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
          description: "Get skins of a user",
          content: {
            "application/json": {
              schema: UserSchema
            }
          }
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      },
      description: "Get skins of a user"
    }),
    async (c) => {
      const { userEmail } = c.req.valid("param")

      const [coins, user] = await Promise.all([
        AlfCoins.get(userEmail),
        User.getUserByEmail(userEmail)
      ])

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      return c.json(
        UserSchema.parse({
          ...user,
          coins: coins?.points ?? 0,
          unlockedSkins: normalizeUnlockedSkinsForResponse(user.unlockedSkins)
        }),
        200
      )
    }
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/buy/{userEmail}",
      request: {
        params: z.object({
          userEmail: z.string()
        }),
        body: {
          content: {
            "application/json": {
              schema: BuySkinBodySchema
            }
          }
        }
      },
      responses: {
        200: {
          description: "Buy a skin",
          content: { "application/json": { schema: z.object({ message: z.string() }) } }
        },
        400: {
          description: "Not enough coins",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      }
    }),
    async (c) => {
      const { userEmail } = c.req.valid("param")
      const { skin, skinType } = c.req.valid("json")

      const [coins, user] = await Promise.all([
        AlfCoins.get(userEmail),
        User.getUserByEmail(userEmail)
      ])

      if (!user || !coins) {
        return c.json({ message: "User not found" }, 404)
      }

      let skinPrice: number
      if (skinType === "cells") {
        skinPrice = cellsSkins[skin]
      } else if (skinType === "banner") {
        skinPrice = bannerSkins[skin]
      } else {
        skinPrice = backgroundSkins[skin]
      }
      if (coins.points < skinPrice) {
        return c.json({ message: "Not enough coins" }, 400)
      }
      const buyTransaction = AlfCoins.createBuyTransaction(userEmail, skinPrice, coins.points)
      const addSkinTransaction = User.getAddUnlockedSkinTransaction(
        userEmail,
        user.userId,
        skinType,
        skin,
        {
          unlockedSkins: user.unlockedSkins,
          selectedSkin: user.selectedSkin
        }
      )

      try {
        await executeTransactWrite(buyTransaction, addSkinTransaction)
      } catch (error: any) {
        if (error?.CancellationReasons) {
          console.error("Cancellation reasons:", JSON.stringify(error.CancellationReasons, null, 2))
        }
        throw error
      }

      return c.json({ message: "Skin bought" }, 200)
    }
  )
  .openapi(
    createRoute({
      method: "put",
      path: "/select/{userEmail}",
      request: {
        params: z.object({
          userEmail: z.string()
        }),
        body: {
          content: {
            "application/json": {
              schema: BuySkinBodySchema
            }
          }
        }
      },
      responses: {
        200: {
          description: "Select a skin",
          content: { "application/json": { schema: z.object({ message: z.string() }) } }
        },
        400: {
          description: "Skin not unlocked",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: z.object({ message: z.string() })
            }
          }
        }
      }
    }),
    async (c) => {
      const { userEmail } = c.req.valid("param")
      const { skin, skinType } = c.req.valid("json")

      const user = await User.getUserByEmail(userEmail)

      if (!user) {
        return c.json({ message: "User not found" }, 404)
      }

      const isUnlocked =
        skin === "default" ||
        (skinType === "cells"
          ? user.unlockedSkins?.cells?.has(skin)
          : skinType === "banner"
            ? user.unlockedSkins?.banner?.has(skin)
            : user.unlockedSkins?.background?.has(skin))

      if (!isUnlocked) {
        return c.json({ message: "Skin not unlocked" }, 400)
      }

      await User.update({
        userEmail: user.userEmail,
        userId: user.userId,
        userName: user.userName,
        userPicture: user.userPicture,
        selectedSkin: {
          ...(user.selectedSkin ?? {}),
          [skinType]: skin
        }
      })

      return c.json({ message: "Skin selected" }, 200)
    }
  )
