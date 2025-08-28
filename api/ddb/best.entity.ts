import {
  Entity,
  item,
  number,
  string,
  boolean,
} from 'dynamodb-toolbox';
import { Table } from './table';

export const BestEntity = new Entity({
  name: 'BestGame',
  schema: item({
    userId: string().required().key(), // Always "BEST"
    timestamp: string().required().key(), // e.g. BEST#alfgoto@gmail.com

    cellsRevealed: number().optional(),
    date: string().optional(),
    gameRestarts: number().optional(),
    noFlagWin: boolean().optional(),
    rawUserId: string().optional(),
    time: number().optional(),
    timePlayed: number().optional(),
    usedFlags: number().optional(),

    userImage: string().optional(),
    userName: string().optional(),
  }),
  timestamps: {
    created: false,
    modified: false,
  },
  table: Table,
});
