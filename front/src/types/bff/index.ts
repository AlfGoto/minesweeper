import createClient from "openapi-fetch";
import { paths, components } from "./api";

export type Game = components["schemas"]["Game"];
export type BestGame = components["schemas"]["BestGame"];
export type Stats = components["schemas"]["Stats"];

export const client = createClient<paths>({
  baseUrl: process.env.BFF_URL,
});
