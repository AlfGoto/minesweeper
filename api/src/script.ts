import { randomUUID } from "crypto"
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"
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

// Main migration logic
async function migrate() {
  console.log("=== DynamoDB Migration Script ===")
  console.log(`Old table: ${OLD_TABLE_NAME}`)
  console.log(`New table: ${NEW_TABLE_NAME}`)
  console.log(`Dry run: ${DRY_RUN}\n`)

  // Scan old table
  const oldRecords = await scanOldTable()

  // Categorize records
  const games: NewGame[] = []
  const bestGames: NewBestGame[] = []
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

      games.push({
        userEmail,
        date: record.date,
        time,
        flags: record.usedFlags || 0,
        revealed: record.cellsRevealed || 0,
        status: transformStatus(record.status || "lost"),
      })
    }
    // BestGame records: PK=BEST, SK=BEST#email
    else if (pk === "BEST" && sk.startsWith("BEST#")) {
      const userEmail = record.rawUserId || extractEmail(sk)
      const time = record.time || record.timePlayed || 0

      if (!userEmail || !record.date) {
        console.warn(`Skipping invalid best game record: ${pk}/${sk}`)
        continue
      }

      bestGames.push({
        userEmail,
        date: record.date,
        time,
        flags: record.usedFlags || 0,
        revealed: record.cellsRevealed || 0,
      })
    }
    // UserStats records: PK=STAT#email, SK=STAT
    else if (pk.startsWith("STAT#") && sk === "STAT") {
      const userEmail = record.rawUserId || extractEmail(pk)

      if (!userEmail) {
        console.warn(`Skipping invalid user stats record: ${pk}/${sk}`)
        continue
      }

      users.push({
        userEmail,
        userId: shortId(), // Generate new short ID like the app does
        userName: record.userName || "",
        userPicture: record.userImage || "",
        totalNoFlagsWin: record.noFlagWins || 0,
      })
    }
  }

  console.log(`\nTransformed records:`)
  console.log(`  - Games: ${games.length}`)
  console.log(`  - Best Games: ${bestGames.length}`)
  console.log(`  - Users: ${users.length}`)

  if (DRY_RUN) {
    console.log("\n--- DRY RUN MODE - No data will be written ---")
    console.log("\nSample games (first 3):")
    games.slice(0, 3).forEach(g => console.log(JSON.stringify(g, null, 2)))
    console.log("\nSample best games (first 3):")
    bestGames.slice(0, 3).forEach(b => console.log(JSON.stringify(b, null, 2)))
    console.log("\nSample users (first 3):")
    users.slice(0, 3).forEach(u => console.log(JSON.stringify(u, null, 2)))
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
  console.log(`Total best games migrated: ${bestGames.length}`)
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