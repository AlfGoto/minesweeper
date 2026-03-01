import createClient from "openapi-fetch";
import { paths, components } from "./api";

export type Game = components["schemas"]["Game"];
export type BestGame = components["schemas"]["BestGame"];
export type Stats = components["schemas"]["Stats"];
export type StatsAll = components["schemas"]["StatsAll"];
export type User = components["schemas"]["User"];
export type UserStats = components["schemas"]["UserStats"];
export type UserGame = components["schemas"]["UserGame"];

export const client = createClient<paths>({
  baseUrl: process.env.BFF_URL,
});
