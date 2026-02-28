"use client"

import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { useGame } from "../game-provider";
import { useState, useEffect } from "react";
import RestartButton from "./restart-button";
import { formatTime } from "@/lib/dates";

export default function LoseDialog() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(0);
  const { registerLoseDialogOpener, getTime } = useGame();

  // Register the opener/closer function with the provider
  useEffect(() => {
    const unregister = registerLoseDialogOpener((open) => {
      if (open) {
        // Capture the time when dialog opens
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
        <DialogTitle>{"You Lost :("}</DialogTitle>
      </DialogHeader>
      <DialogDescription> {"Try again!"}</DialogDescription>

      You lost in {formatTime(time)}, nice try!

      <RestartButton />
    </DialogContent>
    </Dialog>
  );
}