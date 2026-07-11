"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function SkinsButton({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("homepage");
  return (
    <Link href="/skins" prefetch className="w-full">
      <Button className={className}>{t("skins")}</Button>
    </Link>
  );
}
