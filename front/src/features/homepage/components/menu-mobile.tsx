import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import RestartButton from "./restart-button";
import MoreSheet from "./more-sheet";

const mobileWidthClassName =
  "w-[min(calc(100vw-0.5rem),calc(100dvh-10rem))]";

export default async function MenuMobile() {
  const session = await getServerSession();
  const t = await getTranslations("homepage");

  return (
    <div className="md:hidden pb-6">
      <div className={`flex gap-2 h-[52px] ${mobileWidthClassName}`}>
        <RestartButton className="flex-1 h-[52px] text-base" />
        <Button asChild variant="outline" className="h-[52px] px-4 text-base">
          <Link href="/skins" prefetch>
            {t("skins")}
          </Link>
        </Button>
        <MoreSheet isPlayer={!!session} />
      </div>
    </div>
  );
}
