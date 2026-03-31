"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Cell } from "@/types/game";
import { getSkin } from "@/features/skins/cell-skins";
import { CellSkin } from "@/types/bff";

type PreviewCell = Cell;

const PREVIEW_2X2_CELLS: PreviewCell[] = [
  { status: "hidden", value: 0 },
  { status: "flagged", value: 0 },
  { status: "revealed", value: 2 },
  { status: "revealed", value: 1 },
];

const DEMO_GRID_SIZE = 5;
const DEMO_GRID: PreviewCell[] = [
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "revealed", value: "bomb" },
  { status: "revealed", value: 1 },
  { status: "revealed", value: 2 },
  { status: "flagged", value: 0 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "revealed", value: 1 },
  { status: "revealed", value: 2 },
  { status: "revealed", value: 3 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "revealed", value: 1 },
  { status: "revealed", value: 3 },
  { status: "revealed", value: 2 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "revealed", value: 0 },
  { status: "revealed", value: 1 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
  { status: "hidden", value: 0 },
];

const LARGE_DEMO_GRID_SIZE = 10;
const LARGE_DEMO_GRID: PreviewCell[] = Array.from(
  { length: LARGE_DEMO_GRID_SIZE * LARGE_DEMO_GRID_SIZE },
  (_, index) => DEMO_GRID[index % DEMO_GRID.length] ?? { status: "hidden", value: 0 },
);

function getCell(grid: PreviewCell[], id: number): PreviewCell {
  return grid[id] ?? { status: "hidden", value: 0 };
}

function getNeighborContext(grid: PreviewCell[], id: number, gridSize: number) {
  const row = Math.floor(id / gridSize);
  const col = id % gridSize;

  const isUnrevealed = (r: number, c: number) => {
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
    const neighbor = getCell(grid, r * gridSize + c);
    return neighbor.status === "hidden" || neighbor.status === "flagged";
  };

  return {
    topIsUnrevealed: isUnrevealed(row - 1, col),
    rightIsUnrevealed: isUnrevealed(row, col + 1),
    bottomIsUnrevealed: isUnrevealed(row + 1, col),
    leftIsUnrevealed: isUnrevealed(row, col - 1),
    topLeftIsUnrevealed: isUnrevealed(row - 1, col - 1),
    topRightIsUnrevealed: isUnrevealed(row - 1, col + 1),
    bottomRightIsUnrevealed: isUnrevealed(row + 1, col + 1),
    bottomLeftIsUnrevealed: isUnrevealed(row + 1, col - 1),
  };
}

function SkinCell({
  skin,
  id,
  grid,
  gridSize,
  compact,
}: {
  skin: CellSkin;
  id: number;
  grid: PreviewCell[];
  gridSize: number;
  compact?: boolean;
}) {
  const cell = getCell(grid, id);
  const row = Math.floor(id / gridSize);
  const col = id % gridSize;
  const rowOdd = row % 2 === 0;
  const colOdd = col % 2 === 0;
  const odd = (rowOdd && colOdd) || (!rowOdd && !colOdd);

  const isHiddenOrFlagged =
    cell.status === "hidden" ||
    cell.status === "flagged" ||
    cell.value === "bomb";

  const skinData = getSkin({
    skin,
    row,
    col,
    odd,
    cellValue: cell.value,
    cellStatus: cell.status,
    isHiddenOrFlagged,
    ...getNeighborContext(grid, id, gridSize),
  });
  const { flagEmoji = "🚩", bombEmoji = "💣" } = skinData.definition;

  const content = (() => {
    if (cell.status === "hidden") return "";
    if (cell.status === "flagged") return flagEmoji;
    if (cell.value === "bomb") return bombEmoji;
    if (cell.status === "revealed") {
      return cell.value === 0 ? "" : cell.value;
    }
    return "";
  })();

  const numberColor =
    cell.value === "bomb" ? "text-red-600" : skinData.definition.number[cell.value];

  return (
    <div
      className={cn(
        "box-border flex items-center justify-center select-none font-bold transition-none",
        compact ? "size-8 text-sm" : "size-10 text-base",
        skinData.className,
        numberColor,
      )}
      style={skinData.style}
    >
      {content}
    </div>
  );
}

function PreviewGrid({
  skin,
  grid,
  gridSize,
  compact,
}: {
  skin: CellSkin;
  grid: PreviewCell[];
  gridSize: number;
  compact?: boolean;
}) {
  return (
    <div
      className={cn("inline-grid overflow-hidden")}
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: grid.length }).map((_, index) => (
        <SkinCell
          key={`${skin}-${index}`}
          skin={skin}
          id={index}
          grid={grid}
          gridSize={gridSize}
          compact={compact}
        />
      ))}
    </div>
  );
}

export function CellSkinPreview({ skin }: { skin: CellSkin }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="cursor-pointer p-0 leading-none">
          <PreviewGrid
            skin={skin}
            grid={PREVIEW_2X2_CELLS}
            gridSize={2}
            compact
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <PreviewGrid skin={skin} grid={DEMO_GRID} gridSize={DEMO_GRID_SIZE} />
      </PopoverContent>
    </Popover>
  );
}

export function CellSkinDemoGrid({ skin }: { skin: CellSkin }) {
  return <PreviewGrid skin={skin} grid={DEMO_GRID} gridSize={DEMO_GRID_SIZE} />;
}

export function CellSkinLargeDemoGrid({ skin }: { skin: CellSkin }) {
  return (
    <PreviewGrid
      skin={skin}
      grid={LARGE_DEMO_GRID}
      gridSize={LARGE_DEMO_GRID_SIZE}
    />
  );
}
