export type Cell = {
  status: "hidden" | "revealed" | "flagged" | "winning";
  value: number | "bomb";
};

export type Grid = Cell[];
