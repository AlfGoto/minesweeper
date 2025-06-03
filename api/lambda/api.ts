import { GameEntity } from "../ddb/game.entity";
import { UserStatsEntity } from "../ddb/stats.entity";
import { Table } from "../ddb/table";
import {
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} from "dynamodb-toolbox";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/aws-lambda";
import { BestEntity } from "../ddb/best.entity";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle OPTIONS requests for CORS preflight
app.options("*", (c) => {
  return c.json({ message: "CORS enabled" }, 200);
});

// Routes matching original API structure
app.get("/leaderboard/context/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userTime = c.req.query("userTime");
    const result = await getUserLeaderboardContext({ userId, userTime });
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in leaderboard context:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/leaderboard", async (c) => {
  try {
    const limit = c.req.query("limit");
    const result = await getLeaderboard({ limit });
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in leaderboard:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/stats/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const result = await getUserStats({ userId });
    console.log("result", result);
    console.log("result", result);
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in user stats:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/bestgames/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const limit = c.req.query("limit")
      ? parseInt(c.req.query("limit") || "5")
      : 5;
    const result = await getUserBestGames({ userId, limit });
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in best games:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/games", async (c) => {
  try {
    const userId = c.req.query("userId");
    const limit = c.req.query("limit");
    const result = await getGames({ userId, limit });
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in get games:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.post("/games", async (c) => {
  try {
    const body = await c.req.json();
    const result = await saveGame(body);
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in save game:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.get("/recent-games", async (c) => {
  try {
    const limit = c.req.query("limit");
    const result = await getRecentGames({ limit });
    return c.json(result, 200);
  } catch (error) {
    console.error("Error in recent games:", error);
    return c.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

app.all("*", (c) => {
  return c.json({ message: "Endpoint not found" }, 404);
});

export const handler = handle(app);

async function saveGame(gameData: any) {
  console.log("Received game data:", JSON.stringify(gameData, null, 2));

  if (!gameData) {
    console.error("No game data provided");
    throw new Error("Request body is required");
  }

  // Create timestamp for the game
  const timestamp = new Date().toISOString();

  // Handle the different payload structures - websocket sends userId, but we need rawUserId
  const rawUserId = gameData.rawUserId || gameData.userId;

  console.log("Extracted rawUserId (email):", rawUserId);

  if (!rawUserId) {
    console.error("No userId or rawUserId found in payload");
    throw new Error("userId or rawUserId is required");
  }

  // Validate email format
  if (!rawUserId.includes("@")) {
    console.warn("UserId does not appear to be a valid email:", rawUserId);
  }

  try {
    // Prepare the game item with proper field mapping
    const gameItem = {
      userId: `USER#${rawUserId}`,
      timestamp: `DATE#${timestamp}`,
      bombsExploded: gameData.bombsExploded || 0,
      cellsRevealed: gameData.cellsRevealed || 0,
      date: gameData.date || timestamp,
      gameRestarts: gameData.gameRestarts || 0,
      lastUpdated: timestamp,
      noFlagWin: gameData.noFlagWin || false,
      rawUserId: rawUserId,
      time: gameData.time || gameData.successTime || 0, // Handle both time and successTime
      timePlayed: gameData.timePlayed || 0,
      usedFlags: gameData.usedFlags || 0,
      userName: gameData.userName || "",
      userImage: gameData.userImage || null,
      status: gameData.status || "completed", // Include status from websocket
      ttl: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60, // 90 days from now
    };

    // Save game using DynamoDB Toolbox
    await GameEntity.build(PutItemCommand).item(gameItem).send();

    // Update user stats - pass the raw user data with proper mapping
    const statsData = {
      ...gameData,
      rawUserId: rawUserId,
      time: gameItem.time,
    };
    console.log(
      "Updating user stats with:",
      JSON.stringify(statsData, null, 2)
    );
    await updateUserStats(statsData);
    console.log("User stats updated successfully");

    const { Item: bestGameItem } = await BestEntity.build(GetItemCommand)
      .key({
        userId: "BEST",
        timestamp: "BEST#" + rawUserId,
      })
      .send();

    if (
      bestGameItem &&
      bestGameItem.time &&
      bestGameItem.time > gameItem.time
    ) {
      await BestEntity.build(PutItemCommand)
        .item({
          ...bestGameItem,
          userId: "BEST",
          timestamp: "BEST#" + rawUserId,
          time: gameItem.time,
        })
        .send();
    }
    if (!bestGameItem) {
      await BestEntity.build(PutItemCommand)
        .item({
          ...gameItem,
          userId: "BEST",
          timestamp: "BEST#" + rawUserId,
        })
        .send();
    }

    return {
      message: "Game saved successfully",
      game: gameItem,
    };
  } catch (error) {
    console.error("Error saving game:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", error);
    }
    throw new Error("Error saving game");
  }
}

async function getGames(queryParams: any) {
  const { userId, limit = 50 } = queryParams || {};

  if (!userId) {
    throw new Error("userId is required");
  }

  // Query games for the user using DynamoDB Toolbox
  const response = await Table.build(QueryCommand)
    .query({ partition: `USER#${userId}` })
    .options({
      limit: parseInt(limit),
      reverse: true, // Most recent first
    })
    .send();

  return response.Items || [];
}

async function getLeaderboard(queryParams: any) {
  const { limit = 10 } = queryParams || {};

  // Query the GSI for leaderboard data using fastest time
  const response = await Table.build(QueryCommand)
    .query({
      partition: "BEST",
    })
    .options({
      limit: parseInt(limit),
      reverse: false,
    })
    .send();

  return response.Items || [];
}

async function getUserLeaderboardContext(queryParams: any) {
  const { userId, userTime } = queryParams || {};

  if (!userId || !userTime) {
    throw new Error("userId and userTime are required");
  }

  const time = parseInt(userTime);

  // Get faster times (better scores)
  const fasterResponse = await Table.build(QueryCommand)
    .query({
      index: "status-time-index",
      partition: "COMPLETED",
    })
    .options({
      limit: 5,
      reverse: false,
      filter: { attr: "time", lt: time },
    })
    .send();

  // Get slower times (worse scores)
  const slowerResponse = await Table.build(QueryCommand)
    .query({
      index: "status-time-index",
      partition: "COMPLETED",
    })
    .options({
      limit: 5,
      reverse: true,
      filter: { attr: "time", gt: time },
    })
    .send();

  return {
    faster: fasterResponse.Items || [],
    slower: slowerResponse.Items || [],
  };
}

async function getUserStats(queryParams: any) {
  const { userId } = queryParams || {};

  console.log("getUserStats called with userId (email):", userId);

  if (!userId) {
    console.error("No userId provided to getUserStats");
    throw new Error("User ID is required");
  }
  if (!userId.includes("@")) {
    console.warn("UserId does not appear to be a valid email:", userId);
  }

  try {
    console.log("Querying user stats for:", `STAT#${userId}`);

    // Get user stats using DynamoDB Toolbox
    const statsResponse = await UserStatsEntity.build(GetItemCommand)
      .key({
        userId: `STAT#${userId}`,
        timestamp: "STAT",
      })
      .send();

    // Get recent games for this user
    const recentGamesResponse = await Table.build(QueryCommand)
      .query({ partition: `USER#${userId}` })
      .options({
        limit: 10,
        reverse: true, // Most recent first
      })
      .send();

    console.log("Recent games found:", recentGamesResponse.Items?.length || 0);
    if (recentGamesResponse.Items?.length === 0) {
      console.log("No recent games found for user:", userId);
    }

    // Ensure recentGames is always an array
    const recentGames = recentGamesResponse.Items || [];

    if (!statsResponse.Item) {
      console.log("No existing stats found, returning defaults");
      // Return default stats if none exist
      const defaultStats = {
        userId: `STAT#${userId}`,
        timestamp: "STAT",
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesAbandoned: 0,
        fastestWin: undefined,
        recentGames: recentGames, // Always an array
      };

      return defaultStats;
    }

    // Add recent games to the existing stats, ensuring recentGames is always an array
    const statsWithRecentGames = {
      ...statsResponse.Item,
      totalGames: statsResponse.Item.gamesPlayed,
      wins: statsResponse.Item.gamesWon,
      losses: statsResponse.Item.gamesLost,
      bombsExploded: statsResponse.Item.totalBombsExploded,
      cellsRevealed: statsResponse.Item.totalCellsRevealed,
      gameRestarts: statsResponse.Item.totalGameRestarts,
      usedFlags: statsResponse.Item.totalFlagsPlaced,
      averageGameTime:
        (statsResponse.Item.totalTimePlayed || 0) /
        (statsResponse.Item.gamesPlayed || 1),
      recentGames: recentGames,
      winRate: Math.round(
        ((statsResponse.Item.gamesWon || 0) /
          (statsResponse.Item.gamesPlayed || 1)) *
          100
      ),
      averageWinTime:
        (statsResponse.Item.totalWinTime || 0) /
        (statsResponse.Item.gamesWon || 1),
      timePlayed: statsResponse.Item.totalTimePlayed,
      noFlagWins: statsResponse.Item.noFlagWins,
      totalFlagsUsed: statsResponse.Item.totalFlagsPlaced,
      totalCellsRevealed: statsResponse.Item.totalCellsRevealed,
      restartedGames: statsResponse.Item.gamesRestarted,
    };

    return statsWithRecentGames;
  } catch (error) {
    console.error("Error in getUserStats:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", error);
    }
    throw new Error("Error fetching user stats");
  }
}

async function getRecentGames(queryParams: any) {
  const { limit = 10, userId } = queryParams || {};

  // Get recent games from all users using scan on the table
  const response = await Table.build(QueryCommand)
    .query({ partition: `USER#${userId}` })
    .options({
      limit: parseInt(limit),
      filter: { attr: "userId", exists: true },
    })
    .send();

  // Sort by timestamp in application since scan doesn't guarantee order
  const sortedGames = (response.Items || []).sort(
    (a: any, b: any) =>
      new Date(b.lastUpdated || b.timestamp).getTime() -
      new Date(a.lastUpdated || a.timestamp).getTime()
  );

  return sortedGames;
}

async function getUserBestGames(queryParams: any) {
  const { userId, limit = 5 } = queryParams || {};

  if (!userId) {
    throw new Error("User ID is required");
  }

  // Query user's games and filter for best times in application
  const response = await Table.build(QueryCommand)
    .query({ partition: `USER#${userId}` })
    .options({
      limit: 100, // Get more to find best times
      reverse: true,
    })
    .send();

  // Filter and sort by time in application
  const completedGames = (response.Items || []).filter(
    (game: any) => game.time && game.time > 0
  );

  const bestGames = completedGames
    .sort((a: any, b: any) => a.time - b.time)
    .slice(0, parseInt(limit));

  return bestGames;
}

async function updateUserStats(gameData: any): Promise<void> {
  const userId = `STAT#${gameData.rawUserId}`;
  const timestamp = "STAT";

  console.log("Updating user stats for email:", gameData.rawUserId);

  try {
    const existingStats = await UserStatsEntity.build(GetItemCommand)
      .key({ userId, timestamp })
      .send();

    console.log("Existing stats found:", existingStats.Item ? "Yes" : "No");

    let currentStats = existingStats.Item || {
      userId,
      timestamp,
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesAbandoned: 0,
      gamesRestarted: 0,
      noFlagWins: 0,
      fastestWin: undefined,
      totalBombsExploded: 0,
      totalCellsRevealed: 0,
      totalFlagsPlaced: 0,
      totalGameRestarts: 0,
      totalTimePlayed: 0,
      totalWinTime: 0,
      status: "ACTIVE",
      time: gameData.time,
      ttl: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
    };

    console.log(
      "Current stats before update:",
      JSON.stringify(currentStats, null, 2)
    );

    currentStats.gamesPlayed = (currentStats.gamesPlayed || 0) + 1;
    currentStats.totalBombsExploded =
      (currentStats.totalBombsExploded || 0) + (gameData.bombsExploded || 0);
    currentStats.totalCellsRevealed =
      (currentStats.totalCellsRevealed || 0) + (gameData.cellsRevealed || 0);
    currentStats.totalGameRestarts =
      (currentStats.totalGameRestarts || 0) + (gameData.gameRestarts || 0);
    currentStats.totalTimePlayed =
      (currentStats.totalTimePlayed || 0) + (gameData.timePlayed || 0);
    currentStats.totalFlagsPlaced =
      (currentStats.totalFlagsPlaced || 0) + (gameData.usedFlags || 0);

    if (gameData.bombsExploded > 0) {
      currentStats.gamesLost = (currentStats.gamesLost || 0) + 1;
    } else if (gameData.time > 0) {
      currentStats.gamesWon = (currentStats.gamesWon || 0) + 1;
      currentStats.totalWinTime =
        (currentStats.totalWinTime || 0) + gameData.time;

      if (gameData.noFlagWin) {
        currentStats.noFlagWins = (currentStats.noFlagWins || 0) + 1;
      }

      if (!currentStats.fastestWin || gameData.time < currentStats.fastestWin) {
        currentStats.fastestWin = gameData.time;
      }
    }

    console.log("Updated stats:", JSON.stringify(currentStats, null, 2));

    await UserStatsEntity.build(PutItemCommand).item(currentStats).send();
    console.log("Stats updated successfully in DynamoDB");
  } catch (error) {
    console.error("Error updating user stats:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error("Unknown error type:", error);
    }
    throw error; // Re-throw to be handled by caller
  }
}
