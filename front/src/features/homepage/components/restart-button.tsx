"use client";

import { Button } from "@/components/ui/button";
import { useGame } from "../game-provider";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function RestartButton({ className = "" }: { className?: string }) {
  const { restart } = useGame();
  const t = useTranslations("homepage");
  return (
    <Button className={cn("w-full", className)} onClick={restart}>{t("restartButton")}</Button>
  );
}