# Minesweeper API

This is the API for storing and retrieving Minesweeper game results.

## Fixed Lambda Issues

### Entry Point Issue

The Lambda function was previously failing with the error:
```
Error: Cannot find module 'index'
Require stack:
- /var/runtime/index.mjs
```

### AWS SDK Issue

Another error was encountered:
```
Error: Cannot find module 'aws-sdk'
Require stack:
- /var/task/index.js
- /var/runtime/index.mjs
```

This happened because AWS Lambda Node.js 20.x runtime no longer includes the AWS SDK v2 by default.

## What was fixed:

1. **Entry Point Configuration:**
   - Updated the Lambda function to use an absolute path with `path.join(__dirname, '../lambda/api.ts')`
   - Explicitly specified the handler function name
   - Added proper bundling options to ensure correct code transformation

2. **AWS SDK Update:**
   - Migrated from AWS SDK v2 to AWS SDK v3
   - Updated the DynamoDB client code to use the new modular SDK
   - Configured the CDK bundling to include the necessary AWS SDK v3 modules
   - Removed `aws-sdk` from the external modules list

3. **Enhanced DynamoDB Design:**
   - Added Global Secondary Index for leaderboard queries
   - Implemented TTL for automatic cleanup of old records
   - Structured data to enable efficient querying

4. **Added New Endpoints:**
   - Leaderboard endpoint for fastest completion times
   - User stats endpoint for player-specific statistics
   - Enhanced games endpoint with filtering options

## Deployment

To deploy the API:

1. Make the deployment script executable:
```bash
chmod +x deploy.sh
```

2. Run the deployment script:
```bash
./deploy.sh
```

This will install dependencies, build the CDK app, and deploy the stack to AWS.

## API Usage

### Game Results

**POST /games**

Save a game result:
```json
{
  "userId": "user123",
  "status": "success|defeat",
  "time": 42
}
```

You can also use `successTime` or `winTime` instead of `time`.

**GET /games?userId=user123&status=success&limit=10**

Retrieve game results:
- `userId` (optional): Filter by user ID
- `status` (optional): Filter by game status ("success" or "defeat")
- `limit` (optional): Limit the number of results (default 100)

### Leaderboard

**GET /leaderboard?limit=10**

Get the fastest completion times across all players:
- `limit` (optional): Limit the number of results (default 10)

Response:
```json
[
  {
    "rank": 1,
    "userId": "user123",
    "time": 42,
    "date": "2023-05-07T14:25:16.423Z"
  },
  ...
]
```

### User Stats

**GET /stats/{userId}**

Get statistics for a specific user:

Response:
```json
{
  "userId": "user123",
  "totalGames": 25,
  "wins": 15,
  "losses": 10,
  "winRate": 60,
  "fastestWin": 42,
  "averageWinTime": 78,
  "recentGames": [...]
}
``` 