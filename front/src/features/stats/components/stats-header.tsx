"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface StatsHeaderProps {
  userName?: string;
  userImage?: string;
}

export function StatsHeader({ userName, userImage }: StatsHeaderProps) {
  const t = useTranslations("statsPage");
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {userImage && (
          <Image
            src={userImage}
            alt={userName ?? "Profile"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{t("yourStats")}</h1>
          {userName && (
            <p className="text-sm text-muted-foreground">{userName}</p>
          )}
        </div>
      </div>
      <div className="flex w-full gap-2 sm:w-auto">
        <Link href="/" prefetch={true} className="flex-1 sm:flex-none">
          <Button className="w-full">{t("backToGame")}</Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex-1 sm:flex-none"
        >
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}
