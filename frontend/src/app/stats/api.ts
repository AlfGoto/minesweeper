import { cacheKey } from "@/utils/cache";
import { LeaderboardEntry, UserStats } from "./types";

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/leaderboard?limit=10&${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function fetchUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/stats/${userId}?${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching stats for user ${userId}:`, error);
    return null;
  }
}

export async function fetchUserLeaderboardContext(userId: string): Promise<LeaderboardEntry[]> {
  try {
    // Add cache-busting parameter to ensure fresh data every time
    const response = await fetch(`${process.env.API_URL}/leaderboard/context/${userId}?${cacheKey()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return []; // Return empty if endpoint doesn't exist yet
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching leaderboard context for user ${userId}:`, error);
    return [];
  }
}

export async function fetchUserBestGames(userId: string): Promise<any[]> {
  try {
    // Use the dedicated bestgames endpoint
    const apiUrl = `${process.env.API_URL}/bestgames/${userId}?limit=5&${cacheKey()}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return [];
    }

    const games = await response.json();
    return games;
  } catch (error) {
    console.error(`Error fetching best games for user ${userId}:`, error);
    return [];
  }
}