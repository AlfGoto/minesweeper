"use client";

import { Suspense, type ReactNode } from "react";
import type { CellSkin } from "@/types/bff";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CellsTab } from "./cells-tab";
import { BannersTab } from "./banners-tab";
import { AlfCoinsProgressCard } from "./alf-coins-progress-card";
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

function TabHeader({
  title,
  description,
  aside,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div className="space-y-2">
        <h2 className="text-[44px] font-bold leading-[1.05] tracking-tight">
          {title}
        </h2>
        <p className="max-w-[640px] text-[17px] text-muted-foreground">
          {description}
        </p>
      </div>
      {aside}
    </div>
  );
}

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
  const coinsCard = isLoggedIn ? (
    <AlfCoinsProgressCard coins={coins} revealedCells={revealedCells} />
  ) : undefined;

  return (
    <Tabs defaultValue="cells" className="w-full gap-6">
      <TabsList className="w-full max-w-[480px]">
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
        className="data-[state=inactive]:hidden space-y-6 w-full"
      >
        <TabHeader
          title={t("cellsTitle")}
          description={t("cellsDescription")}
          aside={coinsCard}
        />
        <CellsTab
          isLoggedIn={isLoggedIn}
          coins={coins}
          selectedSkin={selectedSkin}
          unlockedSkins={unlockedSkins}
          prices={prices}
          locale={locale}
        />
      </TabsContent>

      <TabsContent
        value="backgrounds"
        forceMount
        className="data-[state=inactive]:hidden space-y-6 w-full"
      >
        <TabHeader
          title={t("backgroundsTitle")}
          description={t("backgroundsDescription")}
          aside={coinsCard}
        />
        <Suspense fallback={<div className="text-muted-foreground">{t("loading")}</div>}>
          {backgroundsTabContent}
        </Suspense>
      </TabsContent>

      <TabsContent
        value="banners"
        forceMount
        className="data-[state=inactive]:hidden space-y-6 w-full"
      >
        <TabHeader
          title={t("bannersTitle")}
          description={t("bannersDescription")}
          aside={coinsCard}
        />
        <BannersTab />
      </TabsContent>
    </Tabs>
  );
}
