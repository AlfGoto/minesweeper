import { Entity, item, string, number, boolean } from "dynamodb-toolbox";
import { Table } from "./table";

export const GameEntity = new Entity({
  name: "Game",
  schema: item({
    userId: string().key(), // Direct table PK
    timestamp: string().key(), // Direct table SK

    bombsExploded: number().optional(),
    cellsRevealed: number().optional(),
    date: string().optional(),
    gameRestarts: number().optional(),
    lastUpdated: string().optional(),
    noFlagWin: boolean().optional(),
    rawUserId: string().optional(),
    time: number().optional(),
    timePlayed: number().optional(),
    usedFlags: number().optional(),
    status: string().optional(),

    userName: string().optional(),
    userImage: string().optional(),
  }),
  timestamps: {
    created: false,
    modified: false,
  },
  table: Table,
});
