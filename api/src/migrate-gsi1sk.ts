import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const TABLE_NAME = process.env.TABLE_NAME
const DRY_RUN = process.env.DRY_RUN !== "false"

if (!TABLE_NAME) {
  console.error("ERROR: TABLE_NAME environment variable is required")
  process.exit(1)
}

const client = new DynamoDBClient()

interface GameRecord {
  PK: string
  SK: string
  GSI1PK: string
  GSI1SK: string
  time: number
  _et?: string
}

async function scanGames(): Promise<GameRecord[]> {
  const records: GameRecord[] = []
  let lastEvaluatedKey: Record<string, any> | undefined

  console.log(`Scanning table: ${TABLE_NAME}`)

  do {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: "#et = :game",
      ExpressionAttributeNames: { "#et": "_et" },
      ExpressionAttributeValues: { ":game": { S: "Game" } },
      ExclusiveStartKey: lastEvaluatedKey
    })

    const response = await client.send(command)

    if (response.Items) {
      for (const item of response.Items) {
        records.push(unmarshall(item) as GameRecord)
      }
    }

    lastEvaluatedKey = response.LastEvaluatedKey
    process.stdout.write(`\rScanned ${records.length} game records...`)
  } while (lastEvaluatedKey)

  console.log(`\nTotal game records found: ${records.length}`)
  return records
}

function needsMigration(gsi1sk: string, time: number): boolean {
  const expectedPadded = `TIME#${String(time).padStart(10, "0")}`
  return gsi1sk !== expectedPadded
}

async function updateGSI1SK(pk: string, sk: string, time: number): Promise<void> {
  const newGSI1SK = `TIME#${String(time).padStart(10, "0")}`

  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: { S: pk },
      SK: { S: sk }
    },
    UpdateExpression: "SET GSI1SK = :newGSI1SK",
    ExpressionAttributeValues: {
      ":newGSI1SK": { S: newGSI1SK }
    }
  })

  await client.send(command)
}

async function migrate() {
  console.log("=== GSI1SK Migration Script ===")
  console.log(`Table: ${TABLE_NAME}`)
  console.log(`Dry run: ${DRY_RUN}\n`)

  const games = await scanGames()

  const toMigrate = games.filter((g) => needsMigration(g.GSI1SK, g.time))

  console.log(`\nRecords needing migration: ${toMigrate.length}/${games.length}`)

  if (toMigrate.length === 0) {
    console.log("No records need migration. Exiting.")
    return
  }

  console.log("\nSample records to migrate (first 5):")
  toMigrate.slice(0, 5).forEach((g) => {
    const newGSI1SK = `TIME#${String(g.time).padStart(10, "0")}`
    console.log(`  ${g.GSI1SK} -> ${newGSI1SK} (time: ${g.time}ms)`)
  })

  if (DRY_RUN) {
    console.log("\n--- DRY RUN MODE - No data will be written ---")
    console.log("Set DRY_RUN=false to apply changes")
    return
  }

  console.log("\nUpdating records...")
  let updated = 0
  let errors = 0

  for (const game of toMigrate) {
    try {
      await updateGSI1SK(game.PK, game.SK, game.time)
      updated++
      process.stdout.write(`\rUpdated ${updated}/${toMigrate.length} records...`)
    } catch (error) {
      errors++
      console.error(`\nError updating ${game.PK}/${game.SK}:`, error)
    }
  }

  console.log("\n\n=== Migration Complete ===")
  console.log(`Updated: ${updated}`)
  console.log(`Errors: ${errors}`)
}

migrate().catch((error) => {
  console.error("Migration failed:", error)
  process.exit(1)
})

// Usage:
// AWS_PROFILE=your-profile TABLE_NAME=your-table-name npx tsx migrate-gsi1sk.ts
// AWS_PROFILE=your-profile TABLE_NAME=your-table-name DRY_RUN=false npx tsx migrate-gsi1sk.ts
