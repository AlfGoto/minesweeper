import { Entity, item, string, number } from "dynamodb-toolbox";
import { Table } from "./table";

export const UserStatsEntity = new Entity({
  name: "UserStats",
  schema: item({
    userId: string().key(), // Direct table PK
    timestamp: string().key(), // Direct table SK

    // Entity attributes
    fastestWin: number().optional(),
    gamesAbandoned: number().optional(),
    gamesLost: number().optional(),
    gamesPlayed: number().optional(),
    gamesRestarted: number().optional(),
    gamesWon: number().optional(),
    noFlagWins: number().optional(),

    totalBombsExploded: number().optional(),
    totalCellsRevealed: number().optional(),
    totalFlagsPlaced: number().optional(),
    totalGameRestarts: number().optional(),
    totalTimePlayed: number().optional(),
    totalWinTime: number().optional(),

    userName: string().optional(),
    userImage: string().optional(),

    // GSI attributes for status-time-index
    status: string().optional(), // For GSI partition key
    time: number().optional(), // For GSI sort key
  }),
  timestamps: {
    created: false,
    modified: false,
  },

  table: Table,
});
