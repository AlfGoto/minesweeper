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
