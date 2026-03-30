"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CellSkin } from "@/types/bff";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CellSkins } from "@/features/skins/cell-skins";
import { CellSkinPreview } from "@/features/shared/components/cell-skin-preview";
import { buyCellSkinAction, selectCellSkinAction } from "@/features/skins/actions";

type CellSkinsShopProps = {
  coins: number;
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

export function CellSkinsShop({
  coins,
  selectedSkin,
  unlockedSkins,
  prices,
}: CellSkinsShopProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const allCellSkins = useMemo(
    () => Object.keys(CellSkins) as CellSkin[],
    [],
  );

  const normalizedUnlockedSkins = useMemo(() => {
    const skins = new Set<CellSkin>(["default", ...unlockedSkins]);
    return allCellSkins.filter((skin) => skins.has(skin));
  }, [allCellSkins, unlockedSkins]);

  const shopSkins = useMemo(
    () =>
      allCellSkins.filter(
        (skin) => skin !== "default" && !normalizedUnlockedSkins.includes(skin),
      ),
    [allCellSkins, normalizedUnlockedSkins],
  );

  const onBuy = (skin: CellSkin) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await buyCellSkinAction(skin);
      setFeedback(result.message);
      if (result.ok) router.refresh();
    });
  };

  const onSelect = (skin: CellSkin) => {
    setFeedback(null);
    startTransition(async () => {
      const result = await selectCellSkinAction(skin);
      setFeedback(result.message);
      if (result.ok) router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Coins</h2>
        <p className="text-2xl font-bold">{coins} 🪙</p>
      </div>

      {feedback ? (
        <p className="text-sm text-muted-foreground border rounded-lg px-3 py-2">
          {feedback}
        </p>
      ) : null}

      <Tabs defaultValue="shop" className="w-full border rounded-lg gap-0 bg-white">
        <TabsList className="w-fit mx-2 my-4 p-2">
          <TabsTrigger value="shop" className="cursor-pointer">
            Shop
          </TabsTrigger>
          <TabsTrigger value="unlocked" className="cursor-pointer">
            Unlocked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" forceMount className="data-[state=inactive]:hidden p-4">
          {shopSkins.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopSkins.map((skin) => {
                const price = prices[skin];
                const canBuy = typeof price === "number" && coins >= price;
                return (
                  <div key={skin} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{formatSkinLabel(skin)}</p>
                        <p className="text-sm text-muted-foreground">{skin}</p>
                      </div>
                      <CellSkinPreview skin={skin} />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {typeof price === "number" ? `${price} 🪙` : "Unavailable"}
                      </p>
                      <Button
                        disabled={isPending || !canBuy}
                        onClick={() => onBuy(skin)}
                        size="sm"
                      >
                        Buy
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              You already unlocked every paid cell skin.
            </p>
          )}
        </TabsContent>

        <TabsContent
          value="unlocked"
          forceMount
          className="data-[state=inactive]:hidden p-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {normalizedUnlockedSkins.map((skin) => {
              const isSelected = skin === selectedSkin;
              return (
                <div key={skin} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{formatSkinLabel(skin)}</p>
                      <p className="text-sm text-muted-foreground">{skin}</p>
                    </div>
                    <CellSkinPreview skin={skin} />
                  </div>
                  <Button
                    className="w-full"
                    disabled={isPending || isSelected}
                    onClick={() => onSelect(skin)}
                    variant={isSelected ? "secondary" : "default"}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </Button>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
