"use client"

import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import RestartButton from "./restart-button";
import { formatTime } from "@/lib/dates";
import { useTranslations } from "next-intl";

export default function LoseDialog() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { registerLoseDialogOpener, getTime } = useGame();
  const t = useTranslations("homepage.loseDialog");

  useEffect(() => {
    const unregister = registerLoseDialogOpener((open) => {
      if (open) {
        setTime(getTime());
      }
      setOpen(open);
    });
    return unregister;
  }, [registerLoseDialogOpener, getTime]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="flex flex-col items-center justify-center gap-4 w-fit">
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
      </DialogHeader>
      <DialogDescription>{formatTime(time)}</DialogDescription>
      <RestartButton />
    </DialogContent>
    </Dialog>
  );
}