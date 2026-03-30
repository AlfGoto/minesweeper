import { AlfCoins } from "./core/alfCoins"
import { UserStatsCache } from "./core/user-stats-cache"
import type { UserStatsCacheEntityType } from "./core/user-stats-cache/user-stats-cache.entity"

const TABLE_NAME = process.env.TABLE_NAME

if (!TABLE_NAME) {
  console.error("ERROR: TABLE_NAME environment variable is required")
  process.exit(1)
}

interface UserPoints {
  userEmail: string
  totalRevealed: number
  points: number
}

async function getAllUserStatsCacheRows(): Promise<UserStatsCacheEntityType[]> {
  console.log(`Reading user stats cache from table: ${TABLE_NAME}`)
  const rows = await UserStatsCache.getAll()
  console.log(`Total user stats cache rows: ${rows.length}`)
  return rows
}

function mapRowsToPoints(rows: UserStatsCacheEntityType[]): UserPoints[] {
  return rows
    .map((row) => {
      const totalRevealed = row.totalRevealed ?? 0
      return {
        userEmail: row.userEmail,
        totalRevealed,
        points: Math.floor(totalRevealed / 1000)
      }
    })
    .sort((a, b) => b.points - a.points || b.totalRevealed - a.totalRevealed)
}

async function run() {
  const rows = await getAllUserStatsCacheRows()
  const pointsByUser = mapRowsToPoints(rows)

  console.log(`\nComputed points for ${pointsByUser.length} users`)
  console.log("Format: userEmail | points | totalRevealed")

  let updated = 0
  let errors = 0

  for (const user of pointsByUser) {
    try {
      await AlfCoins.update(user.userEmail, user.points)
      updated++
      console.log(`${user.userEmail} | ${user.points} | ${user.totalRevealed}`)
    } catch (error) {
      errors++
      console.error(`Failed to update points for ${user.userEmail}:`, error)
    }
  }

  console.log("\nUpdate complete")
  console.log(`Updated: ${updated}`)
  console.log(`Errors: ${errors}`)
}

run().catch((error) => {
  console.error("Failed to compute user points:", error)
  process.exit(1)
})

// Usage:
// AWS_PROFILE=your-profile TABLE_NAME=your-table-name npx tsx src/user-stats-cache-points.ts
