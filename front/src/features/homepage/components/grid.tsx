"use client";

import { TOTAL_CELLS } from "@/vars";
import Cell from "./cell";

export default function Grid() {
  return (
    <div className="shadow-lg rounded-lg p-4">
      <div className="flex flex-wrap box-border h-[300px] w-[300px] md:h-[500px] md:w-[500px] lg:h-[700px] lg:w-[700px]">
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
          <Cell key={index} id={index} />
        ))}
      </div>
    </div>
  );
}
