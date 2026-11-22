// One-off script: rebuild every UserStatsCache from the Game items (default-skin rule
// included), then reset the global Skin counters from those games.
//
// Run by hand (agents never run it). DRY_RUN=true only prints, DRY_RUN=false writes:
//   TABLE_NAME=<table> DRY_RUN=true npx tsx src/recompute-stats.ts --profile prod

async function main() {
  const profileIndex = process.argv.indexOf("--profile")
  const profile = profileIndex === -1 ? undefined : process.argv[profileIndex + 1]
  const dryRun = process.env.DRY_RUN === "true"

  if (!process.env.TABLE_NAME) {
    console.error("ERROR: TABLE_NAME environment variable is required")
    process.exit(1)
  }
  // The DynamoDB client in core/dynamodb reads the profile from the environment,
  // so it must be set before core is imported.
  if (profile) process.env.AWS_PROFILE = profile

  const { UserStatsCache } = await import("./core/user-stats-cache")
  const { computeUserStatsCacheRow } = await import("./core/user-stats-cache/compute")
  const { Skin, skinTypes } = await import("./core/skin")
  type SkinItem = Parameters<typeof Skin.update>[0]

  const emptySkin = (skinType: string, skinName: string) =>
    ({
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
    }) as SkinItem

  console.log(
    `Table: ${process.env.TABLE_NAME} | profile: ${profile ?? "default"} | dry run: ${dryRun}`
  )

  // Existing Skin items start at zero, so skins with no games anymore are reset too.
  const skins = new Map<string, SkinItem>()
  for (const skinType of skinTypes) {
    for (const old of await Skin.getBySkinType(skinType)) {
      skins.set(`${skinType}/${old.skinName}`, emptySkin(skinType, old.skinName))
    }
  }

  // The player list comes from the existing cache rows (one row per player).
  const rows = await UserStatsCache.getAll()
  console.log(`Players: ${rows.length}`)

  for (const [i, row] of rows.entries()) {
    const fresh = await computeUserStatsCacheRow(row.userEmail)
    console.log(
      `${i + 1}/${rows.length} ${row.userEmail}: games ${row.totalGames} -> ${fresh.totalGames}, ` +
        `revealed ${row.totalRevealed} -> ${fresh.totalRevealed}`
    )
    if (!dryRun) await UserStatsCache.update(fresh)

    // The per-player skin stats are already split by skin: add them to the global counters.
    for (const skinType of skinTypes) {
      for (const [skinName, s] of Object.entries(fresh.skinStats?.[skinType] ?? {})) {
        const key = `${skinType}/${skinName}`
        const skin = skins.get(key) ?? emptySkin(skinType, skinName)
        skin.totalGames += s.totalGames
        skin.totalTime += s.totalTime
        skin.totalFlags += s.totalFlags
        skin.totalRevealed += s.totalRevealed
        skin.totalBombs += s.totalBombs
        skin.totalWin += s.totalWin
        skin.totalNoFlagsWin += s.totalNoFlagsWin
        skin.totalRestarts += s.totalRestarts
        if (s.bestTime) {
          skin.bestTime = skin.bestTime ? Math.min(skin.bestTime, s.bestTime) : s.bestTime
        }
        skins.set(key, skin)
      }
    }
  }

  for (const skin of skins.values()) {
    console.log(`Skin ${skin.skinType}/${skin.skinName}: ${skin.totalGames} games, ${skin.totalWin} wins`)
    if (!dryRun) await Skin.update(skin)
  }

  console.log(dryRun ? "Dry run: nothing written." : "Done: stats and skin counters written.")
}

main().catch((error) => {
  console.error("Failed:", error)
  process.exit(1)
})
