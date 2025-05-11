import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  QueryCommand, 
  ScanCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Initialize DynamoDB client with SDK v3
const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME!;
const STATUS_TIME_INDEX = process.env.STATUS_TIME_INDEX!;

// Common headers for all responses
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization'
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS enabled' })
    };
  }
  
  try {
    // Route the request based on path and method
    const path = event.path.toLowerCase();
    
    // Handle leaderboard request
    if (path.includes('/leaderboard')) {
      // Check if this is a context request
      if (path.includes('/context/')) {
        const userId = event.pathParameters?.userId;
        if (!userId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: 'User ID is required' })
          };
        }
        return await getUserLeaderboardContext(userId);
      }
      return await getLeaderboard(event);
    }
    
    // Handle user stats request
    if (path.includes('/stats/')) {
      const userId = event.pathParameters?.userId;
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User ID is required' })
        };
      }
      return await getUserStats(userId);
    }
    
    // Handle best games request (new endpoint)
    if (path.includes('/bestgames/')) {
      const userId = event.pathParameters?.userId;
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'User ID is required' })
        };
      }
      const limit = event.queryStringParameters?.limit ? 
        parseInt(event.queryStringParameters.limit) : 5;
      return await getUserBestGames(userId, limit);
    }
    
    // Handle games endpoint
    if (path.includes('/games')) {
      if (event.httpMethod === 'GET') {
        return await getGames(event);
      }
      if (event.httpMethod === 'POST') {
        return await saveGame(event);
      }
    }

    // Handle unrecognized endpoints
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Endpoint not found' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};

/**
 * Save a game result
 */
async function saveGame(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'Request body is required' }),
    };
  }

  const body = JSON.parse(event.body);
  
  const { 
    userId, 
    status, 
    time, 
    successTime, 
    winTime, 
    userName, 
    userImage, 
    usedFlags, 
    bombsExploded,
    noFlagWin,
    timePlayed,
    cellsRevealed,
    gameRestarts
  } = body;

  if (!userId || !status) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: 'userId and status are required' }),
    };
  }

  const timestamp = new Date().toISOString();
  
  // Handle different time field names that might be sent by the client
  const gameTime = Number(time || successTime || winTime || 0);
  
  // Calculate TTL for record expiration (e.g., 90 days)
  const ttl = Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60);
  
  // Format keys with proper prefixes
  const userPK = `USER#${userId}`;
  const dateSK = `DATE#${timestamp}`;
  
  // Entity 1: PK:'USER#{userId}', SK:'DATE#{date}' - Regular game record
  const gameItem = {
    userId: userPK, // Use prefixed PK
    timestamp: dateSK, // Use prefixed SK
    rawUserId: userId, // Store the raw userId for easier access
    status,
    time: gameTime,
    date: timestamp,
    ttl,
    userName: userName || userId, // Use userId as fallback
    userImage: userImage || null,
    // Store the additional game stats
    usedFlags: usedFlags !== undefined ? usedFlags : null,
    bombsExploded: bombsExploded !== undefined ? bombsExploded : null,
    noFlagWin: noFlagWin !== undefined ? noFlagWin : null,
    timePlayed: timePlayed !== undefined ? timePlayed : null,
    cellsRevealed: cellsRevealed !== undefined ? cellsRevealed : null,
    gameRestarts: gameRestarts !== undefined ? gameRestarts : null
  };

  // Use AWS SDK v3 pattern for DynamoDB to save the game record
  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: gameItem,
    })
  );

  // If this is a successful game and has a time, update best time if appropriate
  if (status === 'success' && gameTime > 0) {
    try {
      // Check if there's already a best time entry for this user in the BEST partition
      const bestPK = 'BEST';
      const bestSK = `BEST#${userId}`;
      
      const existingBestTime = await dynamoDB.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :pk AND #ts = :sk',
        ExpressionAttributeValues: {
          ':pk': bestPK,
          ':sk': bestSK
        },
        ExpressionAttributeNames: {
          '#ts': 'timestamp'
        }
      }));
      
      const currentBestItem = existingBestTime.Items && existingBestTime.Items.length > 0 
        ? existingBestTime.Items[0] 
        : null;
      
      // If no existing record or the new time is better (lower), update it
      if (!currentBestItem || gameTime < currentBestItem.time) {
        // Create/update entry in the BEST partition
        const bestTimeItem = {
          userId: bestPK, // PK is BEST
          timestamp: bestSK, // SK is BEST#{userId}
          rawUserId: userId, // Store the raw userId for easier access
          time: gameTime,
          date: timestamp,
          ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // Longer TTL for best times (1 year)
          userName: userName || userId,
          userImage: userImage || null,
          // Include additional stats for the best time records as well
          usedFlags: usedFlags !== undefined ? usedFlags : null,
          noFlagWin: noFlagWin !== undefined ? noFlagWin : null,
          timePlayed: timePlayed !== undefined ? timePlayed : null,
          cellsRevealed: cellsRevealed !== undefined ? cellsRevealed : null,
          gameRestarts: gameRestarts !== undefined ? gameRestarts : null
        };
        
        await dynamoDB.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: bestTimeItem,
          })
        );
      }
    } catch (error) {
      console.error('Error checking/updating best time:', error);
      // Continue - don't fail the whole operation if just the best time update fails
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'Game result stored successfully',
      item: gameItem
    }),
  };
}

/**
 * Get games with optional filtering
 */
async function getGames(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const userId = event.queryStringParameters?.userId;
  const status = event.queryStringParameters?.status;
  const limit = event.queryStringParameters?.limit ? 
    parseInt(event.queryStringParameters.limit) : 100;
  
  try {
    // If userId is provided, query by user
    if (userId) {
      const userPK = `USER#${userId}`; // Format with proper prefix
      
      const params: any = {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'userId = :userId AND begins_with(#ts, :datePrefix)',
        ExpressionAttributeValues: {
          ':userId': userPK,
          ':datePrefix': 'DATE#'
        },
        ExpressionAttributeNames: { 
          '#ts': 'timestamp'
        },
        ScanIndexForward: false, // Return in descending order by sort key (timestamp)
        // Don't limit the query when getting success games, as we need to sort them first
        Limit: status === 'success' ? undefined : limit
      };
      
      // Add filter for status if provided
      if (status) {
        params.FilterExpression = '#st = :status';
        params.ExpressionAttributeValues[':status'] = status;
        params.ExpressionAttributeNames['#st'] = 'status';
      }
      
      const result = await dynamoDB.send(new QueryCommand(params));
      
      // Transform results to standardize userId (remove prefix)
      let transformedItems = (result.Items || []).map((item: any) => ({
        ...item,
        userId: item.rawUserId || (item.userId.startsWith('USER#') ? item.userId.substring(5) : item.userId),
        // Clean up the timestamp by removing prefix if needed
        displayTimestamp: item.timestamp.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp
      }));
      
      // For successful games, sort by time and limit to the requested number (fastest first)
      if (status === 'success') {
        transformedItems = transformedItems
          .sort((a: any, b: any) => a.time - b.time)
          .slice(0, limit);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(transformedItems)
      };
    }
    
    // If no userId, we need to scan as we can't use keys
    // This is less efficient but necessary without a GSI
    const params: any = {
      TableName: TABLE_NAME,
      FilterExpression: 'begins_with(#ts, :datePrefix)',
      ExpressionAttributeValues: {
        ':datePrefix': 'DATE#'
      },
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      },
      Limit: limit
    };
    
    // Add filter for status if provided
    if (status) {
      params.FilterExpression += ' AND #st = :status';
      params.ExpressionAttributeValues[':status'] = status;
      params.ExpressionAttributeNames['#st'] = 'status';
    }
    
    const result = await dynamoDB.send(new ScanCommand(params));
    
    // Transform results to standardize userId (remove prefix)
    const transformedItems = (result.Items || []).map((item: any) => ({
      ...item,
      userId: item.rawUserId || (item.userId.startsWith('USER#') ? item.userId.substring(5) : item.userId),
      // Clean up the timestamp by removing prefix if needed
      displayTimestamp: item.timestamp.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp
    }));
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transformedItems)
    };
  } catch (error) {
    console.error('Error fetching games:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error fetching games',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
}

/**
 * Get leaderboard of fastest successful games
 */
async function getLeaderboard(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const limit = event.queryStringParameters?.limit ? 
    parseInt(event.queryStringParameters.limit) : 10;
  
  try {
    // Scan the BEST partition for all best times
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :best',
      ExpressionAttributeValues: {
        ':best': 'BEST'
      }
    };
    
    const result = await dynamoDB.send(new QueryCommand(params));
    
    // Sort by time (ascending) to get fastest times first
    const sortedResults = (result.Items || []).sort((a: any, b: any) => a.time - b.time);
    
    // Take the limit
    const topResults = sortedResults.slice(0, limit);
    
    // Process results to create proper leaderboard format with ranks
    const leaderboard = topResults.map((item: any, index: number) => {
      // Extract the raw userId from the SK (BEST#{userId})
      const rawUserId = item.rawUserId || 
        (item.timestamp.startsWith('BEST#') ? item.timestamp.substring(5) : '');
        
      return {
        rank: index + 1,
        userId: rawUserId,
        userName: item.userName || rawUserId,
        userImage: item.userImage || null,
        time: item.time,
        date: item.date
      };
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(leaderboard)
    };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error fetching leaderboard',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
}

/**
 * Get a user's position in the leaderboard with context
 * (returns entries just above and below the user)
 */
async function getUserLeaderboardContext(userId: string): Promise<APIGatewayProxyResult> {
  const contextSize = 2; // Number of entries above and below to include
  
  try {
    // Scan the BEST partition for all best times
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :best',
      ExpressionAttributeValues: {
        ':best': 'BEST'
      }
    };
    
    const result = await dynamoDB.send(new QueryCommand(params));
    const allBestTimes = result.Items || [];
    
    // Sort by time (ascending) to get fastest times first
    const sortedResults = allBestTimes.sort((a: any, b: any) => a.time - b.time);
    
    // Format as leaderboard entries with ranks
    const fullLeaderboard = sortedResults.map((item: any, index: number) => {
      // Extract the raw userId from the SK (BEST#{userId})
      const rawUserId = item.rawUserId || 
        (item.timestamp.startsWith('BEST#') ? item.timestamp.substring(5) : '');
        
      return {
        rank: index + 1,
        userId: rawUserId,
        userName: item.userName || rawUserId,
        userImage: item.userImage || null,
        time: item.time,
        date: item.date
      };
    });
    
    // Find the user's position
    const userIndex = fullLeaderboard.findIndex(entry => entry.userId === userId);
    
    // If user not found, return empty array
    if (userIndex === -1) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }
    
    // Calculate the start and end indices for the context window
    const startIndex = Math.max(0, userIndex - contextSize);
    const endIndex = Math.min(fullLeaderboard.length - 1, userIndex + contextSize);
    
    // Extract the context window
    const contextEntries = fullLeaderboard.slice(startIndex, endIndex + 1);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(contextEntries)
    };
  } catch (error) {
    console.error('Error fetching user leaderboard context:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error fetching user leaderboard context',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
}

/**
 * Get stats for a specific user
 */
async function getUserStats(userId: string): Promise<APIGatewayProxyResult> {
  // Format the user key with proper prefix
  const userPK = `USER#${userId}`;
  
  // Query all games for this user
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userPK
    }
  };
  
  const result = await dynamoDB.send(new QueryCommand(params));
  const games = result.Items || [];
  
  // Check the BEST partition for the user's best time
  const bestParams = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'userId = :best AND #ts = :sk',
    ExpressionAttributeValues: {
      ':best': 'BEST',
      ':sk': `BEST#${userId}`
    },
    ExpressionAttributeNames: {
      '#ts': 'timestamp'
    }
  };
  
  const bestTimeResult = await dynamoDB.send(new QueryCommand(bestParams));
  const bestTimeRecord = bestTimeResult.Items && bestTimeResult.Items.length > 0 
    ? bestTimeResult.Items[0] 
    : null;
  
  // Calculate stats
  let totalGames = 0;
  let wins = 0;
  let losses = 0;
  let fastestWin = bestTimeRecord ? bestTimeRecord.time : Number.MAX_SAFE_INTEGER;
  let averageWinTime = 0;
  let totalWinTime = 0;
  let userName = bestTimeRecord?.userName || userId;
  let userImage = bestTimeRecord?.userImage || null;
  // New stats
  let bombsExploded = 0;
  let noFlagWins = 0;
  let totalTimePlayed = 0;
  let gamesWithTimePlayed = 0;
  // Additional new stats
  let totalCellsRevealed = 0;
  let totalGameRestarts = 0;
  let abandonedGames = 0;
  let restartedGames = 0;
  let totalFlagsUsed = 0; // Track total flags used
  
  // Filter out records that aren't regular game records
  const regularGames = games.filter((game: any) => 
    game.timestamp.startsWith('DATE#')
  );
  totalGames = regularGames.length;
  
  regularGames.forEach((game: any) => {
    // If we have a userName or userImage from any record, use the most recent one
    if (game.userName && !userName) {
      userName = game.userName;
    }
    if (game.userImage && !userImage) {
      userImage = game.userImage;
    }
    
    // Track bombs exploded if available
    if (game.bombsExploded) {
      bombsExploded += game.bombsExploded;
    }
    
    // Track no flag wins if available
    if (game.status === 'success' && game.noFlagWin === true) {
      noFlagWins++;
    }
    
    // Track time played if available
    if (game.timePlayed && typeof game.timePlayed === 'number') {
      totalTimePlayed += game.timePlayed;
      gamesWithTimePlayed++;
    }
    
    // Track cells revealed
    if (game.cellsRevealed && typeof game.cellsRevealed === 'number') {
      totalCellsRevealed += game.cellsRevealed;
    }

    // Track game restarts 
    if (game.gameRestarts && typeof game.gameRestarts === 'number') {
      totalGameRestarts += game.gameRestarts;
    }
    
    // Track flags used
    if (game.usedFlags && typeof game.usedFlags === 'number') {
      totalFlagsUsed += game.usedFlags;
    }
    
    // Track game status categories
    if (game.status === 'success') {
      wins++;
      totalWinTime += game.time || 0;
      // Only use game times for fastestWin calculation if we don't have a bestTimeRecord
      if (!bestTimeRecord) {
        fastestWin = Math.min(fastestWin, game.time || Number.MAX_SAFE_INTEGER);
      }
    } else if (game.status === 'defeat') {
      losses++;
    } else if (game.status === 'abandoned') {
      abandonedGames++;
    } else if (game.status === 'restarted') {
      restartedGames++;
    }
  });
  
  // Calculate average win time
  averageWinTime = wins > 0 ? Math.round(totalWinTime / wins) : 0;
  
  // Calculate average game time
  const averageGameTime = gamesWithTimePlayed > 0 ? Math.round(totalTimePlayed / gamesWithTimePlayed) : 0;
  
  // If no wins, set fastestWin to 0
  if (fastestWin === Number.MAX_SAFE_INTEGER) {
    fastestWin = 0;
  }
  
  // Create stats object
  const stats = {
    userId,
    userName,
    userImage,
    totalGames,
    wins,
    losses,
    winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
    fastestWin,
    averageWinTime,
    // Add new stats
    bombsExploded,
    noFlagWins,
    timePlayed: totalTimePlayed,
    averageGameTime,
    // Add additional new stats
    totalCellsRevealed,
    gameRestarts: totalGameRestarts,
    abandonedGames,
    restartedGames,
    recentGames: regularGames
      .sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 5)
      .map((game: any) => ({
        ...game,
        userId: game.rawUserId || userId, // Use the raw userId if available
      })),
    totalFlagsUsed
  };
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(stats)
  };
}

/**
 * Get a user's best (fastest) games
 */
async function getUserBestGames(userId: string, limit: number = 5): Promise<APIGatewayProxyResult> {
  try {
    const results = [];
    
    // STEP 1: Check for entries in the BEST partition first
    const bestParams = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :best AND #ts = :sk',
      ExpressionAttributeValues: {
        ':best': 'BEST',
        ':sk': `BEST#${userId}`
      },
      ExpressionAttributeNames: {
        '#ts': 'timestamp'
      }
    };
    
    const bestTimeResult = await dynamoDB.send(new QueryCommand(bestParams));
    const bestTimeRecord = bestTimeResult.Items && bestTimeResult.Items.length > 0 
      ? bestTimeResult.Items[0] 
      : null;
    
    if (bestTimeRecord && bestTimeRecord.time > 0) {
      results.push({
        ...bestTimeRecord,
        userId: bestTimeRecord.rawUserId || userId,
        status: 'success',
        date: bestTimeRecord.date || new Date().toISOString()
      });
    }
    
    // STEP 2: Check regular game records 
    const userPK = `USER#${userId}`;
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId AND begins_with(#ts, :datePrefix)',
      ExpressionAttributeValues: {
        ':userId': userPK,
        ':datePrefix': 'DATE#'
      },
      ExpressionAttributeNames: { 
        '#ts': 'timestamp'
      }
    };
    
    const result = await dynamoDB.send(new QueryCommand(params));
    
    // Transform results to standardize userId (remove prefix)
    const allGames = (result.Items || []).map((item: any) => ({
      ...item,
      userId: item.rawUserId || (item.userId.startsWith('USER#') ? item.userId.substring(5) : item.userId),
      // Clean up the timestamp by removing prefix if needed
      date: item.date || (item.timestamp.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp),
      displayTimestamp: item.timestamp.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp
    }));
    
    // Filter to only include successful games with valid times
    const successGames = allGames.filter(game => {
      // Accept any of these conditions as a "successful" game:
      // 1. status is 'success'
      // 2. game has a time/successTime/winTime value > 0
      const hasValidTime = 
        (game.time && game.time > 0) || 
        (game.successTime && game.successTime > 0) || 
        (game.winTime && game.winTime > 0);
      
      return (
        (game.status === 'success') && 
        hasValidTime
      );
    });
    
    // Normalize the time field
    const normalizedGames = successGames.map(game => ({
      ...game,
      // Use the first non-zero time value found
      time: game.time || game.successTime || game.winTime || 0,
      // Ensure date is properly formatted
      date: game.date || new Date(game.displayTimestamp).toISOString()
    }));
    
    // Add these to our results array
    results.push(...normalizedGames);
    
    // Deduplicate (in case the same game is in both BEST and regular records)
    const uniqueResults = [];
    const seen = new Set();
    
    for (const game of results) {
      // Use a combination of time and date as a unique key
      const key = `${game.time}-${game.date}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(game);
      }
    }
    
    // Sort by time (ascending) to get fastest times first and limit to requested count
    const bestGames = uniqueResults
      .sort((a: any, b: any) => a.time - b.time)
      .slice(0, limit);
    
    // If we still have no results after all this, it's a true data issue
    console.log(`Found ${bestGames.length} best games for user ${userId}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(bestGames)
    };
  } catch (error) {
    console.error(`Error fetching best games for user ${userId}:`, error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error fetching best games',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
} 