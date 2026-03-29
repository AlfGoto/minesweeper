import createClient from "openapi-fetch";
import type { paths } from "./api";

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
