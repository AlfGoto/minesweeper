import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { CellSkin } from "@/types/bff";
import { getCellSkinsPrices } from "@/lib/api";
import { getUser, getUserStatsUncached } from "@/types/bff/uncached-functions";
import { Button } from "@/components/ui/button";
import { CellSkinsShop } from "./components/tabs";
import { BackgroundsTab } from "./components/backgrounds-tab";

export async function SkinsPage() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/");
  }

  const [user, prices, stats] = await Promise.all([
    getUser(userEmail),
    getCellSkinsPrices(),
    getUserStatsUncached(userEmail),
  ]);

  const unlockedSkins: CellSkin[] = user?.unlockedSkins?.cells ?? [];
  const selectedSkin: CellSkin = user?.selectedSkin?.cells ?? "default";

  return (
    <main className="mx-auto w-full max-w-4xl p-4 md:p-8 flex flex-col gap-4">
      <div className="flex justify-end">
        <Link href="/" prefetch>
          <Button>Back to game</Button>
        </Link>
      </div>
      <div className="flex-1">
        <CellSkinsShop
          coins={user?.coins ?? 0}
          revealedCells={stats?.totalRevealed ?? 0}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          prices={prices}
          backgroundsTabContent={<BackgroundsTab />}
        />
      </div>
    </main>
  );
}
