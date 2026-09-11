"use client";

import type { CellSkin } from "@/types/bff";
import { TOTAL_CELLS } from "@/vars";
import Cell from "./cell";

export default function Grid({ selectedCellSkin }: { selectedCellSkin: CellSkin }) {
  return (
    <div
      className="order-2 md:order-none md:shadow-lg md:rounded-lg md:p-4"
      onContextMenu={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="[container-type:size] box-border [display:grid] aspect-square w-[min(calc(100vw-2rem),calc(100dvh-9rem))] md:w-[min(900px,min(94vw,calc(100dvh-7rem)))] grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] overflow-hidden"
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
          <Cell key={index} id={index} selectedCellSkin={selectedCellSkin} />
        ))}
      </div>
    </div>
  );
}
