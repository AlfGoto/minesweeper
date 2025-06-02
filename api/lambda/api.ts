import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { 
  DynamoDBDocumentClient, 
  PutCommand,
  QueryCommand, 
  ScanCommand,
  DeleteCommand,
  GetCommand,
  UpdateCommand
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
  
  // Calculate TTL for record expiration (7 days since we only need last 5 games)
  const ttl = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
  
  // Format keys with proper prefixes
  const userPK = `USER#${userId}`;
  const dateSK = `DATE#${timestamp}`;
  
  // Log the incoming game data
  console.log('Saving game with data:', {
    userId,
    status,
    gameTime,
    timePlayed,
    usedFlags,
    bombsExploded,
    noFlagWin,
    cellsRevealed,
    gameRestarts
  });
  
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
    // Store the additional game stats - ensure numeric values
    usedFlags: typeof usedFlags === 'number' ? usedFlags : 0,
    bombsExploded: typeof bombsExploded === 'number' ? bombsExploded : 0,
    noFlagWin: noFlagWin === true,
    timePlayed: typeof timePlayed === 'number' ? timePlayed : gameTime, // Use gameTime as fallback
    cellsRevealed: typeof cellsRevealed === 'number' ? cellsRevealed : 0,
    gameRestarts: typeof gameRestarts === 'number' ? gameRestarts : 0
  };

  // Use AWS SDK v3 pattern for DynamoDB to save the game record
  await dynamoDB.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: gameItem,
    })
  );

  // Update aggregated stats for this user
  try {
    // First get all recent games to ensure accurate stats
    const allGames = await getRecentGames(userId, 100); // Get more games to ensure accurate count
    
    // Count games by status
    const gameCounts = allGames.reduce((acc: any, game: any) => {
      const gameStatus = game.status;
      acc[gameStatus] = (acc[gameStatus] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate totals from all games
    const totalTimePlayed = allGames.reduce((sum, game) => sum + (typeof game.timePlayed === 'number' ? game.timePlayed : 0), 0);
    const totalCellsRevealed = allGames.reduce((sum, game) => sum + (typeof game.cellsRevealed === 'number' ? game.cellsRevealed : 0), 0);
    const totalFlagsUsed = allGames.reduce((sum, game) => sum + (typeof game.usedFlags === 'number' ? game.usedFlags : 0), 0);
    const totalBombsExploded = allGames.reduce((sum, game) => sum + (typeof game.bombsExploded === 'number' ? game.bombsExploded : 0), 0);
    const totalGameRestarts = allGames.reduce((sum, game) => sum + (typeof game.gameRestarts === 'number' ? game.gameRestarts : 0), 0);
    const noFlagWins = allGames.filter(game => game.status === 'success' && game.noFlagWin === true).length;
    
    // Find fastest win time
    const winGames = allGames.filter(game => game.status === 'success' && typeof game.time === 'number' && game.time > 0);
    const fastestWin = winGames.length > 0 ? Math.min(...winGames.map(game => game.time)) : null;
    const totalWinTime = winGames.reduce((sum, game) => sum + (game.time || 0), 0);
    
    // Log the stats update parameters
    const statsParams = {
      userId,
      userName: userName || userId,
      userImage: userImage || null,
      status,
      timePlayed: totalTimePlayed,
      cellsRevealed: totalCellsRevealed,
      usedFlags: totalFlagsUsed,
      bombsExploded: totalBombsExploded,
      noFlagWin: noFlagWins > 0,
      gameTime: fastestWin || 0,
      gameRestarts: totalGameRestarts,
      totalGames: allGames.length,
      gamesWon: gameCounts['success'] || 0,
      gamesLost: gameCounts['defeat'] || 0,
      gamesAbandoned: gameCounts['abandoned'] || 0,
      gamesRestarted: gameCounts['restarted'] || 0,
      totalWinTime: totalWinTime
    };
    
    console.log('Updating stats with params:', statsParams);
    
    await updateUserStats(statsParams);
  } catch (error) {
    console.error('Error updating user stats:', error);
    // Continue - don't fail the operation if stats update fails
  }

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
          // Best times should never expire - remove TTL
          userName: userName || userId,
          userImage: userImage || null,
          // Include additional stats for the best time records as well
          usedFlags: typeof usedFlags === 'number' ? usedFlags : 0,
          noFlagWin: noFlagWin === true,
          timePlayed: typeof timePlayed === 'number' ? timePlayed : gameTime,
          cellsRevealed: typeof cellsRevealed === 'number' ? cellsRevealed : 0,
          gameRestarts: typeof gameRestarts === 'number' ? gameRestarts : 0
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
    body: JSON.stringify({ message: 'Game saved successfully' }),
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
  
  // Define a type for game items
  interface GameItem {
    userId: string;
    timestamp: string;
    rawUserId?: string;
    status: string;
    time: number;
    date: string;
    ttl: number;
    userName: string;
    userImage: string | null;
    usedFlags?: number;
    bombsExploded?: number;
    noFlagWin?: boolean;
    timePlayed?: number;
    cellsRevealed?: number;
    gameRestarts?: number;
    [key: string]: any; // Allow for other fields
  }
  
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
      let transformedItems = (result.Items || []).map((item: Record<string, any>) => ({
        ...item,
        userId: item.rawUserId || (item.userId?.startsWith('USER#') ? item.userId.substring(5) : item.userId || userId),
        // Clean up the timestamp by removing prefix if needed
        displayTimestamp: item.timestamp?.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp
      }));
      
      // For successful games, sort by time and limit to the requested number (fastest first)
      if (status === 'success') {
        transformedItems = transformedItems
          .sort((a, b) => ((a.displayTimestamp as number) || 0) - ((b.displayTimestamp as number) || 0))
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
    const transformedItems = (result.Items || []).map((item: Record<string, any>) => ({
      ...item,
      userId: item.rawUserId || (item.userId?.startsWith('USER#') ? item.userId.substring(5) : item.userId),
      // Clean up the timestamp by removing prefix if needed
      displayTimestamp: item.timestamp?.startsWith('DATE#') ? item.timestamp.substring(5) : item.timestamp
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
  try {
    const statPK = `STAT#${userId}`;
    const statSK = 'STAT';
    
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: statPK,
        timestamp: statSK
      }
    }));
    
    if (result.Item) {
      const stats = result.Item;
      
      console.log('Retrieved raw stats:', stats);
      
      // Calculate derived stats
      const totalGames = stats.gamesPlayed || 0;
      const wins = stats.gamesWon || 0;
      const losses = stats.gamesLost || 0;
      const totalWinTime = stats.totalWinTime || 0;
      const timePlayed = stats.totalTimePlayed || 0;
      
      // Calculate averages
      const averageWinTime = wins > 0 ? Math.round(totalWinTime / wins) : 0;
      const averageGameTime = totalGames > 0 ? Math.round(timePlayed / totalGames) : 0;
      const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
      
      // Get recent games
      const recentGames = Array.isArray(stats.recentGames) 
        ? stats.recentGames 
        : await getRecentGames(userId, 5);
      
      // Rename fields to match frontend expectations
      const transformedStats = {
        userId: stats.rawUserId || userId,
        userName: stats.userName || userId,
        userImage: stats.userImage || null,
        totalGames,
        wins,
        losses,
        winRate,
        fastestWin: stats.fastestWin || null,
        averageWinTime,
        averageGameTime,
        bombsExploded: stats.totalBombsExploded || 0,
        noFlagWins: stats.noFlagWins || 0,
        timePlayed,
        totalCellsRevealed: stats.totalCellsRevealed || 0,
        gameRestarts: stats.totalGameRestarts || 0,
        abandonedGames: stats.gamesAbandoned || 0,
        restartedGames: stats.gamesRestarted || 0,
        totalFlagsUsed: stats.totalFlagsPlaced || 0,
        recentGames
      };
      
      console.log('Transformed stats:', transformedStats);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(transformedStats)
      };
    }
    
    console.log('No stats found for user:', userId);
    
    // If no stats exist yet, return empty stats
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        userId,
        userName: userId,
        userImage: null,
        totalGames: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        bombsExploded: 0,
        noFlagWins: 0,
        timePlayed: 0,
        averageGameTime: 0,
        totalCellsRevealed: 0,
        gameRestarts: 0,
        abandonedGames: 0,
        restartedGames: 0,
        totalFlagsUsed: 0,
        averageWinTime: 0,
        fastestWin: null,
        recentGames: await getRecentGames(userId, 5)
      })
    };
  } catch (error) {
    console.error(`Error in getUserStats for ${userId}:`, error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        message: 'Error fetching user stats',
        error: error instanceof Error ? error.message : String(error)
      })
    };
  }
}

/**
 * Get recent games for a user
 */
async function getRecentGames(userId: string, limit?: number): Promise<any[]> {
  try {
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
      },
      ScanIndexForward: false, // Sort by timestamp descending (newest first)
      ...(limit ? { Limit: limit } : {}) // Only include Limit if a value is provided
    };
    
    const result = await dynamoDB.send(new QueryCommand(params));
    
    return (result.Items || []).map((item: any) => ({
      ...item,
      userId: item.rawUserId || (item.userId.startsWith('USER#') ? item.userId.substring(5) : item.userId),
    }));
  } catch (error) {
    console.error(`Error fetching recent games for user ${userId}:`, error);
    return [];
  }
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

/**
 * Update or create the aggregated stats for a user
 */
interface UpdateStatsParams {
  userId: string;
  userName: string;
  userImage: string | null;
  status: string;
  timePlayed: number;
  cellsRevealed: number;
  usedFlags: number;
  bombsExploded: number;
  noFlagWin: boolean;
  gameTime: number;
  gameRestarts: number;
}

async function updateUserStats(params: UpdateStatsParams): Promise<void> {
  const {
    userId,
    userName,
    userImage,
    status,
    timePlayed,
    cellsRevealed,
    usedFlags,
    bombsExploded,
    noFlagWin,
    gameTime,
    gameRestarts
  } = params;
  
  console.log('Starting updateUserStats with params:', params);
  
  // Get all games for this user (no limit)
  const allGames = await getRecentGames(userId, undefined); // Remove limit to get all games
  
  // Count games by status
  const gameCounts = allGames.reduce((acc: any, game: any) => {
    const gameStatus = game.status;
    acc[gameStatus] = (acc[gameStatus] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate totals from all games
  const totalTimePlayed = allGames.reduce((sum, game) => sum + (typeof game.timePlayed === 'number' ? game.timePlayed : 0), 0);
  const totalCellsRevealed = allGames.reduce((sum, game) => sum + (typeof game.cellsRevealed === 'number' ? game.cellsRevealed : 0), 0);
  const totalFlagsUsed = allGames.reduce((sum, game) => sum + (typeof game.usedFlags === 'number' ? game.usedFlags : 0), 0);
  const totalBombsExploded = allGames.reduce((sum, game) => sum + (typeof game.bombsExploded === 'number' ? game.bombsExploded : 0), 0);
  const totalGameRestarts = allGames.reduce((sum, game) => sum + (typeof game.gameRestarts === 'number' ? game.gameRestarts : 0), 0);
  const noFlagWins = allGames.filter(game => game.status === 'success' && game.noFlagWin === true).length;
  
  // Find fastest win time
  const winGames = allGames.filter(game => game.status === 'success' && typeof game.time === 'number' && game.time > 0);
  const fastestWin = winGames.length > 0 ? Math.min(...winGames.map(game => game.time)) : null;
  const totalWinTime = winGames.reduce((sum, game) => sum + (game.time || 0), 0);
  
  const statPK = `STAT#${userId}`;
  const statSK = 'STAT';
  
  // Calculate TTL (1 year)
  const ttl = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
  
  // Create or update stats
  const newStats = {
    userId: statPK,
    timestamp: statSK,
    rawUserId: userId,
    userName: userName || userId,
    userImage: userImage || null,
    gamesPlayed: allGames.length,
    gamesWon: gameCounts['success'] || 0,
    gamesLost: gameCounts['defeat'] || 0,
    gamesAbandoned: gameCounts['abandoned'] || 0,
    gamesRestarted: gameCounts['restarted'] || 0,
    totalTimePlayed,
    totalCellsRevealed,
    totalFlagsPlaced: totalFlagsUsed,
    totalBombsExploded,
    totalGameRestarts,
    noFlagWins,
    totalWinTime,
    fastestWin,
    lastUpdated: new Date().toISOString(),
    ttl
  };
  
  console.log('Updating stats with:', newStats);
  
  await dynamoDB.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: newStats
  }));
  
  // Verify the update
  const updatedStats = await dynamoDB.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      userId: statPK,
      timestamp: statSK
    }
  }));
  
  console.log('Updated stats:', updatedStats.Item);
} 