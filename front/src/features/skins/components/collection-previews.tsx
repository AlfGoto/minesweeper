"use client";

import { useTranslations } from "next-intl";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { CellSkin } from "@/types/bff";
import type { Cell } from "@/types/game";
import type { BackgroundSkinPreviewMeta } from "@/features/skins/backgrounds";
import {
  CellSkinLargeDemoGrid,
  DEMO_GRID,
  DEMO_GRID_SIZE,
  PREVIEW_2X2_CELLS,
  PreviewGrid,
} from "@/features/shared/components/cell-skin-preview";

type BackgroundPreviewSkin = Pick<
  BackgroundSkinPreviewMeta,
  "name" | "value" | "style"
>;

/** Real 5x5 demo grid of a cell skin. Click opens the 10x10 preview. */
export function CellSkinCardPreview({ skin }: { skin: CellSkin }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cursor-pointer overflow-hidden rounded-lg p-0 leading-none shadow-lg"
        >
          <PreviewGrid
            skin={skin}
            grid={DEMO_GRID}
            gridSize={DEMO_GRID_SIZE}
            cellClassName="size-7 text-xs"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <CellSkinLargeDemoGrid skin={skin} />
      </PopoverContent>
    </Popover>
  );
}

/** Small real 2x2 swatch of a cell skin (login banner). */
export function CellSkinSwatch({ skin }: { skin: CellSkin }) {
  return (
    <span className="inline-flex overflow-hidden rounded-md leading-none">
      <PreviewGrid
        skin={skin}
        grid={PREVIEW_2X2_CELLS}
        gridSize={2}
        cellClassName="size-5 text-xs"
      />
    </span>
  );
}

const HIDDEN_CELLS_3X3: Cell[] = Array.from({ length: 9 }, () => ({
  status: "hidden",
  value: 0,
}));

function BackgroundLargePreview({ skin }: { skin: BackgroundPreviewSkin }) {
  return (
    <div className="rounded-xl border bg-background p-3 shadow-xl">
      <div
        className={cn("size-115 rounded-2xl ring-1 ring-inset ring-border", skin.value)}
        style={skin.style}
      />
    </div>
  );
}

/**
 * Background fills the area, with a small checkerboard of default cells on it.
 * Click opens the large preview.
 */
export function BackgroundSkinCardPreview({
  skin,
}: {
  skin: BackgroundPreviewSkin;
}) {
  const t = useTranslations("skinsPage");
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-44 w-full cursor-pointer items-center justify-center rounded-xl p-0 ring-1 ring-inset ring-border",
            skin.value,
          )}
          style={skin.style}
          aria-label={t("previewBackground", { name: skin.name })}
        >
          <span className="overflow-hidden rounded-lg leading-none shadow-lg">
            <PreviewGrid
              skin="default"
              grid={HIDDEN_CELLS_3X3}
              gridSize={3}
              cellClassName="size-7 text-xs"
            />
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-none bg-transparent p-0 shadow-none">
        <BackgroundLargePreview skin={skin} />
      </PopoverContent>
    </Popover>
  );
}
