import { MinesweeperGame } from "../solo-game";
import { createGame } from "../api";
import { SAFE_CELLS } from "../vars";

export async function restart(game: MinesweeperGame) {
  if (game.userEmail && !game.isLost && game.reveals !== SAFE_CELLS) {
    await createGame({
      status: "restarted",
      time: new Date().getTime() - game.startDate,
      flags: game.flags,
      revealed: game.reveals,
      date: new Date().toISOString(),
      userEmail: game.userEmail,
      userName: game.userName,
      userPicture: game.userPicture,
    }, game.apiUrl);
  }

  game.grid = [];
  game.isLost = false;
  game.flags = 0;
  game.reveals = 0;
  game.startDate = new Date().getTime();
}
