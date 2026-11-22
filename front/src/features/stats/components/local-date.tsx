"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getLocalTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => "UTC";

// Shows a date in the player's local time (UTC on the server)
export function LocalDate({ date, locale }: { date: string; locale: string }) {
  const timeZone = useSyncExternalStore(
    subscribe,
    getLocalTimeZone,
    getServerTimeZone,
  );

  return (
    <time dateTime={date} suppressHydrationWarning>
      {new Date(date).toLocaleString(locale, {
        dateStyle: "short",
        timeStyle: "short",
        timeZone,
      })}
    </time>
  );
}
