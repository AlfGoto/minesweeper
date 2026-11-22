"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { CellSkin } from "@/types/bff";
import { Separator } from "@/components/ui/separator";
import {
  CellSkins,
  getLocalizedSkinMeta,
  getPublishedSkinsWithMeta,
} from "@/features/skins/cells/skins";
import { buyCellSkinAction, selectCellSkinAction } from "@/features/skins/actions";
import { OwnedFilter } from "./owned-filter";
import { toast } from "sonner";
import { SkinCard } from "./skin-card";
import { LoginBanner } from "./login-banner";
import { CellSkinCardPreview } from "./collection-previews";

import { collectionGridClassName } from "./collection-grid";

type CellsTabProps = {
  isLoggedIn?: boolean;
  coins: number;
  selectedSkin: CellSkin;
  unlockedSkins: CellSkin[];
  prices: Partial<Record<CellSkin, number>>;
  locale?: string;
};

function formatSkinLabel(skin: CellSkin, locale: string = "en", defaultLabel: string = "Default") {
  const definition = CellSkins[skin];
  if (definition) {
    const localized = getLocalizedSkinMeta(definition, locale);
    if (localized.name) return localized.name;
  }
  if (skin === "default") return defaultLabel;
  return skin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CellsTab({
  isLoggedIn = true,
  coins,
  selectedSkin,
  unlockedSkins,
  prices,
  locale = "en",
}: CellsTabProps) {
  const router = useRouter();
  const t = useTranslations("skinsPage");
  const [isPending, startTransition] = useTransition();
  const [optimisticSelectedSkin, setOptimisticSelectedSkin] =
    useState<CellSkin>(selectedSkin);
  const [groupOwned, setGroupOwned] = useState(true);

  useEffect(() => {
    setOptimisticSelectedSkin(selectedSkin);
  }, [selectedSkin]);

  const allCellSkins = useMemo(
    () => Object.keys(CellSkins) as CellSkin[],
    [],
  );

  // Only published skins have an SEO page to link to.
  const slugBySkin = useMemo(
    () => new Map(getPublishedSkinsWithMeta().map((skin) => [skin.id, skin.slug])),
    [],
  );

  const normalizedUnlockedSkins = useMemo(() => {
    const skins = new Set<CellSkin>(["default", ...unlockedSkins]);
    return allCellSkins.filter((skin) => skins.has(skin));
  }, [allCellSkins, unlockedSkins]);

  const groupedSkins = useMemo(() => {
    const unlockedSet = new Set<CellSkin>(normalizedUnlockedSkins);
    const owned = allCellSkins.filter((skin) => unlockedSet.has(skin));
    const notOwned = allCellSkins.filter((skin) => !unlockedSet.has(skin));

    return { owned, notOwned };
  }, [allCellSkins, normalizedUnlockedSkins]);

  const onBuy = (skin: CellSkin) => {
    startTransition(async () => {
      const result = await buyCellSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || t("skinBought"));
        router.refresh();
      } else {
        toast.error(result.message || t("couldNotBuy"));
      }
    });
  };

  const onSelect = (skin: CellSkin) => {
    const previousSkin = optimisticSelectedSkin;
    setOptimisticSelectedSkin(skin);

    startTransition(async () => {
      const result = await selectCellSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || t("skinSelected"));
        router.refresh();
      } else {
        setOptimisticSelectedSkin(previousSkin);
        toast.error(result.message || t("couldNotSelect"));
      }
    });
  };

  const renderSkinCard = (skin: CellSkin) => {
    const isOwned = isLoggedIn && normalizedUnlockedSkins.includes(skin);
    const isSelected = isOwned && skin === optimisticSelectedSkin;
    const price = prices[skin];
    const canBuy = isLoggedIn && typeof price === "number" && coins >= price;
    const slug = slugBySkin.get(skin);
    // The unrevealed colour of the skin fills the preview area.
    const hiddenColor = CellSkins[skin]?.ogColors?.hidden;

    return (
      <SkinCard
        key={skin}
        name={formatSkinLabel(skin, locale, t("default"))}
        href={slug && `/skins/${slug}`}
        preview={
          <div
            className="flex justify-center rounded-xl py-6"
            style={{ backgroundColor: hiddenColor }}
          >
            <CellSkinCardPreview skin={skin} />
          </div>
        }
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
        <div className={collectionGridClassName}>{allCellSkins.map(renderSkinCard)}</div>
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
