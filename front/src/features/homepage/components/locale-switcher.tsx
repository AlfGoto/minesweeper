"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";

const localeData: Record<string, { flag: string; name: string }> = {
  en: { flag: "🇬🇧", name: "English" },
  fr: { flag: "🇫🇷", name: "Français" },
  es: { flag: "🇪🇸", name: "Español" },
};

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(newLocale: string) {
    if (newLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <Select defaultValue={currentLocale} onValueChange={onLocaleChange}>
      <SelectTrigger
        className={cn(
          "bg-primary text-primary-foreground hover:bg-primary/90 w-[150px] justify-between",
          className,
          "px-4",
        )}
        disabled={isPending}
      >
        <SelectValue>
          {localeData[currentLocale].flag} {localeData[currentLocale].name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeData[loc].flag} {localeData[loc].name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
