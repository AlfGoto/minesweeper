"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "../game-provider";
import { cn } from "@/lib/utils";

export default function RestartButton({ className = "" }: { className?: string }) {
  const { restart } = useGame();
  return (
    <Button className={cn("w-full", className)} onClick={restart}>Restart</Button>
  );
}