"use client";

import { NonPublishedCellSkins } from "@/features/skins/cells/skins";
import { CellSkinsGallery } from "./cell-skins-gallery";

export function NonPublishedCellSkinsGallery() {
  return (
    <CellSkinsGallery
      skinsMap={NonPublishedCellSkins}
      emptyMessage="No non published skins yet."
    />
  );
}
