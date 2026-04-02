"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HowToPlayButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/how-to-play" prefetch className="w-full">
      <Button className={className}>How to Play</Button>
    </Link>
  );
}
