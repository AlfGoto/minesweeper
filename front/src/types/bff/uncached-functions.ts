import createClient from "openapi-fetch";
import type { paths } from "./api";
import type { CellSkin } from "@/types/bff";
import type { components } from "./api";

const uncachedClient = createClient<paths>({
  baseUrl: process.env.BFF_URL,
  fetch: (request) => fetch(request, { cache: "no-store" }),
});

type UserSkins = components["schemas"]["UserSkins"];
type UserStats = components["schemas"]["Stats"];
type UnknownRecord = Record<string, unknown>;

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function extractUserSkinsCandidate(payload: unknown): UnknownRecord | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as UnknownRecord;

  if ("userId" in record || "unlockedSkins" in record || "selectedSkin" in record) {
    return record;
  }

  if (record.user && typeof record.user === "object") {
    return record.user as UnknownRecord;
  }

  if (record.data && typeof record.data === "object") {
    return record.data as UnknownRecord;
  }

  return null;
}

function normalizeUserSkins(payload: unknown): UserSkins | null {
  const userCandidate = extractUserSkinsCandidate(payload);
  if (!userCandidate) return null;

  const userWithAlternateCoins = userCandidate as UserSkins & {
    alfCoins?: unknown;
  };
  const normalizedCoins =
    toNumber(userWithAlternateCoins.coins) ??
    toNumber(userWithAlternateCoins.alfCoins) ??
    0;

  return {
    ...userWithAlternateCoins,
    coins: normalizedCoins,
  } as UserSkins;
}

export const getUser = async (userEmail: string) => {
  const response = await uncachedClient.GET("/skins/user/{userEmail}", {
    params: {
      path: { userEmail },
    },
  });

  return normalizeUserSkins(response.data ?? (response.error as UnknownRecord | undefined)?.data);
};

export const getUserStatsUncached = async (
  userEmail: string,
): Promise<UserStats | null> => {
  const response = await uncachedClient.GET("/stats/user/{userEmail}", {
    params: {
      path: { userEmail },
    },
  });

  return response.data ?? null;
};

export const buyCellSkin = async (userEmail: string, skin: CellSkin) => {
  return uncachedClient.PUT("/skins/buy/{userEmail}", {
    params: {
      path: { userEmail },
    },
    body: {
      skinType: "cells",
      skin,
    },
  });
};

export const selectCellSkin = async (userEmail: string, skin: CellSkin) => {
  return uncachedClient.PUT("/skins/select/{userEmail}", {
    params: {
      path: { userEmail },
    },
    body: {
      skinType: "cells",
      skin,
    },
  });
};
