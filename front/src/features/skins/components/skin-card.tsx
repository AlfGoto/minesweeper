"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SkinName } from "./skin-name";

type SkinCardProps = {
  name: string;
  /** Link to the skin's SEO page. */
  href?: string;
  /** The live preview area (real skin components). */
  preview: ReactNode;
  isLoggedIn: boolean;
  isDefault: boolean;
  isOwned: boolean;
  isSelected: boolean;
  price?: number;
  canBuy: boolean;
  isPending: boolean;
  onSelect: () => void;
  onBuy: () => void;
};

function PricePill({ price }: { price?: number }) {
  const t = useTranslations("skinsPage");
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[13px] font-medium">
      {typeof price === "number" ? (
        <>
          <Coins className="size-3.5" aria-hidden />
          {price} AlfCoins
        </>
      ) : (
        t("unavailable")
      )}
    </span>
  );
}

export function SkinCard({
  name,
  href,
  preview,
  isLoggedIn,
  isDefault,
  isOwned,
  isSelected,
  price,
  canBuy,
  isPending,
  onSelect,
  onBuy,
}: SkinCardProps) {
  const t = useTranslations("skinsPage");
  const hasPrice = typeof price === "number";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[18px] border bg-white p-3",
        isSelected && "border-2 border-primary",
      )}
    >
      {preview}

      <div className="flex items-center justify-between gap-2">
        <SkinName href={href}>{name}</SkinName>
        {isLoggedIn && isOwned ? (
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted"
            role="img"
            aria-label={t("owned")}
          >
            <Check className="size-3.5" aria-hidden />
          </span>
        ) : !isLoggedIn ? (
          isDefault ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-muted px-2.5 py-1 text-[13px] font-medium text-muted-foreground">
              {t("default")}
            </span>
          ) : (
            <PricePill price={price} />
          )
        ) : null}
      </div>

      {isLoggedIn ? (
        isSelected ? (
          <div className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground">
            <Check className="size-4" aria-hidden />
            {t("selected")}
          </div>
        ) : isOwned ? (
          <Button
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={onSelect}
          >
            {t("select")}
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full", !canBuy && "opacity-50")}
                disabled={isPending || !hasPrice || !canBuy}
              >
                {hasPrice ? (
                  <>
                    <Coins className="size-4" aria-hidden />
                    {price} AlfCoins
                  </>
                ) : (
                  t("unavailable")
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-3">
              <p className="font-semibold">{t("buyConfirmTitle", { skinName: name })}</p>
              <p className="text-sm text-muted-foreground">
                {hasPrice ? t("buyConfirmText", { price }) : t("skinNotAvailable")}
              </p>
              <Button
                className="w-full"
                disabled={isPending || !canBuy}
                onClick={onBuy}
              >
                {t("confirmPurchase")}
              </Button>
            </PopoverContent>
          </Popover>
        )
      ) : null}
    </div>
  );
}
