import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-4xl",
  wide: "max-w-6xl",
} as const;

/**
 * Same shell as the skins page: "Back to game" on top, content in a white
 * bordered card so text stays readable on any background skin.
 */
export async function PageContainer({
  size = "default",
  className,
  children,
}: {
  size?: keyof typeof widths;
  className?: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations("homepage");

  return (
    <main className={cn("mx-auto w-full p-4 md:p-8 flex flex-col gap-4", widths[size])}>
      <div className="flex justify-end">
        <Link href="/" prefetch>
          <Button>{t("backToGame")}</Button>
        </Link>
      </div>
      <div className={cn("rounded-lg border bg-white p-4 md:p-8", className)}>
        {children}
      </div>
    </main>
  );
}
