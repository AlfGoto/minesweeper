"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { BackgroundSkinPreviewMeta } from "@/features/skins/backgrounds/skins";

function BackgroundPreviewSurface({
  skin,
  large = false,
}: {
  skin: Pick<BackgroundSkinPreviewMeta, "name" | "value" | "style">;
  large?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        large ? "size-115 rounded-2xl" : "size-14",
        skin.value,
      )}
      style={skin.style}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
        <div className="h-5 rounded-md border border-white/60 bg-white/85 shadow-sm" />
        <div className="h-5 rounded-md border border-white/60 bg-white/65 shadow-sm" />
      </div>
    </div>
  );
}

export function BackgroundSkinPreview({
  skin,
}: {
  skin: Pick<BackgroundSkinPreviewMeta, "name" | "value" | "style">;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-xl p-0 leading-none transition-transform hover:scale-[1.03]"
          aria-label={`Preview ${skin.name} background skin`}
        >
          <BackgroundPreviewSurface skin={skin} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-xl">
          <BackgroundPreviewSurface skin={skin} large />
        </div>
      </PopoverContent>
    </Popover>
  );
}
