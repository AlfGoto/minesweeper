"use client"

import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import EndGameDialog from "./end-game-dialog";

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
    <EndGameDialog
      open={open}
      onOpenChange={setOpen}
      time={time}
      variant="win"
      title={t("title")}
      subline={t("subline")}
      timeLabel={t("time")}
      playAgain={t("playAgain")}
    />
  );
}
