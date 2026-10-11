"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { OwnedFilter } from "./owned-filter";

export function BannersTab() {
  const t = useTranslations("skinsPage");
  const [groupOwned, setGroupOwned] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <OwnedFilter value={groupOwned} onValueChange={setGroupOwned} label={t("owned")} />
      </div>
      <p className="text-muted-foreground text-sm border rounded-lg px-3 py-2">
        {t("bannersComingSoon")}
      </p>
    </div>
  );
}
