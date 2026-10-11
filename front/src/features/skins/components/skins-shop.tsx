"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { BackgroundSkin } from "@/types/bff";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  backgroundSkins,
  getLocalizedBackgroundSkinMeta,
} from "@/features/skins/backgrounds";
import { BackgroundSkinPreview } from "@/features/shared/components/background-skin-preview";
import {
  buyBackgroundSkinAction,
  selectBackgroundSkinAction,
} from "@/features/skins/actions";
import { OwnedFilter } from "./owned-filter";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { SkinName } from "./skin-name";
import { AlfCoinsProgressCard } from "./alf-coins-progress-card";

const gridClassName = "grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 gap-4";

type BackgroundSkinsShopProps = {
  isLoggedIn?: boolean;
  coins: number;
  revealedCells: number;
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
  revealedCells,
  selectedSkin,
  unlockedSkins,
  prices,
}: BackgroundSkinsShopProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("skinsPage");
  const tHome = useTranslations("homepage");
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
    const isSelected = isLoggedIn && isOwned && skin === optimisticSelectedSkin;
    const isSelectable = isLoggedIn && isOwned && !isSelected && !isPending;
    const price = prices[skin];
    const canBuy = isLoggedIn && typeof price === "number" && coins >= price;

    return (
      <div
        key={skin}
        className={`relative overflow-hidden rounded-lg border p-4 space-y-3 ${
          isSelected ? "bg-muted/70" : ""
        } ${
          isSelectable ? "cursor-pointer hover:bg-muted/40 transition-colors" : ""
        }`}
        onClick={isSelectable ? () => onSelect(skin) : undefined}
        onKeyDown={
          isSelectable
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(skin);
                }
              }
            : undefined
        }
        role={isSelectable ? "button" : undefined}
        tabIndex={isSelectable ? 0 : undefined}
      >
        {isSelected ? (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden m-0"
            aria-hidden
          >
            <div
              className={`absolute inset-0 ${skinData.value}`}
              style={skinData.style}
            />
            <div className="absolute inset-0 bg-background/60" />
          </div>
        ) : null}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <SkinName href={skinData.slug && `/skins/background/${skinData.slug}`}>{skinLabel}</SkinName>
          <div
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <BackgroundSkinPreview skin={skinData} />
          </div>
        </div>

        {isOwned ? null : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
                disabled={isPending || typeof price !== "number"}
              >
                {typeof price === "number" ? `${price} AlfCoins` : t("unavailable")}
              </Button>
            </PopoverTrigger>
            {!isLoggedIn ? (
              <PopoverContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{t("loginToUnlock")}</p>
                <Button className="w-full" onClick={() => signIn("google")}>
                  {tHome("login")}
                </Button>
              </PopoverContent>
            ) : (
              <PopoverContent className="space-y-3">
                <p className="font-semibold">{t("buyConfirmTitle", { skinName: skinLabel })}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof price === "number"
                    ? t("buyConfirmText", { price })
                    : t("skinNotAvailable")}
                </p>
                <Button
                  className="w-full"
                  disabled={isPending || !canBuy}
                  onClick={() => onBuy(skin)}
                >
                  {t("confirmPurchase")}
                </Button>
              </PopoverContent>
            )}
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {isLoggedIn && (
        <AlfCoinsProgressCard coins={coins} revealedCells={revealedCells} />
      )}

      {isLoggedIn && (
        <div className="flex items-center justify-end">
          <OwnedFilter value={groupOwned} onValueChange={setGroupOwned} label={t("owned")} />
        </div>
      )}

      {!isLoggedIn || !groupOwned ? (
        <div className={gridClassName}>
          {allBackgroundSkins.map(renderSkinCard)}
        </div>
      ) : (
        <>
          <div className={gridClassName}>
            {groupedSkins.owned.map(renderSkinCard)}
          </div>
          {groupedSkins.owned.length > 0 && groupedSkins.notOwned.length > 0 ? (
            <Separator className="my-6" />
          ) : null}
          <div className={gridClassName}>
            {groupedSkins.notOwned.map(renderSkinCard)}
          </div>
        </>
      )}
    </div>
  );
}
