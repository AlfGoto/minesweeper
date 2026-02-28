import { MinesweeperGame } from "../solo-game";

export function flagCell(game: MinesweeperGame, id: number) {
  if (game.grid[id].status === "flagged") {
    game.grid[id].status = "hidden";

    game.send({
      type: "UPDATE",
      payload: {
        type: "FLAG",
        id: id,
        flagged: false,
      },
    });
  } else if (game.grid[id].status === "hidden") {
    game.grid[id].status = "flagged";
    game.flags++;
    game.send({
      type: "UPDATE",
      payload: {
        type: "FLAG",
        id: id,
        flagged: true,
      },
    });
  }
}
