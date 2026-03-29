"use client";

import { HEIGHT } from "@/vars";
import { memo } from "react";
import { useCell, useGame } from "@/features/homepage/game-provider";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { CellSkins, getSkin, getUnrevealedNeighborContext } from "./cell-skins";

const cellText = "text-[clamp(10px,2.65cqw,23px)]";

export const cellRevealed =
  "animate-[cellReveal_0.10s_ease-out] transition-none";
export const flagged = "animate-[flagFall_0.15s] transition-none";
export const bomb = "animate-[bombExplode_0.4s] transition-none";
export const cellWin = "animate-[cellWin_0.6s_ease-out_forwards]";
export const cellWinContent = "animate-[cellWinContent_0.6s_ease-out_forwards]";

function CellComponent({ id }: { id: number }) {
  const { cell, onCellClick } = useCell(id);
  const { getCellSnapshot } = useGame();
  const { data: session } = useSession();

  const selectedCellSkin =
    "antic" || session?.skins?.cells || "default";
  const infernoNoFlags = selectedCellSkin === "inferno-hard";

  const cellData = cell || { status: "hidden" as const, value: 0 };

  const row = Math.floor(id / HEIGHT);
  const col = id % HEIGHT;

  const rowOdd = row % 2 === 0;
  const colOdd = col % 2 === 0;

  const isHiddenOrFlagged =
    cellData.status === "hidden" ||
    cellData.status === "flagged" ||
    cellData.value === "bomb";
  const odd = (rowOdd && colOdd) || (!rowOdd && !colOdd);
  const isWinning = cellData.status === "winning";

  const unrevealedNeighborContext = getUnrevealedNeighborContext({
    id,
    getCellSnapshot,
  });

  const skin = getSkin({
    skin: selectedCellSkin,
    row,
    col,
    odd,
    cellValue: cellData.value,
    cellStatus: cellData.status,
    isHiddenOrFlagged,
    ...unrevealedNeighborContext,
  });

  const winColor = odd ? "limegreen" : "lightgreen";
  const { flagEmoji = "🚩", bombEmoji = "💣" } = skin.definition;

  const content = (() => {
    if (cellData.status === "hidden") return "";
    if (cellData.status === "flagged") return flagEmoji;
    if (cellData.value === "bomb") return bombEmoji;
    if (cellData.status === "revealed") {
      return cellData.value === 0 ? "" : cellData.value;
    }
    return "";
  })();

  // For winning animation, show what was there before (number or flag) so it can fade out
  const winningContent = (() => {
    if (cellData.status !== "winning") return null;
    if (cellData.value === "bomb") return flagEmoji; // Was flagged
    if (cellData.value > 0) return cellData.value;
    return null;
  })();

  // Add revealed class if cell is revealed
  const revealedClass =
    cellData.status === "revealed" && cellData.value !== "bomb"
      ? cellRevealed
      : "";

  const numberColor =
    cellData.value === "bomb"
      ? "text-red-600"
      : skin.definition.number[cellData.value];

  const size =
    typeof content === "number"
      ? "font-medium " + skin.definition.number[content]
      : "";

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.buttons === 3 || (e.button === 0 && e.buttons === 3)) {
      e.preventDefault();
      if (cellData.status === "flagged") return;
      onCellClick(id, "left");
      return;
    }

    if (e.button === 0) {
      if (cellData.status === "flagged") return;
      onCellClick(id, "left");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (infernoNoFlags) return;
    if (e.buttons !== 3) {
      onCellClick(id, "right");
    }
  };

  const display = (() => {
    if (cellData.status === "flagged") {
      return (
        <span
          key={`flag-${id}-${cellData.status}`}
          className={flagged}
          style={{
            position: "relative",
            display: "inline-block",
            pointerEvents: "none",
          }}
        >
          {content}
        </span>
      );
    }

    if (cellData.value === "bomb") {
      return (
        <span
          key={`bomb-${id}-${cellData.value}`}
          className={bomb}
          style={{
            position: "relative",
            display: "inline-block",
            pointerEvents: "none",
          }}
        >
          {content}
        </span>
      );
    }

    if (isWinning && winningContent) {
      return (
        <span
          key={`win-${id}`}
          className={cellWinContent}
          style={{
            position: "relative",
            display: "inline-block",
            pointerEvents: "none",
          }}
        >
          {winningContent}
        </span>
      );
    }

    return content;
  })();

  const mergedStyle = {
    ...(skin.style ?? {}),
    ...(isWinning ? ({ "--win-color": winColor } as React.CSSProperties) : {}),
  };

  return (
    <div
      className={cn(
        skin.className,
        cellText,
        size,
        revealedClass,
        numberColor,
        isWinning && cellWin,
        "box-border flex h-full min-h-0 min-w-0 w-full items-center justify-center font-bold select-none relative",
      )}
      style={Object.keys(mergedStyle).length ? mergedStyle : undefined}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {display}
    </div>
  );
}

// Memoize the component - it will only re-render when props.id changes
// The useCell hook will return the same cell reference if the data hasn't changed
// (thanks to the updateCell/updateCells logic preserving references)
export default memo(CellComponent);
