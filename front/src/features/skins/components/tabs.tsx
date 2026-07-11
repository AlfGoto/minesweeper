"use client";

import { Suspense, type ReactNode } from "react";
import type { CellSkin } from "@/types/bff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CellsTab } from "./cells-tab";
import { BannersTab } from "./banners-tab";
import { useTranslations } from "next-intl";

type CellSkinsShopProps = {
  isLoggedIn?: boolean;
  coins: number;
  revealedCells: number;
  selectedSkin: CellSkin;
  unlockedSkins: CellSkin[];
  prices: Partial<Record<CellSkin, number>>;
  locale?: string;
  backgroundsTabContent: ReactNode;
};

export function CellSkinsShop({
  isLoggedIn = true,
  coins,
  revealedCells,
  selectedSkin,
  unlockedSkins,
  prices,
  locale = "en",
  backgroundsTabContent,
}: CellSkinsShopProps) {
  const t = useTranslations("skinsPage");
  return (
    <Tabs
      defaultValue="cells"
      className="w-full max-w-4xl mx-auto border rounded-lg gap-0 bg-white flex-1"
    >
      <TabsList className="w-[calc(100%-1rem)] mx-2 my-4 p-2">
        <TabsTrigger value="cells" className="cursor-pointer flex-1">
          {t("cells")}
        </TabsTrigger>
        <TabsTrigger value="backgrounds" className="cursor-pointer flex-1">
          {t("backgrounds")}
        </TabsTrigger>
        <TabsTrigger value="banners" className="cursor-pointer flex-1">
          {t("banners")}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="cells"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t("cellsTitle")}</h1>
          <p className="text-muted-foreground">{t("cellsDescription")}</p>
        </div>
        <CellsTab
          isLoggedIn={isLoggedIn}
          coins={coins}
          revealedCells={revealedCells}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          prices={prices}
          locale={locale}
        />
      </TabsContent>

      <TabsContent
        value="backgrounds"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t("backgroundsTitle")}</h1>
          <p className="text-muted-foreground">{t("backgroundsDescription")}</p>
        </div>
        <Suspense fallback={<div className="text-muted-foreground">{t("loading")}</div>}>
          {backgroundsTabContent}
        </Suspense>
      </TabsContent>

      <TabsContent
        value="banners"
        forceMount
        className="data-[state=inactive]:hidden p-4 space-y-4 w-full"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t("bannersTitle")}</h1>
          <p className="text-muted-foreground">{t("bannersDescription")}</p>
        </div>
        <BannersTab />
      </TabsContent>
    </Tabs>
  );
}
