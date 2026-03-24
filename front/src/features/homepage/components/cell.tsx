"use client";

import { HEIGHT } from "@/vars";
import { memo } from "react";
import { useCell } from "@/features/homepage/game-provider";
import { cn } from "@/lib/utils";

export const green = "bg-[limegreen] contrast-[0.8]";
export const lightGreen = "bg-[lightgreen] contrast-[0.8]";
const fontSize = "23px";

const getNumberColor = (value: number) => {
  const colors = [
    "",
    "text-blue-600", // 1
    "text-green-600", // 2
    "text-red-600", // 3
    "text-purple-600", // 4
    "text-yellow-600", // 5
    "text-pink-600", // 6
    "text-orange-600", // 7
    "text-gray-600", // 8
  ];
  return colors[value] || "text-black";
};

export const gray = "bg-[tan] contrast-[0.9] transition-none";
export const silver = "bg-[wheat] contrast-[0.9] transition-none";
export const cellRevealed =
  "animate-[cellReveal_0.10s_ease-out] transition-none";
export const flagged = "animate-[flagFall_0.15s] transition-none";
export const bomb = "animate-[bombExplode_0.4s] transition-none";
export const cellWin = "animate-[cellWin_0.6s_ease-out_forwards]";
export const cellWinContent = "animate-[cellWinContent_0.6s_ease-out_forwards]";

function CellComponent({ id }: { id: number }) {
  const { cell, onCellClick } = useCell(id);

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

  const color = isHiddenOrFlagged
    ? odd
      ? green
      : lightGreen
    : odd
      ? gray
      : silver;

  const winColor = odd ? "limegreen" : "lightgreen";

  const content = (() => {
    if (cellData.status === "hidden") return "";
    if (cellData.status === "flagged") return "🚩";
    if (cellData.value === "bomb") return "💣";
    if (cellData.status === "revealed") {
      return cellData.value === 0 ? "" : cellData.value;
    }
    return "";
  })();

  // For winning animation, show what was there before (number or flag) so it can fade out
  const winningContent = (() => {
    if (cellData.status !== "winning") return null;
    if (cellData.value === "bomb") return "🚩"; // Was flagged
    if (typeof cellData.value === "number" && cellData.value > 0)
      return cellData.value;
    return null;
  })();

  // Add revealed class if cell is revealed
  const revealedClass =
    cellData.status === "revealed" && cellData.value !== "bomb"
      ? cellRevealed
      : "";

  const numberColor =
    cellData.value === "bomb" ? "text-red-600" : getNumberColor(cellData.value);

  const size =
    typeof content === "number"
      ? "text-lg font-medium " + getNumberColor(content)
      : "";

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.buttons === 3 || (e.button === 0 && e.buttons === 3)) {
      e.preventDefault();
      if (content === "🚩") return;
      onCellClick(id, "left");
      return;
    }

    if (e.button === 0) {
      if (content === "🚩") return;
      onCellClick(id, "left");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
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
            zIndex: 10000,
            position: "relative",
            display: "inline-block",
            pointerEvents: "none",
            fontSize,
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
            zIndex: 10000,
            position: "relative",
            display: "inline-block",
            pointerEvents: "none",
            fontSize,
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

  return (
    <div
      className={cn(
        color,
        size,
        revealedClass,
        numberColor,
        isWinning && cellWin,
        `box-border w-[15px] h-[15px] md:w-[25px] md:h-[25px] lg:w-[30px] lg:h-[30px] xl:w-[37.5px] xl:h-[37.5px] 2xl:w-[45px] 2xl:h-[45px] flex items-center justify-center select-none relative text-[23px] font-bold`,
      )}
      style={
        isWinning
          ? ({ "--win-color": winColor } as React.CSSProperties)
          : undefined
      }
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
