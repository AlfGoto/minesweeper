import Grid from "@/features/homepage/components/grid";
import { GameProvider } from "./game-provider";
import Menu from "./components/menu";
import LoseDialog from "./components/lose-dialog";
import WinDialog from "./components/win-dialog";
import { getServerSession } from "next-auth";
import { getUser } from "@/types/bff/uncached-functions";
import type { CellSkin } from "@/types/bff";

export default async function Home() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const user = userEmail ? await getUser(userEmail) : null;
  const selectedCellSkin: CellSkin = user?.selectedSkin?.cells ?? "default";

  return (
    <GameProvider>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="sr-only">
          <h1>Play Minesweeper Online - Free Classic Puzzle Game</h1>
          <h2>How to Play Minesweeper</h2>
          <p>
            Left-click to reveal a cell. Numbers show how many mines touch that
            cell. Right-click to flag suspected mines. Clear all safe cells to
            win.
          </p>
          <h2>Game Features</h2>
          <h3>Multiple Difficulty Levels</h3>
          <p>
            Choose from Beginner, Intermediate, or Expert grids. Each level
            increases the board size and mine count.
          </p>
          <h3>Custom Skins and Themes</h3>
          <p>
            Unlock unique visual themes by playing. Customize cells and
            backgrounds to personalize your game.
          </p>
          <h3>Global Leaderboard</h3>
          <p>
            Compete with players worldwide. Track your best times and climb the
            rankings.
          </p>
          <h2>Game Controls</h2>
          <p>
            On desktop: left-click reveals, right-click flags. On mobile: tap
            reveals, long-press flags.
          </p>
        </div>
        <div className="flex items-center justify-center w-full gap-4">
          <Grid selectedCellSkin={selectedCellSkin} />
          <Menu />
          <LoseDialog />
          <WinDialog />
        </div>
      </div>
    </GameProvider>
  );
}
