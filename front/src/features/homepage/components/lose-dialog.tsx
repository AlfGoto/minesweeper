"use client"

import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import EndGameDialog from "./end-game-dialog";

export default function LoseDialog() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { registerLoseDialogOpener, getTime } = useGame();
  const t = useTranslations("homepage.loseDialog");
  const tWin = useTranslations("homepage.winDialog");

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
    <EndGameDialog
      open={open}
      onOpenChange={setOpen}
      time={time}
      variant="lose"
      title={t("title")}
      subline={t("subline")}
      timeLabel={tWin("time")}
      playAgain={t("playAgain")}
    />
  );
}
