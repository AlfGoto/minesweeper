"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BackgroundSkin } from "@/types/bff";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { backgroundSkins } from "@/features/skins/backgrounds/skins";
import { BackgroundSkinPreview } from "@/features/shared/components/background-skin-preview";
import {
  buyBackgroundSkinAction,
  selectBackgroundSkinAction,
} from "@/features/skins/actions";
import { OwnedFilter } from "./owned-filter";
import { toast } from "sonner";
import { AlfCoinsProgressCard } from "./alf-coins-progress-card";

type BackgroundSkinsShopProps = {
  coins: number;
  revealedCells: number;
  selectedSkin: BackgroundSkin;
  unlockedSkins: BackgroundSkin[];
  prices: Partial<Record<BackgroundSkin, number>>;
};

function formatSkinLabel(skin: BackgroundSkin) {
  if (skin === "default") return "Default";
  return skin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function BackgroundSkinsShop({
  coins,
  revealedCells,
  selectedSkin,
  unlockedSkins,
  prices,
}: BackgroundSkinsShopProps) {
  const router = useRouter();
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
        toast.success(result.message || "Skin bought.");
        router.refresh();
      } else {
        toast.error(result.message || "Could not buy this skin.");
      }
    });
  };

  const onSelect = (skin: BackgroundSkin) => {
    const previousSkin = optimisticSelectedSkin;
    setOptimisticSelectedSkin(skin);

    startTransition(async () => {
      const result = await selectBackgroundSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || "Skin selected.");
        router.refresh();
      } else {
        setOptimisticSelectedSkin(previousSkin);
        toast.error(result.message || "Could not select this skin.");
      }
    });
  };

  const renderSkinCard = (skin: BackgroundSkin) => {
    const skinData = backgroundSkins[skin];
    const isOwned = normalizedUnlockedSkins.includes(skin);
    const isSelected = isOwned && skin === optimisticSelectedSkin;
    const isSelectable = isOwned && !isSelected && !isPending;
    const price = prices[skin];
    const canBuy = typeof price === "number" && coins >= price;

    return (
      <div
        key={skin}
        className={`relative overflow-hidden rounded-lg border p-4 space-y-3 w-[250px] ${
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
          <p className="font-semibold">{formatSkinLabel(skin)}</p>
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
                {typeof price === "number" ? `${price} AlfCoins` : "Unavailable"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-3">
              <p className="font-semibold">Buy {formatSkinLabel(skin)}?</p>
              <p className="text-sm text-muted-foreground">
                {typeof price === "number"
                  ? `This will cost ${price} AlfCoins.`
                  : "This skin is not available right now."}
              </p>
              <Button
                className="w-full"
                disabled={isPending || !canBuy}
                onClick={() => onBuy(skin)}
              >
                Confirm purchase
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <AlfCoinsProgressCard coins={coins} revealedCells={revealedCells} />

      <div className="flex items-center justify-end">
        <OwnedFilter value={groupOwned} onValueChange={setGroupOwned} />
      </div>

      {!groupOwned ? (
        <div className="flex flex-wrap gap-4">
          {allBackgroundSkins.map(renderSkinCard)}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4">
            {groupedSkins.owned.map(renderSkinCard)}
          </div>
          {groupedSkins.owned.length > 0 && groupedSkins.notOwned.length > 0 ? (
            <Separator className="my-6" />
          ) : null}
          <div className="flex flex-wrap gap-4">
            {groupedSkins.notOwned.map(renderSkinCard)}
          </div>
        </>
      )}
    </div>
  );
}
