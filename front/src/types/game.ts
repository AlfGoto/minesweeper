export type Cell = {
  status: "hidden" | "revealed" | "flagged" | "winning";
  value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | "bomb";
};

export type Grid = Cell[];
