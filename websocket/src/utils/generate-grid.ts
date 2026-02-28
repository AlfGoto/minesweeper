import { NUMBER_OF_BOMBS, TOTAL_CELLS } from "../vars";
import type { Grid } from "../types";
import { getNearbySquares } from "./get-nearby";
import { MinesweeperGame } from "../solo-game";

export function generateGrid(game: MinesweeperGame, firstClickId: number): Grid {
  // Validate the first click ID
  if (firstClickId < 0 || firstClickId >= TOTAL_CELLS) {
    throw new Error(
      `Invalid cell ID: ${firstClickId}. Must be between 0 and ${
        TOTAL_CELLS - 1
      }`
    );
  }

  // Ensure there are safe squares
  if (NUMBER_OF_BOMBS >= TOTAL_CELLS) {
    throw new Error(`Too many bombs: ${NUMBER_OF_BOMBS} >= ${TOTAL_CELLS}`);
  }

  const bombsSquares: "bomb"[] = Array(NUMBER_OF_BOMBS).fill("bomb");
  const safeSquares: "safe"[] = Array(TOTAL_CELLS - NUMBER_OF_BOMBS).fill(
    "safe"
  );

  let grid: string[] = [];
  let attempts = 0;
  const maxAttempts = 1000; // Safety limit

  while (attempts < maxAttempts) {
    grid = shuffleArray([...bombsSquares, ...safeSquares].sort(() => Math.random() - 0.5));

    const nearbyBombs = getNearbySquares(firstClickId).filter(id => grid[id] === "bomb").length;
    if (nearbyBombs === 0 && grid[firstClickId] !== "bomb") {
      break;
    }

    attempts++;
  }

  if (attempts >= maxAttempts) {
    throw new Error(
      `Failed to generate safe grid after ${maxAttempts} attempts`
    );
  }

  game.startDate = new Date().getTime();

  // Fixed: use different variable name to avoid shadowing
  return grid.map((cell, cellId) => ({
    status: "hidden" as const,
    value:
      cell === "bomb"
        ? ("bomb" as const)
        : getNearbySquares(cellId).filter(
            (neighborId) => grid[neighborId] === "bomb"
          ).length,
  }));
}

function shuffleArray(array: string[]) {
  let newArray = [...array];
  for (var i = newArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
  }
  return newArray;
}