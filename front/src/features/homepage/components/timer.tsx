"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGame } from "@/features/homepage/game-provider";
import { formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

export default function Timer({ className }: { className?: string }) {
  const { getStartTime, isGameOn } = useGame();
  const [displayTime, setDisplayTime] = useState("0s");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const startTime = getStartTime();
      const gameOn = isGameOn();

      // Game not started yet
      if (startTime === null) {
        setDisplayTime("0s");
        return;
      }

      // Game ended - keep last displayed time
      if (!gameOn) {
        return;
      }

      // Game in progress - show live elapsed time
      const elapsed = Date.now() - startTime;
      setDisplayTime(formatTime(elapsed));
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getStartTime, isGameOn]);

  return (
    <Button variant="outline" disabled className={cn(className, "px-0")}>
      {displayTime}
    </Button>
  );
}
