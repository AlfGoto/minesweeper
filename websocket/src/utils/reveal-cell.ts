import { MinesweeperGame } from "../solo-game";
import { generateGrid } from "./generate-grid";
import { getNearbySquares } from "./get-nearby";
import { checkWin } from "./check-win";
import { lose } from "./lose";

export async function revealCell(game: MinesweeperGame, id: number) {
  if (game.grid.length === 0) game.grid = generateGrid(game, id);

  if (game.grid[id].value === "bomb" && game.grid[id].status !== "flagged") {
    await lose(game, id);
    return;
  }

  if (game.grid[id].status === "revealed") await revealAdjacentCells(game, id);

  if (game.grid[id].status !== "hidden") return;

  game.send({
    type: "UPDATE",
    payload: {
      type: "REVEAL",
      id: id,
      value: game.grid[id].value,
    },
  });
  game.grid[id].status = "revealed";
  game.reveals++;

  if (game.grid[id].value === 0) {
    for (const nearby of getNearbySquares(id)) {
      setTimeout(async () => {
        await revealCell(game, nearby);
      }, 40);
    }
  }

  await checkWin(game);
}

export async function revealAdjacentCells(game: MinesweeperGame, id: number) {
  const cell = game.grid[id];

  // Only work on revealed cells with numeric values (not bombs)
  if (cell.status !== "revealed" || typeof cell.value !== "number") {
    return;
  }

  const totalFlagsToMatch = cell.value;
  const nearbyCells = getNearbySquares(id);
  const nearbyFlags = nearbyCells.filter(
    (index) => game.grid[index].status === "flagged",
  ).length;

  console.log(`Cell ${id}: flags=${nearbyFlags}, need=${totalFlagsToMatch}`);

  if (nearbyFlags === totalFlagsToMatch) {
    // First check if any unflagged bomb would be revealed - that's a loss
    for (const nearbyId of nearbyCells) {
      const nearbyCell = game.grid[nearbyId];
      if (nearbyCell && nearbyCell.status === "hidden" && nearbyCell.value === "bomb") {
        await lose(game, nearbyId);
        return;
      }
    }

    // Safe to reveal all hidden cells
    for (const nearbyId of nearbyCells) {
      const nearbyCell = game.grid[nearbyId];
      if (nearbyCell && nearbyCell.status === "hidden") {
        await revealCell(game, nearbyId);
      }
    }
  }
}
