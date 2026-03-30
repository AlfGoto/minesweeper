import { UserStatsCache } from "."
import { AlfCoins } from "../alfCoins"
import { BestGame } from "../best-game"
import { Game } from "../game"
import type { UserStatsCacheEntityType } from "./user-stats-cache.entity"
import { GameEntityType } from "../game/game.entity"

function emptyUserStatsCacheRow(userEmail: string): UserStatsCacheEntityType {
  return {
    userEmail,
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
          : Math.min(cache.bestTime, game.time)
  }
}

export async function computeUserStatsCacheRow(
  userEmail: string
): Promise<UserStatsCacheEntityType> {
  const [games, bestRecord] = await Promise.all([
    Game.getAllGames(userEmail),
    BestGame.getBestOfUser(userEmail)
  ])

  const fromGames = games.reduce(incrementGameToUserStatsCache, emptyUserStatsCacheRow(userEmail))

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

export async function updateUserStatsCache(game: GameEntityType) {
  const statCache = await UserStatsCache.getByUserEmail(game.userEmail)
  const totalGames = statCache?.totalGames ?? 0
  const shouldRecalculateEverything = totalGames % 10 === 0

  const newUserStatsCache = shouldRecalculateEverything
    ? await computeUserStatsCacheRow(game.userEmail)
    : await addGameToUserStatsCache(game, statCache)

  await Promise.all([
    UserStatsCache.update(newUserStatsCache),
    AlfCoins.addAlfCoins(
      game.userEmail,
      statCache?.totalRevealed ?? 0,
      newUserStatsCache.totalRevealed
    )
  ])

  return newUserStatsCache.bestTime
}
