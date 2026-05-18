import { getServerSession } from "next-auth";
import type { BackgroundSkin } from "@/types/bff";
import { getBackgroundSkinsPrices } from "@/lib/api";
import { getUser, getUserStatsUncached } from "@/types/bff/uncached-functions";
import { BackgroundSkinsShop } from "./skins-shop";

type BackgroundsTabProps = {
  isLoggedIn?: boolean;
};

export async function BackgroundsTab({ isLoggedIn }: BackgroundsTabProps) {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const loggedIn = isLoggedIn ?? !!userEmail;

  const [user, prices, stats] = await Promise.all([
    userEmail ? getUser(userEmail) : null,
    getBackgroundSkinsPrices(),
    userEmail ? getUserStatsUncached(userEmail) : null,
  ]);

  const unlockedSkins: BackgroundSkin[] = user?.unlockedSkins?.background ?? [];
  const selectedSkin: BackgroundSkin =
    user?.selectedSkin?.background ?? "default";

  return (
    <BackgroundSkinsShop
      isLoggedIn={loggedIn}
      coins={user?.coins ?? 0}
      revealedCells={stats?.totalRevealed ?? 0}
      selectedSkin={selectedSkin}
      unlockedSkins={unlockedSkins}
      prices={prices}
    />
  );
}
