import { components } from "./types";

export type Game = components["schemas"]["Game"];

export const createGame = async (game: Game, apiUrl: string) => {
  const response = await fetch(`${apiUrl}/games`, {
    method: "POST",
    body: JSON.stringify(game),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
