import { MinesweeperGame } from "../solo-game";
import { SAFE_CELLS } from "../vars";
import { createGame } from "../api";

export async function checkWin(game: MinesweeperGame) {
  let time = new Date().getTime() - game.startDate;

  if (game.reveals === SAFE_CELLS && !game.isLost) {
    game.send({
      type: "UPDATE",
      payload: {
        type: "WIN",
        flags: game.flags,
        reveals: game.reveals,
        time,
      },
    });

    if (game.userEmail) {
      await createGame({
        status: "won",
        time,
        flags: game.flags,
        revealed: game.reveals,
        date: new Date().toISOString(),
        userEmail: game.userEmail,
        userName: game.userName,
        userPicture: game.userPicture,
      }, game.apiUrl);
    }
  }
}
