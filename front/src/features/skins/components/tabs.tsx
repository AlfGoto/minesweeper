"use client";

import type { CellSkin } from "@/types/bff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CellsTab } from "./cells-tab";
import { BackgroundsTab } from "./backgrounds-tab";
import { BannersTab } from "./banners-tab";

type CellSkinsShopProps = {
  coins: number;
  revealedCells: number;
  selectedSkin: CellSkin;
  unlockedSkins: CellSkin[];
  prices: Partial<Record<CellSkin, number>>;
};

export function CellSkinsShop({
  coins,
  revealedCells,
  selectedSkin,
  unlockedSkins,
  prices,
}: CellSkinsShopProps) {
  return (
    <Tabs
      defaultValue="cells"
      className="w-full max-w-4xl mx-auto border rounded-lg gap-0 bg-white flex-1"
    >
      <TabsList className="w-[calc(100%-1rem)] mx-2 my-4 p-2">
        <TabsTrigger value="cells" className="cursor-pointer flex-1">
          Cells
        </TabsTrigger>
        <TabsTrigger value="backgrounds" className="cursor-pointer flex-1">
          Backgrounds
        </TabsTrigger>
        <TabsTrigger value="banners" className="cursor-pointer flex-1">
          Banners
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="cells"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Cell Skins</h1>
          <p className="text-muted-foreground">
            Buy new skins with your AlfCoins and grow your collection. Click on
            the 2x2 square to preview the skin.
          </p>
        </div>
        <CellsTab
          coins={coins}
          revealedCells={revealedCells}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          prices={prices}
        />
      </TabsContent>

      <TabsContent
        value="backgrounds"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Background Skins</h1>
          <p className="text-muted-foreground">
            Customize the game background. This section is coming as soon as
            possible.
          </p>
        </div>
        <BackgroundsTab />
      </TabsContent>

      <TabsContent
        value="banners"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Banner Skins</h1>
          <p className="text-muted-foreground">
            Personalize your banner style. This section is coming as soon as
            possible.
          </p>
        </div>
        <BannersTab />
      </TabsContent>
    </Tabs>
  );
}
