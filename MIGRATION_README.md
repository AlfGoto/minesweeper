# DynamoDB Migration Documentation

This document describes the data format migration from the old DynamoDB table to the new one.

## Source

The migration reads directly from the old DynamoDB table which contains:
- **Game records**: Individual game history (PK: `USER#<email>`, SK: `DATE#<date>`)
- **UserStats records**: Aggregated user statistics (PK: `STAT#<email>`, SK: `STAT`)
- **BestGame records**: Best winning game per user (PK: `BEST`, SK: `BEST#<email>`)

---

## Old Data Format

### Old Game Entity (`results.csv`)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `userId` | string | Partition key, format: `USER#<email>` | `"USER#iamclementdubois@gmail.com"` |
| `timestamp` | string | Sort key, format: `DATE#<ISO_date>` | `"DATE#2025-11-19T17:18:59.363Z"` |
| `_et` | string | Entity type | `"Game"` |
| `cellsRevealed` | string | Number of cells revealed | `"218"` |
| `date` | string | ISO date string | `"2025-11-19T17:18:59.363Z"` |
| `status` | string | Game outcome: `"defeat"`, `"success"`, `"restarted"` | `"success"` |
| `time` | string | Game duration in milliseconds | `"1284500"` |
| `usedFlags` | string | Number of flags used | `"81"` |
| `noFlagWin` | string | Whether won without flags | `"false"` |
| `rawUserId` | string | User email | `"iamclementdubois@gmail.com"` |
| `userImage` | string | User profile picture URL | `"https://lh3.googleusercontent.com/..."` |
| `userName` | string | User display name | `"Clement Dubois"` |

### Old UserStats Entity (`results (1).csv`)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `userId` | string | PK, format: `STAT#<email>` | `"STAT#alfgoto@gmail.com"` |
| `timestamp` | string | SK: `"STAT"` | `"STAT"` |
| `_et` | string | `"UserStats"` or empty | `"UserStats"` |
| `gamesAbandoned` | string | Total games abandoned | `"12"` |
| `gamesLost` | string | Total games lost | `"1806"` |
| `gamesPlayed` | string | Total games played | `"2274"` |
| `gamesRestarted` | string | Total games restarted | `"42"` |
| `gamesWon` | string | Total games won | `"414"` |
| `fastestWin` | string | Best winning time (ms) | `"1343"` |
| `noFlagWins` | string | Total no-flag wins | `"13"` |
| `totalBombsExploded` | string | Total bombs exploded | `"1806"` |
| `totalCellsRevealed` | string | Total cells revealed | `"219937"` |
| `totalFlagsPlaced` | string | Total flags placed | `"65056"` |
| `totalGameRestarts` | string | Total game restarts | `"93"` |
| `totalTimePlayed` | string | Total time played (ms) | `"92477109"` |
| `totalWinTime` | string | Total winning time (ms) | `"50255308"` |
| `userImage` | string | Profile picture URL | `"https://..."` |
| `userName` | string | Display name | `"Alf Goto"` |
| `rawUserId` | string | User email | `"alfgoto@gmail.com"` |

### Old BestGame Entity (`results (1).csv`)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `userId` | string | PK: `"BEST"` | `"BEST"` |
| `timestamp` | string | SK, format: `BEST#<email>` | `"BEST#alfgoto@gmail.com"` |
| `_et` | string | `"BestGame"` | `"BestGame"` |
| `cellsRevealed` | string | Cells revealed in best game | `"177"` |
| `date` | string | Best game date | `"2025-06-16T12:55:07.287Z"` |
| `time` | string | Best game time (ms) | `"46530"` |
| `usedFlags` | string | Flags used in best game | `"61"` |
| `rawUserId` | string | User email | `"alfgoto@gmail.com"` |
| `userImage` | string | Profile picture URL | `"https://..."` |
| `userName` | string | Display name | `"Alf Goto"` |

---

## New Data Format (dynamodb-toolbox entities)

### New GameEntity

| Field | Type | Key | Description |
|-------|------|-----|-------------|
| `PK` | string | Partition | Format: `GAME#<userEmail>` |
| `SK` | string | Sort | Format: `GAME#<date>` |
| `time` | number | - | Game duration in milliseconds |
| `flags` | number | - | Number of flags used |
| `revealed` | number | - | Number of cells revealed |
| `status` | string | - | Enum: `"won"`, `"lost"`, `"restarted"` |
| `date` | string | Key | ISO date string |
| `userEmail` | string | Key | User email |
| `GSI1PK` | string | GSI1 PK | Format: `USER_BEST_GAMES#<userEmail>` |
| `GSI1SK` | string | GSI1 SK | Format: `TIME#<time>` |

### New BestGameEntity

| Field | Type | Key | Description |
|-------|------|-----|-------------|
| `PK` | string | Partition | Constant: `"BEST_GAMES"` |
| `SK` | string | Sort | Format: `BEST#<userEmail>` |
| `time` | number | - | Best game duration in ms |
| `flags` | number | - | Flags used in best game |
| `revealed` | number | - | Cells revealed in best game |
| `date` | string | - | Best game date |
| `userEmail` | string | Key | User email |

### New UserEntity

| Field | Type | Key | Description |
|-------|------|-----|-------------|
| `PK` | string | Partition | Format: `USER#<userEmail>` |
| `SK` | string | Sort | Format: `USER#<userEmail>` |
| `userEmail` | string | Key | User email |
| `userId` | string | Key | User ID (from auth provider) |
| `userName` | string | - | User display name |
| `userPicture` | string | - | Profile picture URL |
| `totalNoFlagsWin` | number | - | Total no-flags wins |
| `GSI1PK` | string | GSI1 PK | Format: `USERID#<userId>` |
| `GSI1SK` | string | GSI1 SK | Format: `USERID#<userId>` |

---

## Transformation Rules

### Game Records

| Old Field | New Field | Transformation |
|-----------|-----------|----------------|
| `userId` | `userEmail` | Extract email: `USER#email` -> `email` |
| `timestamp` | `date` | Extract date: `DATE#date` -> `date` |
| `cellsRevealed` | `revealed` | Parse to number |
| `usedFlags` | `flags` | Parse to number |
| `time` | `time` | Parse to number |
| `status` | `status` | `"defeat"` -> `"lost"`, `"success"` -> `"won"` |

### BestGame Records

For each user, find the winning game with the **lowest time** and create a BestGameEntity.

### User Records

Aggregate user information from Game records:
- `userEmail`: from `rawUserId`
- `userId`: set to `rawUserId` (email) as fallback since original userId is not preserved
- `userName`: from `userName`
- `userPicture`: from `userImage`
- `totalNoFlagsWin`: count games where `status="success"` AND `usedFlags="0"`

---

---

## Running the Migration

```bash
# Dry run (no writes, just shows what would be migrated)
OLD_TABLE_NAME=old-table NEW_TABLE_NAME=new-table DRY_RUN=true npx tsx script.ts

# Production run
OLD_TABLE_NAME=old-table NEW_TABLE_NAME=new-table npx tsx script.ts
```

## Statistics (from CSV exports)

- Game records: ~1,297
- UserStats records: ~76
- BestGame records: ~14
