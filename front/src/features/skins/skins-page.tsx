import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { CellSkin } from "@/types/bff";
import { getCellSkinsPrices } from "@/lib/api";
import { getUser } from "@/types/bff/uncached-functions";
import { CellSkinsShop } from "./components/cell-skins-shop";

export async function SkinsPage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/");
  }

  const [user, prices] = await Promise.all([
    getUser(userEmail),
    getCellSkinsPrices(),
  ]);

  const selectedSkin: CellSkin = user?.selectedSkin?.cells ?? "default";
  const unlockedSkins: CellSkin[] = user?.unlockedSkins?.cells ?? [];

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Cell Skins</h1>
        <p className="text-muted-foreground">
          Buy new skins with your coins and pick the one you want to use in game.
        </p>
      </div>
      <CellSkinsShop
        coins={user?.coins ?? 0}
        selectedSkin={selectedSkin}
        unlockedSkins={unlockedSkins}
        prices={prices}
      />
    </main>
  );
}
