"use client";

import { useMemo } from "react";
import {
  getBackgroundSkinEntries,
  getPublishedBackgroundSkins,
  type BackgroundSkinData,
  type BackgroundSkinPreviewMeta,
} from "@/features/skins/backgrounds/skins";
import { BackgroundSkinPreview } from "@/features/shared/components/background-skin-preview";

type BackgroundSkinsGalleryProps = {
  skinsMap?: Record<string, BackgroundSkinData>;
  emptyMessage?: string;
};

export function BackgroundSkinsGallery({
  skinsMap,
  emptyMessage = "No background skins yet.",
}: BackgroundSkinsGalleryProps) {
  const skins: BackgroundSkinPreviewMeta[] = useMemo(() => {
    return skinsMap
      ? getBackgroundSkinEntries(skinsMap)
      : getPublishedBackgroundSkins();
  }, [skinsMap]);

  if (!skins.length) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {skins.map((skin) => (
        <div key={skin.id} className="flex flex-col gap-3 rounded-lg border p-4">
          <p className="break-all text-gray-500">{skin.id}</p>
          <div className="w-fit rounded-md p-0">
            <BackgroundSkinPreview skin={skin} />
          </div>
        </div>
      ))}
    </div>
  );
}
