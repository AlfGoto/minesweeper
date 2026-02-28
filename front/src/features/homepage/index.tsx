import Grid from "@/features/homepage/components/grid";
import { GameProvider } from "./game-provider";
import Menu from "./components/menu";
import LoseDialog from "./components/lose-dialog";
import WinDialog from "./components/win-dialog";

export default function Home() {
  return (
    <GameProvider>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">

        <div className="flex items-center justify-center w-full gap-4">

          <Grid />
          <Menu />
          <LoseDialog />
          <WinDialog />
        </div>
      </div>
    </GameProvider>
  );
}
