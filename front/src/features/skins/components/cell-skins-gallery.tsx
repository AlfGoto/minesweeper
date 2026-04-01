"use client";

import { useMemo } from "react";
import { CellSkins } from "@/features/skins/cell-skins";
import { CellSkin } from "@/types/bff";
import { CellSkinPreview } from "@/features/shared/components/cell-skin-preview";

type CellSkinsGalleryProps = {
  skinsMap?: typeof CellSkins;
  emptyMessage?: string;
};

export function CellSkinsGallery({
  skinsMap = CellSkins,
  emptyMessage = "No skins yet.",
}: CellSkinsGalleryProps) {
  const skins = useMemo(() => Object.keys(skinsMap) as CellSkin[], [skinsMap]);

  if (!skins.length) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {skins.map((skin) => (
        <div key={skin} className="rounded-lg border p-4 flex flex-col gap-3">
          <p className="text-gray-500 break-all">{skin}</p>
          <div className="p-2 border border-gray-200 rounded-md w-fit">
            <CellSkinPreview skin={skin} />
          </div>
        </div>
      ))}
    </div>
  );
}
