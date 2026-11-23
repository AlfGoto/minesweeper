"use client";

import { LogIn, Play } from "lucide-react";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const styles = {
  light: { primary: "", secondary: "" },
  dark: {
    primary: "bg-white text-neutral-900 hover:bg-white/90",
    secondary:
      "border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white",
  },
} as const;

/** Same for everyone: "Sign in to unlock" (main) + "Play Minesweeper Now" (secondary). No session read. */
export function SkinCtaButtons({
  signInLabel,
  playLabel,
  tone = "light",
  className,
}: {
  signInLabel: string;
  playLabel: string;
  tone?: keyof typeof styles;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Button
        className={cn("h-11 px-6", styles[tone].primary)}
        onClick={() => signIn("google")}
      >
        <LogIn />
        {signInLabel}
      </Button>
      <Button
        asChild
        variant="outline"
        className={cn("h-11 px-6", styles[tone].secondary)}
      >
        <Link href="/">
          <Play />
          {playLabel}
        </Link>
      </Button>
    </div>
  );
}
