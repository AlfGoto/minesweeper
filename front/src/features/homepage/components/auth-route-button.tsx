"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AuthRouteButtonProps = {
  className?: string;
  loggedIn?: boolean;
  href: string;
  label: string;
  tooltipText: string;
};

export function AuthRouteButton({
  className = "",
  loggedIn = true,
  href,
  label,
  tooltipText,
}: AuthRouteButtonProps) {
  if (loggedIn) {
    return (
      <Link href={href} prefetch className="w-full">
        <Button className={className}>{label}</Button>
      </Link>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-full" tabIndex={0}>
            <Button className={className} disabled>
              {label}
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
