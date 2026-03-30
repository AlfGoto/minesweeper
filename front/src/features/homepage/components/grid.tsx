"use client";

import type { CellSkin } from "@/types/bff";
import { TOTAL_CELLS } from "@/vars";
import Cell from "./cell";

export default function Grid({ selectedCellSkin }: { selectedCellSkin: CellSkin }) {
  return (
    <div className="shadow-lg rounded-lg p-4">
      <div
        className="[container-type:size] box-border [display:grid] aspect-square w-[min(900px,min(94vw,calc(100dvh-7rem)))] grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] overflow-hidden"
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
          <Cell key={index} id={index} selectedCellSkin={selectedCellSkin} />
        ))}
      </div>
    </div>
  );
}
