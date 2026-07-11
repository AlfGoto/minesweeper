"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function LoginButton({
  className = "",
}: {
  className?: string;
}) {
  const t = useTranslations("homepage");
  return (
    <Button className={className} onClick={() => signIn("google")}>
      {t("login")}
    </Button>
  );
}
