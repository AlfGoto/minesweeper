"use client";

import { useTranslations } from "next-intl";
import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import type { CellSkin } from "@/types/bff";
import { CellSkins } from "@/features/skins/cells/skins";
import { CellSkinSwatch } from "./collection-previews";

const SWATCH_SKINS = (Object.keys(CellSkins) as CellSkin[])
  .filter((skin) => skin !== "default")
  .slice(0, 6);

/** Shown to visitors on top of the Collection. */
export function LoginBanner() {
  const t = useTranslations("skinsPage");
  const tHome = useTranslations("homepage");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary px-6 py-5 text-primary-foreground">
      <div className="flex items-center gap-4">
        <div className="flex items-center" aria-hidden>
          {SWATCH_SKINS.map((skin, index) => (
            <span
              key={skin}
              className="rounded-md ring-[3px] ring-primary"
              style={{ marginLeft: index === 0 ? 0 : -10 }}
            >
              <CellSkinSwatch skin={skin} />
            </span>
          ))}
        </div>
        <p className="text-lg font-semibold">{t("loginToUnlock")}</p>
      </div>
      <Button
        variant="secondary"
        className="bg-white text-foreground hover:bg-white/90"
        onClick={() => signIn("google")}
      >
        <LogIn className="size-4" aria-hidden />
        {tHome("login")}
      </Button>
    </div>
  );
}
