import { randomUUID } from "crypto"
import { DynamoDBClient, ScanCommand, DeleteItemCommand as DDBDeleteItemCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb"
import { Table, Entity, item, string, number, BatchWriteCommand, BatchPutRequest, executeBatchWrite } from "dynamodb-toolbox"

// Generate short ID like the app does (from games.ts)
function shortId() {
  const hex = randomUUID().replace(/-/g, "")
  return BigInt("0x" + hex)
    .toString(36)
    .toUpperCase()
    .slice(0, 12)
}

// Configuration
const OLD_TABLE_NAME = process.env.OLD_TABLE_NAME
const NEW_TABLE_NAME = process.env.NEW_TABLE_NAME
const DRY_RUN = process.env.DRY_RUN === "true"

if (!OLD_TABLE_NAME || !NEW_TABLE_NAME) {
  console.error("ERROR: OLD_TABLE_NAME and NEW_TABLE_NAME environment variables are required")
  process.exit(1)
}

// Initialize DynamoDB client
const client = new DynamoDBClient()
const documentClient = DynamoDBDocumentClient.from(client)

// Define the new table
const MinesweeperBffTable = new Table({
  name: NEW_TABLE_NAME,
  partitionKey: { name: "PK", type: "string" },
  sortKey: { name: "SK", type: "string" },
  documentClient,
  indexes: {
    GSI1: {
      type: "global",
      partitionKey: { name: "GSI1PK", type: "string" },
      sortKey: { name: "GSI1SK", type: "string" },
    },
  },
})

// Define entities (matching api/src/core entities)
const GameEntity = new Entity({
  name: "Game",
  schema: item({
    time: number().key(),
    flags: number(),
    revealed: number(),
    status: string().enum("won", "lost", "restarted"),
    date: string().key(),
    userEmail: string().key(),
  }).and(prevSchema => ({
    GSI1PK: string()
      .key()
      .link<typeof prevSchema>(({ userEmail }) => `USER_BEST_GAMES#${userEmail}`),
    GSI1SK: string()
      .key()
      .link<typeof prevSchema>(({ time }) => `TIME#${time}`),
  })),
  computeKey: ({ userEmail, date }: { userEmail: string; date: string }) => ({
    PK: `GAME#${userEmail}`,
    SK: `GAME#${date}`,
  }),
  table: MinesweeperBffTable,
})

const BestGameEntity = new Entity({
  name: "BestGame",
  schema: item({
    time: number(),
    flags: number(),
    revealed: number(),
    date: string(),
    userEmail: string().key(),
  }),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: "BEST_GAMES",
    SK: `BEST#${userEmail}`,
  }),
  table: MinesweeperBffTable,
})

const UserEntity = new Entity({
  name: "User",
  schema: item({
    userEmail: string().key(),
    userId: string().key(),
    userName: string(),
    userPicture: string(),
    totalNoFlagsWin: number(),
  }).and(prevSchema => ({
    GSI1PK: string()
      .key()
      .link<typeof prevSchema>(({ userId }) => `USERID#${userId}`),
    GSI1SK: string()
      .key()
      .link<typeof prevSchema>(({ userId }) => `USERID#${userId}`),
  })),
  computeKey: ({ userEmail }: { userEmail: string }) => ({
    PK: `USER#${userEmail}`,
    SK: `USER#${userEmail}`,
  }),
  table: MinesweeperBffTable,
})

// Types for old data
interface OldRecord {
  userId: string
  timestamp: string
  _et?: string
  cellsRevealed?: number
  date?: string
  status?: string
  time?: number
  timePlayed?: number
  usedFlags?: number
  noFlagWin?: boolean
  rawUserId?: string
  userImage?: string
  userName?: string
  // UserStats fields
  gamesAbandoned?: number
  gamesLost?: number
  gamesPlayed?: number
  gamesRestarted?: number
  gamesWon?: number
  fastestWin?: number
  noFlagWins?: number
  totalFlagsPlaced?: number
}

interface NewGame {
  userEmail: string
  date: string
  time: number
  flags: number
  revealed: number
  status: "won" | "lost" | "restarted"
}

interface NewBestGame {
  userEmail: string
  date: string
  time: number
  flags: number
  revealed: number
}

interface NewUser {
  userEmail: string
  userId: string
  userName: string
  userPicture: string
  totalNoFlagsWin: number
}

// Scan the entire old table
async function scanOldTable(): Promise<OldRecord[]> {
  const records: OldRecord[] = []
  let lastEvaluatedKey: Record<string, any> | undefined

  console.log(`Scanning old table: ${OLD_TABLE_NAME}`)

  do {
    const command = new ScanCommand({
      TableName: OLD_TABLE_NAME,
      ExclusiveStartKey: lastEvaluatedKey,
    })

    const response = await client.send(command)

    if (response.Items) {
      for (const item of response.Items) {
        records.push(unmarshall(item) as OldRecord)
      }
    }

    lastEvaluatedKey = response.LastEvaluatedKey
    process.stdout.write(`\rScanned ${records.length} records...`)
  } while (lastEvaluatedKey)

  console.log(`\nTotal records scanned: ${records.length}`)
  return records
}

// Transform status
function transformStatus(oldStatus: string): "won" | "lost" | "restarted" {
  switch (oldStatus) {
    case "success":
      return "won"
    case "defeat":
      return "lost"
    case "restarted":
    case "abandoned":
      return "restarted"
    default:
      console.warn(`Unknown status: ${oldStatus}, defaulting to "lost"`)
      return "lost"
  }
}

// Extract email from userId
function extractEmail(userId: string): string {
  const match = userId.match(/^(?:USER|STAT|BEST)#(.+)$/)
  return match ? match[1] : userId
}

// Wipe the new table
async function wipeNewTable(): Promise<void> {
  console.log(`Wiping new table: ${NEW_TABLE_NAME}`)
  let lastEvaluatedKey: Record<string, any> | undefined
  let deletedCount = 0

  do {
    const scanCommand = new ScanCommand({
      TableName: NEW_TABLE_NAME,
      ExclusiveStartKey: lastEvaluatedKey,
      ProjectionExpression: "PK, SK",
    })

    const response = await client.send(scanCommand)

    if (response.Items && response.Items.length > 0) {
      for (const item of response.Items) {
        const key = unmarshall(item)
        await client.send(new DDBDeleteItemCommand({
          TableName: NEW_TABLE_NAME,
          Key: marshall({ PK: key.PK, SK: key.SK }),
        }))
        deletedCount++
        process.stdout.write(`\rDeleted ${deletedCount} records...`)
      }
    }

    lastEvaluatedKey = response.LastEvaluatedKey
  } while (lastEvaluatedKey)

  console.log(`\nWiped ${deletedCount} records from new table`)
}

// User info collected from all sources
interface UserInfo {
  userName: string
  userPicture: string
  noFlagWins: number
}

// Collect user info from a record (merges with existing, preferring non-empty values)
function collectUserInfo(
  userInfoMap: Map<string, UserInfo>,
  email: string,
  userName?: string,
  userPicture?: string,
  noFlagWins?: number
): void {
  const existing = userInfoMap.get(email) || { userName: "", userPicture: "", noFlagWins: 0 }

  userInfoMap.set(email, {
    userName: userName || existing.userName,
    userPicture: userPicture || existing.userPicture,
    noFlagWins: noFlagWins ?? existing.noFlagWins,
  })
}

// Check if user has profile info
function hasProfileInfo(userInfo: UserInfo | undefined): boolean {
  return !!(userInfo?.userName || userInfo?.userPicture)
}

// Compute best games from won games (fastest win per user, only for users with profile)
function computeBestGames(games: NewGame[], userInfoMap: Map<string, UserInfo>): NewBestGame[] {
  const bestByUser = new Map<string, NewGame>()

  for (const game of games) {
    if (game.status !== "won") continue

    // Skip users without profile info
    if (!hasProfileInfo(userInfoMap.get(game.userEmail))) continue

    const existing = bestByUser.get(game.userEmail)
    if (!existing || game.time < existing.time) {
      bestByUser.set(game.userEmail, game)
    }
  }

  return Array.from(bestByUser.values()).map(game => ({
    userEmail: game.userEmail,
    date: game.date,
    time: game.time,
    flags: game.flags,
    revealed: game.revealed,
  }))
}

// Main migration logic
async function migrate() {
  console.log("=== DynamoDB Migration Script ===")
  console.log(`Old table: ${OLD_TABLE_NAME}`)
  console.log(`New table: ${NEW_TABLE_NAME}`)
  console.log(`Dry run: ${DRY_RUN}\n`)

  // Wipe new table first (unless dry run)
  if (!DRY_RUN) {
    await wipeNewTable()
    console.log("")
  }

  // Scan old table
  const oldRecords = await scanOldTable()

  // Map to collect user info from all sources
  const userInfoMap = new Map<string, UserInfo>()

  // Track emails that have games
  const emailsWithGames = new Set<string>()

  // First pass: collect user info from ALL sources
  console.log("Collecting user info from all sources...")
  for (const record of oldRecords) {
    const pk = record.userId
    const sk = record.timestamp

    // Game records: PK=USER#email, SK=DATE#date
    if (pk.startsWith("USER#") && sk.startsWith("DATE#")) {
      const userEmail = record.rawUserId || extractEmail(pk)
      if (userEmail) {
        emailsWithGames.add(userEmail)
        // Games may have userName/userImage in some old formats
        if (record.userName || record.userImage) {
          collectUserInfo(userInfoMap, userEmail, record.userName, record.userImage)
        }
      }
    }
    // BestGame records: PK=BEST, SK=BEST#email (collect user info if present)
    else if (pk === "BEST" && sk.startsWith("BEST#")) {
      const userEmail = record.rawUserId || extractEmail(sk)
      if (userEmail && (record.userName || record.userImage)) {
        collectUserInfo(userInfoMap, userEmail, record.userName, record.userImage)
      }
    }
    // UserStats records: PK=STAT#email, SK=STAT
    else if (pk.startsWith("STAT#") && sk === "STAT") {
      const userEmail = record.rawUserId || extractEmail(pk)
      if (userEmail) {
        collectUserInfo(userInfoMap, userEmail, record.userName, record.userImage, record.noFlagWins)
      }
    }
  }

  console.log(`Found ${emailsWithGames.size} emails with game activity`)
  console.log(`Collected profile info for ${userInfoMap.size} users`)

  // Second pass: process games and create user records
  const games: NewGame[] = []
  const users: NewUser[] = []

  for (const record of oldRecords) {
    const pk = record.userId
    const sk = record.timestamp

    // Game records: PK=USER#email, SK=DATE#date
    if (pk.startsWith("USER#") && sk.startsWith("DATE#")) {
      const userEmail = record.rawUserId || extractEmail(pk)
      const time = record.time || record.timePlayed || 0

      if (!userEmail || !record.date) {
        console.warn(`Skipping invalid game record: ${pk}/${sk}`)
        continue
      }

      // Skip abandoned games that lasted more than 10 minutes (600,000 ms)
      if (record.status === "abandoned" && time > 600000) {
        console.log(`Skipping abandoned game over 10 min: ${userEmail} - ${record.date} (${time}ms)`)
        continue
      }

      games.push({
        userEmail,
        date: record.date,
        time,
        flags: record.usedFlags || 0,
        revealed: record.cellsRevealed || 0,
        status: transformStatus(record.status || "lost"),
      })
    }
    // UserStats records: PK=STAT#email, SK=STAT
    else if (pk.startsWith("STAT#") && sk === "STAT") {
      const userEmail = record.rawUserId || extractEmail(pk)

      if (!userEmail) {
        console.warn(`Skipping invalid user stats record: ${pk}/${sk}`)
        continue
      }

      // Get collected user info (merged from all sources)
      const userInfo = userInfoMap.get(userEmail)

      // Skip users with no profile info and no game activity
      if (!hasProfileInfo(userInfo) && !emailsWithGames.has(userEmail)) {
        console.log(`Skipping user with no profile and no activity: ${userEmail}`)
        continue
      }

      users.push({
        userEmail,
        userId: shortId(),
        userName: userInfo?.userName || "",
        userPicture: userInfo?.userPicture || "",
        totalNoFlagsWin: userInfo?.noFlagWins || 0,
      })
    }
  }

  // Compute best games from won games (only for users with profile info)
  const bestGames = computeBestGames(games, userInfoMap)

  // Count users with/without profile
  const usersWithProfile = users.filter(u => u.userName || u.userPicture).length
  const usersWithoutProfile = users.length - usersWithProfile

  // Count won games and how many users have wins
  const wonGames = games.filter(g => g.status === "won")
  const usersWithWins = new Set(wonGames.map(g => g.userEmail)).size

  console.log(`\nTransformed records:`)
  console.log(`  - Games: ${games.length} (${wonGames.length} wins from ${usersWithWins} users)`)
  console.log(`  - Best Games (computed from wins, only users with profile): ${bestGames.length}`)
  console.log(`  - Users: ${users.length} (${usersWithProfile} with profile, ${usersWithoutProfile} without)`)

  if (DRY_RUN) {
    console.log("\n--- DRY RUN MODE - No data will be written ---")
    console.log("\nSample games (first 3):")
    games.slice(0, 3).forEach(g => console.log(JSON.stringify(g, null, 2)))
    console.log("\nSample best games (first 3, sorted by time):")
    bestGames.sort((a, b) => a.time - b.time).slice(0, 3).forEach(b => console.log(JSON.stringify(b, null, 2)))
    console.log("\nSample users with profile (first 3):")
    users.filter(u => u.userName || u.userPicture).slice(0, 3).forEach(u => console.log(JSON.stringify(u, null, 2)))
    console.log("\nSample users without profile (first 3):")
    users.filter(u => !u.userName && !u.userPicture).slice(0, 3).forEach(u => console.log(JSON.stringify(u, null, 2)))
    return
  }

  // Write games in batches
  if (games.length > 0) {
    console.log("\nWriting game records...")
    const gameBatches = chunk(games, 25)
    let gameCount = 0

    for (const batch of gameBatches) {
      const requests = batch.map(game => GameEntity.build(BatchPutRequest).item(game))
      const command = MinesweeperBffTable.build(BatchWriteCommand).requests(...requests)
      await executeBatchWrite(command)
      gameCount += batch.length
      process.stdout.write(`\rWritten ${gameCount}/${games.length} games`)
    }
    console.log("\nGame records written successfully!")
  }

  // Write best games
  if (bestGames.length > 0) {
    console.log("\nWriting best game records...")
    const bestGameBatches = chunk(bestGames, 25)
    let bestGameCount = 0

    for (const batch of bestGameBatches) {
      const requests = batch.map(bestGame => BestGameEntity.build(BatchPutRequest).item(bestGame))
      const command = MinesweeperBffTable.build(BatchWriteCommand).requests(...requests)
      await executeBatchWrite(command)
      bestGameCount += batch.length
      process.stdout.write(`\rWritten ${bestGameCount}/${bestGames.length} best games`)
    }
    console.log("\nBest game records written successfully!")
  }

  // Write users
  if (users.length > 0) {
    console.log("\nWriting user records...")
    const userBatches = chunk(users, 25)
    let userCount = 0

    for (const batch of userBatches) {
      const requests = batch.map(user => UserEntity.build(BatchPutRequest).item(user))
      const command = MinesweeperBffTable.build(BatchWriteCommand).requests(...requests)
      await executeBatchWrite(command)
      userCount += batch.length
      process.stdout.write(`\rWritten ${userCount}/${users.length} users`)
    }
    console.log("\nUser records written successfully!")
  }

  console.log("\n=== Migration Complete ===")
  console.log(`Total games migrated: ${games.length}`)
  console.log(`Total best games computed: ${bestGames.length}`)
  console.log(`Total users migrated: ${users.length}`)
}

// Utility function to chunk arrays
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Run migration
migrate().catch(error => {
  console.error("Migration failed:", error)
  process.exit(1)
})


// AWS_PROFILE=your-profile OLD_TABLE_NAME=old-table NEW_TABLE_NAME=new-table DRY_RUN=true npx tsx script.ts