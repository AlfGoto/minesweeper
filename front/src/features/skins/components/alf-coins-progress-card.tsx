"use client";

import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

type AlfCoinsProgressCardProps = {
  coins: number;
  revealedCells: number;
  coinStep?: number;
};

export function AlfCoinsProgressCard({
  coins,
  revealedCells,
  coinStep = 1000,
}: AlfCoinsProgressCardProps) {
  const t = useTranslations("skinsPage");
  const revealedTowardNextCoin = ((revealedCells % coinStep) + coinStep) % coinStep;
  const progressPercent = (revealedTowardNextCoin / coinStep) * 100;

  return (
    <div className="w-full min-w-[240px] space-y-2 rounded-xl border bg-white px-4 py-3 sm:w-fit">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">{t("yourAlfCoins")}</h2>
        <p className="flex items-center gap-1.5 text-2xl font-bold">
          <Coins className="size-5" aria-hidden />
          {coins}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-green-300 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {t("toNextAlfCoin", { revealed: revealedTowardNextCoin, step: coinStep })}
      </p>
    </div>
  );
}
