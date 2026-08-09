import { NUMBER_OF_BOMBS, TOTAL_CELLS } from "../vars";
import type { Grid } from "../types";
import { getNearbySquares } from "./get-nearby";
import { MinesweeperGame } from "../solo-game";

export function generateGrid(game: MinesweeperGame, firstClickId: number): Grid {
  if (firstClickId < 0 || firstClickId >= TOTAL_CELLS) {
    throw new Error(
      `Invalid cell ID: ${firstClickId}. Must be between 0 and ${TOTAL_CELLS - 1}`
    );
  }

  if (NUMBER_OF_BOMBS >= TOTAL_CELLS) {
    throw new Error(`Too many bombs: ${NUMBER_OF_BOMBS} >= ${TOTAL_CELLS}`);
  }

  const isBomb = new Uint8Array(TOTAL_CELLS);

  const protected_ = new Set([firstClickId, ...getNearbySquares(firstClickId)]);
  const unprotected: number[] = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (!protected_.has(i)) unprotected.push(i);
  }

  for (let i = unprotected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unprotected[i], unprotected[j]] = [unprotected[j], unprotected[i]];
  }

  for (let i = 0; i < NUMBER_OF_BOMBS; i++) {
    isBomb[unprotected[i]] = 1;
  }

  game.startDate = new Date().getTime();

  const grid: Grid = [];
  for (let cellId = 0; cellId < TOTAL_CELLS; cellId++) {
    if (isBomb[cellId]) {
      grid.push({ status: "hidden", value: "bomb" });
    } else {
      let count = 0;
      for (const neighborId of getNearbySquares(cellId)) {
        if (isBomb[neighborId]) count++;
      }
      grid.push({ status: "hidden", value: count });
    }
  }

  return grid;
}