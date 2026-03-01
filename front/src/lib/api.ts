import { client } from "@/types/bff";

export async function getBestGames() {
  const response = await client.GET("/games/best");
  return response.data ?? [];
}

export async function getStats(userEmail: string) {
  const response = await client.GET("/stats/{userEmail}", {
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
  const response = await client.GET("/users/{userId}", {
    params: {
      path: {
        userId,
      },
    },
  });
  return response.data;
}

export async function getUserStats(userId: string) {
  const response = await client.GET("/users/{userId}/stats", {
    params: {
      path: {
        userId,
      },
    },
  });
  return response.data;
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
