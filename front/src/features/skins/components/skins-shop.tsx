"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { BackgroundSkin } from "@/types/bff";
import { Separator } from "@/components/ui/separator";
import {
  backgroundSkins,
  getLocalizedBackgroundSkinMeta,
} from "@/features/skins/backgrounds";
import {
  buyBackgroundSkinAction,
  selectBackgroundSkinAction,
} from "@/features/skins/actions";
import { OwnedFilter } from "./owned-filter";
import { toast } from "sonner";
import { SkinCard } from "./skin-card";
import { LoginBanner } from "./login-banner";
import { BackgroundSkinCardPreview } from "./collection-previews";
import { collectionGridClassName } from "./collection-grid";

type BackgroundSkinsShopProps = {
  isLoggedIn?: boolean;
  coins: number;
  selectedSkin: BackgroundSkin;
  unlockedSkins: BackgroundSkin[];
  prices: Partial<Record<BackgroundSkin, number>>;
};

function formatSkinLabel(skin: BackgroundSkin, defaultLabel: string = "Default") {
  if (skin === "default") return defaultLabel;
  return skin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BackgroundSkinsShop({
  isLoggedIn = true,
  coins,
  selectedSkin,
  unlockedSkins,
  prices,
}: BackgroundSkinsShopProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("skinsPage");
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedSkin, setOptimisticSelectedSkin] =
    useState<BackgroundSkin>(selectedSkin);
  const [groupOwned, setGroupOwned] = useState(true);

  useEffect(() => {
    setOptimisticSelectedSkin(selectedSkin);
  }, [selectedSkin]);

  const allBackgroundSkins = useMemo(
    () => Object.keys(backgroundSkins) as BackgroundSkin[],
    [],
  );

  const normalizedUnlockedSkins = useMemo(() => {
    const skins = new Set<BackgroundSkin>(["default", ...unlockedSkins]);
    return allBackgroundSkins.filter((skin) => skins.has(skin));
  }, [allBackgroundSkins, unlockedSkins]);

  const groupedSkins = useMemo(() => {
    const unlockedSet = new Set<BackgroundSkin>(normalizedUnlockedSkins);
    const owned = allBackgroundSkins.filter((skin) => unlockedSet.has(skin));
    const notOwned = allBackgroundSkins.filter((skin) => !unlockedSet.has(skin));

    return { owned, notOwned };
  }, [allBackgroundSkins, normalizedUnlockedSkins]);

  const onBuy = (skin: BackgroundSkin) => {
    startTransition(async () => {
      const result = await buyBackgroundSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || t("skinBought"));
        router.refresh();
      } else {
        toast.error(result.message || t("couldNotBuy"));
      }
    });
  };

  const onSelect = (skin: BackgroundSkin) => {
    const previousSkin = optimisticSelectedSkin;
    setOptimisticSelectedSkin(skin);

    startTransition(async () => {
      const result = await selectBackgroundSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || t("skinSelected"));
        router.refresh();
      } else {
        setOptimisticSelectedSkin(previousSkin);
        toast.error(result.message || t("couldNotSelect"));
      }
    });
  };

  const renderSkinCard = (skin: BackgroundSkin) => {
    const skinData = backgroundSkins[skin];
    const skinLabel =
      getLocalizedBackgroundSkinMeta(skinData, locale).name || formatSkinLabel(skin, t("default"));
    const isOwned = isLoggedIn && normalizedUnlockedSkins.includes(skin);
    const isSelected = isOwned && skin === optimisticSelectedSkin;
    const price = prices[skin];
    const canBuy = isLoggedIn && typeof price === "number" && coins >= price;

    return (
      <SkinCard
        key={skin}
        name={skinLabel}
        href={skinData.slug && `/skins/background/${skinData.slug}`}
        preview={<BackgroundSkinCardPreview skin={skinData} />}
        isLoggedIn={isLoggedIn}
        isDefault={skin === "default"}
        isOwned={isOwned}
        isSelected={isSelected}
        price={price}
        canBuy={canBuy}
        isPending={isPending}
        onSelect={() => onSelect(skin)}
        onBuy={() => onBuy(skin)}
      />
    );
  };

  return (
    <div className="space-y-4">
      {!isLoggedIn && <LoginBanner />}

      {isLoggedIn && (
        <div className="flex items-center justify-end">
          <OwnedFilter value={groupOwned} onValueChange={setGroupOwned} label={t("owned")} />
        </div>
      )}

      {!isLoggedIn || !groupOwned ? (
        <div className={collectionGridClassName}>
          {allBackgroundSkins.map(renderSkinCard)}
        </div>
      ) : (
        <>
          <div className={collectionGridClassName}>
            {groupedSkins.owned.map(renderSkinCard)}
          </div>
          {groupedSkins.owned.length > 0 && groupedSkins.notOwned.length > 0 ? (
            <Separator className="my-6" />
          ) : null}
          <div className={collectionGridClassName}>
            {groupedSkins.notOwned.map(renderSkinCard)}
          </div>
        </>
      )}
    </div>
  );
}
