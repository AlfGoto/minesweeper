"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CellSkin } from "@/types/bff";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CellSkins } from "@/features/skins/cell-skins";
import {
  CellSkinLargeDemoGrid,
  CellSkinPreview,
} from "@/features/shared/components/cell-skin-preview";
import { buyCellSkinAction, selectCellSkinAction } from "@/features/skins/actions";
import { OwnedFilter } from "./owned-filter";
import { toast } from "sonner";
import { AlfCoinsProgressCard } from "./alf-coins-progress-card";

type CellsTabProps = {
  coins: number;
  revealedCells: number;
  selectedSkin: CellSkin;
  unlockedSkins: CellSkin[];
  prices: Partial<Record<CellSkin, number>>;
};

function formatSkinLabel(skin: CellSkin) {
  if (skin === "default") return "Default";
  return skin
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CellsTab({
  coins,
  revealedCells,
  selectedSkin,
  unlockedSkins,
  prices,
}: CellsTabProps) {
  const router = useRouter();
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
        toast.success(result.message || "Skin bought.");
        router.refresh();
      } else {
        toast.error(result.message || "Could not buy this skin.");
      }
    });
  };

  const onSelect = (skin: CellSkin) => {
    const previousSkin = optimisticSelectedSkin;
    setOptimisticSelectedSkin(skin);

    startTransition(async () => {
      const result = await selectCellSkinAction(skin);
      if (result.ok) {
        toast.success(result.message || "Skin selected.");
        router.refresh();
      } else {
        setOptimisticSelectedSkin(previousSkin);
        toast.error(result.message || "Could not select this skin.");
      }
    });
  };

  const renderSkinCard = (skin: CellSkin) => {
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
            <div className="absolute -inset-16 flex items-center justify-center">
              <div className="scale-[1.30] translate-y-10 blur-[2px] opacity-45">
                <CellSkinLargeDemoGrid skin={skin} />
              </div>
            </div>
            <div className="absolute inset-0 bg-background/45" />
          </div>
        ) : null}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <p className="font-semibold">{formatSkinLabel(skin)}</p>
          <div
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <CellSkinPreview skin={skin} />
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
        <div className="flex flex-wrap gap-4">{allCellSkins.map(renderSkinCard)}</div>
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
