"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// End of the current month (UTC). Shown to the player in their own time.
function getEnd(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
}

export function MonthCountdown() {
  const t = useTranslations("statsPage.currentMonth");
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = getEnd();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (left === null) return <span className="invisible">&nbsp;</span>;

  const s = Math.floor(left / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return <span>{t("endsIn", { days, hours, minutes, seconds })}</span>;
}
