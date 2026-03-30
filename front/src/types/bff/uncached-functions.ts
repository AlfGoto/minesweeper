import createClient from "openapi-fetch";
import type { paths } from "./api";
import type { CellSkin } from "@/types/bff";

const uncachedClient = createClient<paths>({
  baseUrl: process.env.BFF_URL,
  fetch: (request) => fetch(request, { cache: "no-store" }),
});

export const getUser = async (userEmail: string) => {
  const user = await uncachedClient.GET("/skins/user/{userEmail}", {
    params: {
      path: { userEmail },
    },
  });
  return user.data;
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
