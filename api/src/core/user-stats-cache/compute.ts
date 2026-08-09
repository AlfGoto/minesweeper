import { UserStatsCache } from "."
import { AlfCoins } from "../alfCoins"
import { BestGame } from "../best-game"
import { Game } from "../game"
import {
  BackgroundSkinName,
  BannerSkinName,
  CellSkinName,
  Skin,
  skinTypes,
  SkinType
} from "../skin"
import type {
  SkinStatsType,
  UserSkinStatsType,
  UserStatsCacheEntityType
} from "./user-stats-cache.entity"
import { GameEntityType } from "../game/game.entity"
import type { SkinEntityType } from "../skin/skin.entity"

function emptySkinStatsForUser(): SkinStatsType {
  return {
    totalGames: 0,
    totalTime: 0,
    totalFlags: 0,
    totalRevealed: 0,
    totalBombs: 0,
    totalWin: 0,
    totalNoFlagsWin: 0,
    totalRestarts: 0
  }
}

function incrementSkinStatsForUser(stats: SkinStatsType, game: GameEntityType): SkinStatsType {
  return {
    totalGames: stats.totalGames + 1,
    totalTime: stats.totalTime + game.time,
    totalFlags: stats.totalFlags + game.flags,
    totalRevealed: stats.totalRevealed + game.revealed,
    totalBombs: stats.totalBombs + (game.status === "lost" ? 1 : 0),
    totalWin: stats.totalWin + (game.status === "won" ? 1 : 0),
    totalNoFlagsWin: stats.totalNoFlagsWin + (game.status === "won" && game.flags === 0 ? 1 : 0),
    totalRestarts: stats.totalRestarts + (game.status === "restarted" ? 1 : 0),
    bestTime:
      game.status !== "won"
        ? stats.bestTime
        : stats.bestTime == null || stats.bestTime === 0
          ? game.time
          : Math.min(stats.bestTime, game.time)
  }
}

function incrementUserSkinStats(
  cache: UserStatsCacheEntityType,
  game: GameEntityType
): UserSkinStatsType {
  const selectedSkin = game.selectedSkin

  const skinStats: UserSkinStatsType = {
    cells: { ...cache.skinStats?.cells },
    banner: { ...cache.skinStats?.banner },
    background: { ...cache.skinStats?.background }
  }

  if (!selectedSkin) return skinStats

  for (const skinType of skinTypes) {
    const skinName = selectedSkin[skinType]
    if (!skinName) continue

    const currentTypeStats = skinStats[skinType] ?? {}
    const currentSkinStats =
      currentTypeStats[skinName as keyof typeof currentTypeStats] ?? emptySkinStatsForUser()

    ;(skinStats[skinType] as Record<string, SkinStatsType>)[skinName] = incrementSkinStatsForUser(
      currentSkinStats,
      game
    )
  }

  return skinStats
}

export function incrementGameToUserStatsCache(
  cache: UserStatsCacheEntityType,
  game: GameEntityType
): UserStatsCacheEntityType {
  return {
    ...cache,
    totalGames: cache.totalGames + 1,
    totalTime: cache.totalTime + game.time,
    totalFlags: cache.totalFlags + game.flags,
    totalRevealed: cache.totalRevealed + game.revealed,
    totalBombs: cache.totalBombs + (game.status === "lost" ? 1 : 0),
    totalWin: cache.totalWin + (game.status === "won" ? 1 : 0),
    totalNoFlagsWin: cache.totalNoFlagsWin + (game.status === "won" && game.flags === 0 ? 1 : 0),
    totalRestarts: cache.totalRestarts + (game.status === "restarted" ? 1 : 0),
    bestTime:
      game.status !== "won"
        ? cache.bestTime
        : cache.bestTime == null || cache.bestTime === 0
          ? game.time
          : Math.min(cache.bestTime, game.time),
    skinStats: incrementUserSkinStats(cache, game)
  }
}

export async function computeUserStatsCacheRow(
  userEmail: string
): Promise<UserStatsCacheEntityType> {
  const [games, bestRecord] = await Promise.all([
    Game.getAllGames(userEmail),
    BestGame.getBestOfUser(userEmail)
  ])

  const emptyCache: UserStatsCacheEntityType = {
    userEmail,
    totalGames: 0,
    totalTime: 0,
    totalFlags: 0,
    totalRevealed: 0,
    totalBombs: 0,
    totalWin: 0,
    totalNoFlagsWin: 0,
    totalRestarts: 0,
    skinStats: {
      cells: {},
      banner: {},
      background: {}
    }
  }

  const fromGames = games.reduce(incrementGameToUserStatsCache, emptyCache)

  return {
    ...fromGames,
    bestTime: bestRecord?.time
  }
}

export async function addGameToUserStatsCache(
  game: GameEntityType,
  userStatsCache?: UserStatsCacheEntityType
): Promise<UserStatsCacheEntityType> {
  if (!userStatsCache) {
    return computeUserStatsCacheRow(game.userEmail)
  }

  return incrementGameToUserStatsCache(userStatsCache, game)
}

function emptySkinStats(
  skinType: SkinType,
  skinName: CellSkinName | BannerSkinName | BackgroundSkinName
): SkinEntityType {
  return {
    skinType,
    skinName,
    totalGames: 0,
    totalTime: 0,
    totalFlags: 0,
    totalRevealed: 0,
    totalBombs: 0,
    totalWin: 0,
    totalNoFlagsWin: 0,
    totalRestarts: 0
  }
}

function incrementSkinStats(skin: SkinEntityType, game: GameEntityType): SkinEntityType {
  return {
    ...skin,
    totalGames: skin.totalGames + 1,
    totalTime: skin.totalTime + game.time,
    totalFlags: skin.totalFlags + game.flags,
    totalRevealed: skin.totalRevealed + game.revealed,
    totalBombs: skin.totalBombs + (game.status === "lost" ? 1 : 0),
    totalWin: skin.totalWin + (game.status === "won" ? 1 : 0),
    totalNoFlagsWin: skin.totalNoFlagsWin + (game.status === "won" && game.flags === 0 ? 1 : 0),
    totalRestarts: skin.totalRestarts + (game.status === "restarted" ? 1 : 0),
    bestTime:
      game.status !== "won"
        ? skin.bestTime
        : skin.bestTime == null || skin.bestTime === 0
          ? game.time
          : Math.min(skin.bestTime, game.time)
  }
}

async function updateSkinStats(game: GameEntityType) {
  const selectedSkin = game.selectedSkin
  if (!selectedSkin) return

  const updates = skinTypes
    .filter((type) => selectedSkin[type])
    .map(async (skinType) => {
      const skinName = selectedSkin[skinType]!
      const currentSkin = await Skin.get(skinType, skinName)
      const newSkin = incrementSkinStats(currentSkin ?? emptySkinStats(skinType, skinName), game)
      await Skin.update(newSkin)
    })

  await Promise.all(updates)
}

export async function updateUserStatsCache(game: GameEntityType) {
  const statCache = await UserStatsCache.getByUserEmail(game.userEmail)
  const totalGames = statCache?.totalGames ?? 0
  const shouldRecalculateEverything = totalGames % 40 === 0

  const newUserStatsCache = shouldRecalculateEverything
    ? await computeUserStatsCacheRow(game.userEmail)
    : await addGameToUserStatsCache(game, statCache)

  await Promise.all([
    UserStatsCache.update(newUserStatsCache),
    AlfCoins.addAlfCoins(
      game.userEmail,
      statCache?.totalRevealed ?? 0,
      newUserStatsCache.totalRevealed
    ),
    updateSkinStats(game)
  ])

  return newUserStatsCache.bestTime
}
