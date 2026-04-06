import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { BackgroundSkin } from "@/types/bff";
import { getBackgroundSkinsPrices } from "@/lib/api";
import { getUser, getUserStatsUncached } from "@/types/bff/uncached-functions";
import { BackgroundSkinsShop } from "./skins-shop";

export async function BackgroundsTab() {
  const session = await getServerSession();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    redirect("/");
  }

  const [user, prices, stats] = await Promise.all([
    getUser(userEmail),
    getBackgroundSkinsPrices(),
    getUserStatsUncached(userEmail),
  ]);

  const unlockedSkins: BackgroundSkin[] = user?.unlockedSkins?.background ?? [];
  const selectedSkin: BackgroundSkin =
    user?.selectedSkin?.background ?? "default";

  return (
    <BackgroundSkinsShop
      coins={user?.coins ?? 0}
      revealedCells={stats?.totalRevealed ?? 0}
      selectedSkin={selectedSkin}
      unlockedSkins={unlockedSkins}
      prices={prices}
    />
  );
}
