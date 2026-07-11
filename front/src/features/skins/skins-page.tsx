import { getServerSession } from "next-auth";
import { Link } from "@/i18n/navigation";
import type { CellSkin } from "@/types/bff";
import { getCellSkinsPrices } from "@/lib/api";
import { getUser, getUserStatsUncached } from "@/types/bff/uncached-functions";
import { Button } from "@/components/ui/button";
import { CellSkinsShop } from "./components/tabs";
import { BackgroundsTab } from "./components/backgrounds-tab";
import { getTranslations } from "next-intl/server";

type SkinsPageProps = {
  locale?: string;
};

export async function SkinsPage({ locale = "en" }: SkinsPageProps) {
  const session = await getServerSession();
  const userEmail = session?.user?.email;
  const isLoggedIn = !!userEmail;
  const t = await getTranslations("skinsPage");

  const [user, prices, stats] = await Promise.all([
    userEmail ? getUser(userEmail) : null,
    getCellSkinsPrices(),
    userEmail ? getUserStatsUncached(userEmail) : null,
  ]);

  const unlockedSkins: CellSkin[] = user?.unlockedSkins?.cells ?? [];
  const selectedSkin: CellSkin = user?.selectedSkin?.cells ?? "default";

  return (
    <main className="mx-auto w-full max-w-4xl p-4 md:p-8 flex flex-col gap-4">
      <div className="flex justify-end">
        <Link href="/" prefetch>
          <Button>{t("backToGame")}</Button>
        </Link>
      </div>
      <div className="flex-1">
        <CellSkinsShop
          isLoggedIn={isLoggedIn}
          coins={user?.coins ?? 0}
          revealedCells={stats?.totalRevealed ?? 0}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          prices={prices}
          locale={locale}
          backgroundsTabContent={<BackgroundsTab isLoggedIn={isLoggedIn} />}
        />
      </div>
    </main>
  );
}
