"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function HowToPlayButton({ className = "" }: { className?: string }) {
  const t = useTranslations("homepage");
  return (
    <Link href="/how-to-play" prefetch className="w-full">
      <Button className={className}>{t("howToPlay")}</Button>
    </Link>
  );
}
