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
