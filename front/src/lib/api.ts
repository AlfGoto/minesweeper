import { client } from "@/types/bff";

export async function getBestGames() {
  const response = await client.GET("/games/best");
  return response.data ?? [];
}

export async function getAllStats() {
  const response = await client.GET("/stats/all");
  return response.data ?? [];
}

export async function getStats(userEmail: string) {
  const response = await client.GET("/stats/user/{userEmail}", {
    params: {
      path: {
        userEmail,
      },
    },
  });
  return response.data;
}

export async function getLatestGames(userEmail: string) {
  const response = await client.GET("/games/{userEmail}", {
    params: {
      path: {
        userEmail,
      },
    },
  });
  return response.data ?? [];
}

export async function getBest10Games(userEmail: string) {
  const response = await client.GET("/games/best/{userEmail}", {
    params: {
      path: {
        userEmail,
      },
    },
  });
  return response.data ?? [];
}

export async function getUserById(userId: string) {
  try {
    console.log("[getUserById] Fetching user:", userId);
    const response = await client.GET("/users/{userId}", {
      params: {
        path: {
          userId,
        },
      },
    });
    console.log("[getUserById] Response:", response.data, response.error);
    return response.data;
  } catch (error) {
    console.error("[getUserById] Error:", error);
    return undefined;
  }
}

export async function getUserStats(userId: string) {
  try {
    console.log("[getUserStats] Fetching stats:", userId);
    const response = await client.GET("/users/{userId}/stats", {
      params: {
        path: {
          userId,
        },
      },
    });
    console.log("[getUserStats] Response:", response.data, response.error);
    return response.data;
  } catch (error) {
    console.error("[getUserStats] Error:", error);
    return undefined;
  }
}

export async function getUserLatestGames(userId: string) {
  const response = await client.GET("/users/{userId}/games/latest", {
    params: {
      path: {
        userId,
      },
    },
  });
  return response.data ?? [];
}

export async function getUserBestGames(userId: string) {
  const response = await client.GET("/users/{userId}/games/best", {
    params: {
      path: {
        userId,
      },
    },
  });
  return response.data ?? [];
}

export async function getCellSkinsPrices() {
  const response = await client.GET("/skins/cells");
  return response.data ?? {};
}
