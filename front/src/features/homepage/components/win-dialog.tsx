"use client"

import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import RestartButton from "./restart-button";
import { formatTime } from "@/lib/dates";
import { useTranslations } from "next-intl";

export default function WinDialog() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { registerWinDialogOpener, getTime } = useGame();
  const t = useTranslations("homepage.winDialog");

  useEffect(() => {
    const unregister = registerWinDialogOpener((open) => {
      if (open) {
        setTime(getTime());
      }
      setOpen(open);
    });
    return unregister;
  }, [registerWinDialogOpener, getTime]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="flex flex-col items-center justify-center gap-4 w-fit">
      <DialogHeader>
        <DialogTitle>{t("title")} 🎉</DialogTitle>
      </DialogHeader>
      <DialogDescription>{t("time")}: {formatTime(time)}</DialogDescription>
      <RestartButton />
    </DialogContent>
    </Dialog>
  );
}
