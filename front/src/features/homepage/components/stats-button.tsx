"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function StatsButton({ className = "" }: { className?: string }) {
  const t = useTranslations("homepage");
  return (
    <Link href="/stats" prefetch className="w-full">
      <Button className={className}>{t("stats")}</Button>
    </Link>
  );
}
