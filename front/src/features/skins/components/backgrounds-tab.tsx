"use client";

import { useState } from "react";
import { OwnedFilter } from "./owned-filter";

export function BackgroundsTab() {
  const [groupOwned, setGroupOwned] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <OwnedFilter value={groupOwned} onValueChange={setGroupOwned} />
      </div>
      <p className="text-muted-foreground text-sm border rounded-lg px-3 py-2">
        Background skins are in development right now. We are shipping this as
        soon as possible, thanks for your patience.
      </p>
    </div>
  );
}
