"use client";

import { Ellipsis } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocaleSwitcher } from "./locale-switcher";

export default function MoreSheet({ isPlayer }: { isPlayer: boolean }) {
  const t = useTranslations("homepage");
  const rowClassName = "w-full h-11";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="size-[52px]"
          aria-label={t("more")}
        >
          <Ellipsis />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="top-auto bottom-0 left-0 translate-x-0 translate-y-0 max-w-full sm:max-w-full w-full rounded-b-none rounded-t-xl border-x-0 border-b-0 px-4 pt-6 pb-8 gap-2 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
      >
        <div className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-muted-foreground/30" />
        <DialogTitle className="sr-only">{t("more")}</DialogTitle>
        <DialogDescription className="sr-only">{t("more")}</DialogDescription>
        {!isPlayer && (
          <Button className={rowClassName} onClick={() => signIn("google")}>
            {t("login")}
          </Button>
        )}
        <Button asChild variant="outline" className={rowClassName}>
          <Link href="/stats" prefetch>
            {t("stats")}
          </Link>
        </Button>
        <Button asChild variant="outline" className={rowClassName}>
          <Link href="/how-to-play" prefetch>
            {t("howToPlay")}
          </Link>
        </Button>
        <LocaleSwitcher className="w-full h-11" />
      </DialogContent>
    </Dialog>
  );
}
