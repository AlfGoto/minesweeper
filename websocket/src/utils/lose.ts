import { createGame } from "../api";
import { MinesweeperGame } from "../solo-game";
import { SAFE_CELLS } from "../vars";

export async function lose(game: MinesweeperGame, id: number) {
  // Don't trigger lose if we've already won (all safe cells revealed)
  if (game.reveals === SAFE_CELLS) return;

  game.isLost = true;

  game.send({
    type: "UPDATE",
    payload: {
      type: "REVEAL",
      id: id,
      value: game.grid[id].value,
    },
  });

  game.send({
    type: "UPDATE",
    payload: {
      type: "LOSE",
      flags: game.flags,
      reveals: game.reveals,
      time: new Date().getTime() - game.startDate,
      grid: game.grid,
    },
  });

  if (game.userEmail) {
    await createGame({
      status: "lost",
      time: new Date().getTime() - game.startDate,
      flags: game.flags,
      revealed: game.reveals,
      date: new Date().toISOString(),
      userEmail: game.userEmail,
      userName: game.userName,
      userPicture: game.userPicture,
    }, game.apiUrl);
  }
}
