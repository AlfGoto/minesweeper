"use client"

import { Dialog, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LockIcon, LogInIcon, PaletteIcon, RotateCcwIcon, TrophyIcon } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useGame } from "../game-provider";
import { formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { jadeTempleSkin } from "@/features/skins/cells/skins/jade-temple";
import { beachSkin } from "@/features/skins/cells/skins/beach";
import { iglooSkin } from "@/features/skins/cells/skins/igloo";
import { voidOrchidSkin } from "@/features/skins/cells/skins/void-orchid";
import { orangePopSkin } from "@/features/skins/cells/skins/orange-pop";

const LOCKED_SKINS = [jadeTempleSkin, beachSkin, iglooSkin, voidOrchidSkin, orangePopSkin];

type SwatchColors = { hidden: string; hiddenAlt: string; revealed: string; revealedAlt: string };

function SkinSwatch({ colors }: { colors?: SwatchColors }) {
  if (!colors) return null;
  return (
    <div className="relative size-9 shrink-0">
      <div className="grid size-9 grid-cols-2 overflow-hidden rounded-lg border">
        <span style={{ background: colors.hidden }} />
        <span style={{ background: colors.revealed }} />
        <span style={{ background: colors.revealedAlt }} />
        <span style={{ background: colors.hiddenAlt }} />
      </div>
      <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border bg-white">
        <LockIcon className="size-2.5 text-muted-foreground" />
      </span>
    </div>
  );
}

export default function EndGameDialog({
  open,
  onOpenChange,
  time,
  variant,
  title,
  subline,
  timeLabel,
  playAgain,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  time: number;
  variant: "win" | "lose";
  title: string;
  subline: string;
  timeLabel: string;
  playAgain: string;
}) {
  const { restart } = useGame();
  const { status } = useSession();
  const te = useTranslations("homepage.endDialog");
  const isVisitor = status === "unauthenticated";
  const isWin = variant === "win";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center gap-5 rounded-xl px-6 pt-7 pb-6 sm:max-w-[400px]">
        <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>
        <DialogDescription asChild>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{timeLabel}</span>
            <span
              className={cn(
                "font-bold tabular-nums leading-none",
                isWin ? "text-[56px] text-foreground" : "text-[40px] text-neutral-700",
              )}
            >
              {formatTime(time)}
            </span>
            <span className="text-[13px] text-muted-foreground">{subline}</span>
          </div>
        </DialogDescription>

        {isVisitor && (
          <div className="flex w-full flex-col items-center gap-3.5 rounded-xl bg-muted p-[18px] text-center">
            <div className="flex gap-2">
              {LOCKED_SKINS.map((skin) => (
                <SkinSwatch key={skin.slug} colors={skin.ogColors} />
              ))}
            </div>
            <p className="text-[15px] font-medium">{te("signInPitch")}</p>
            <div className="flex gap-4 text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PaletteIcon className="size-4" />
                {te("skinsHint")}
              </span>
              <span className="flex items-center gap-1.5">
                <TrophyIcon className="size-4" />
                {te("rankingHint")}
              </span>
            </div>
            <Button className="h-11 w-full" onClick={() => signIn("google")}>
              <LogInIcon />
              {te("signIn")}
            </Button>
            <p className="text-xs text-muted-foreground">{te("savedFromNext")}</p>
          </div>
        )}

        <Button variant={isVisitor ? "outline" : "default"} className="h-11 w-full" onClick={restart}>
          <RotateCcwIcon />
          {playAgain}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
