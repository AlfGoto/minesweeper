"use client";

import { TOTAL_CELLS } from "@/vars";
import Cell from "./cell";

export default function Grid() {
  return (
    <div className="shadow-lg rounded-lg p-4">
      <div className="flex flex-wrap box-border h-[300px] w-[300px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px] xl:h-[750px] xl:w-[750px] 2xl:h-[900px] 2xl:w-[900px]">
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => (
          <Cell key={index} id={index} />
        ))}
      </div>
    </div>
  );
}
