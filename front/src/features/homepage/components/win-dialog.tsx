"use client"

import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import RestartButton from "./restart-button";
import { formatTime } from "@/lib/dates";

export default function WinDialog() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { registerWinDialogOpener, getTime } = useGame();

  // Register the opener/closer function with the provider
  useEffect(() => {
    const unregister = registerWinDialogOpener((open) => {
      if (open) {
        // Capture the time when dialog opens
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
        <DialogTitle>{"You Won! 🎉"}</DialogTitle>
      </DialogHeader>
      <DialogDescription> {"Congratulations!"}</DialogDescription>

      You won in {formatTime(time)}, amazing!

      <RestartButton />
    </DialogContent>
    </Dialog>
  );
}
