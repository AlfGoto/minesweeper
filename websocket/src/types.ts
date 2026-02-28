
export type Cell = {
  status: "hidden" | "revealed" | "flagged";
  value: number | "bomb";
};

export type Grid = Cell[];

export type ClientMessage =
  | { type: "LEFT_CLICK"; id: number }
  | { type: "RIGHT_CLICK"; id: number }
  | { type: "RESTART"; }
  | { type: "LOGIN"; userEmail: string; userName: string; userPicture: string };

export type ServerMessage =
  | { type: "INIT"; payload: string; connectionId: string }
  | { type: "UPDATE"; payload: Payloads }
  | { type: "ERROR"; message: string };

export type Payloads = RevealPayload | FlagPayload | WinPayload | LosePayload; 

export type RevealPayload = {
  type: "REVEAL";
  id: number;
  value: number | "bomb";
};

export type FlagPayload = {
  type: "FLAG";
  id: number;
  flagged: boolean;
};

export type WinPayload = {
  type: "WIN";
  flags: number;
  reveals: number;
  time: number;
};

export type LosePayload = {
  type: "LOSE";
  flags: number;
  reveals: number;
  time: number;
  grid: Grid;
};