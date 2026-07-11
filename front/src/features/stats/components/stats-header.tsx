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
    <div className="flex w-full justify-between items-center">
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
          <h2 className="text-2xl font-bold">{t("yourStats")}</h2>
          {userName && (
            <p className="text-sm text-muted-foreground">{userName}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href="/" prefetch={true}>
          <Button>{t("backToGame")}</Button>
        </Link>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}
