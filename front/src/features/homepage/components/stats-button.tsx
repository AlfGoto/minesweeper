"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function StatsButton({
  className = "",
  loggedIn = true,
}: {
  className?: string;
  loggedIn?: boolean;
}) {
  if (loggedIn) {
    return (
      <Link href="/stats" prefetch={true} className="w-full">
        <Button className={className}>Stats</Button>
      </Link>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-full" tabIndex={0}>
            <Button className={className} disabled>
              Stats
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Login to see your stats</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
