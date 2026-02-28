"use client";

import { TOTAL_CELLS } from "@/vars";
import Cell from "./cell";

export default function Grid() {
  return (
    <div className="shadow-lg rounded-lg p-4">
      <div className="flex flex-wrap box-border h-[700px] w-[700px]">
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
          <Cell key={index} id={index} />
        ))}
      </div>
    </div>
  );
}
