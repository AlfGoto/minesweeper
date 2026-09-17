import type { Cell } from "@/types/game";

// Matches front/src/vars.ts BOMBS_PERCENTAGE — same mine density as the real game.
const MINE_DENSITY = 0.4;
const MIN_REVEALED_FRACTION = 0.1;
const MAX_ATTEMPTS = 100;
const CLICK_COUNT = 35;
// Cells within this many rows/cols of an edge are weighted to hold more
// mines — the flood-filled area tends to sit toward the middle, so without
// this the outer edge of the frame reads as comparatively empty.
const EDGE_MARGIN = 2;
const EDGE_MINE_WEIGHT = 2.5;

function mulberry32(seed: number) {
  let state = seed;
  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export type RealisticBoard = {
  grid: Cell[];
  revealOrder: number[];
  flaggedIndices: number[];
};

/**
 * Generates an actual playable-looking minesweeper board (real mine density,
 * correct adjacency counts, and a real flood-fill reveal from a 0-cell) so
 * the video's board reads as a real game instead of a stamped decorative
 * pattern. Deterministic for a given size so every skin renders the same
 * board.
 */
export function generateRealisticBoard(
  cols: number,
  rows: number,
  seed = 1337,
): RealisticBoard {
  const total = cols * rows;
  const mineCount = Math.round(total * MINE_DENSITY);

  const neighborsOf = (idx: number): number[] => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const out: number[] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        out.push(nr * cols + nc);
      }
    }
    return out;
  };

  const weightOf = (idx: number): number => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    const distToEdge = Math.min(r, rows - 1 - r, c, cols - 1 - c);
    return distToEdge < EDGE_MARGIN ? EDGE_MINE_WEIGHT : 1;
  };

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const rng = mulberry32(seed + attempt * 7919);

    // Weighted sample without replacement (Efraimidis-Spirakis): each cell
    // gets a key = rand^(1/weight); the mineCount largest keys are chosen.
    // A plain uniform shuffle would spread mines evenly, including thinning
    // them out right at the border.
    const keyed = Array.from({ length: total }, (_, i) => ({
      i,
      key: Math.pow(rng(), 1 / weightOf(i)),
    }));
    keyed.sort((a, b) => b.key - a.key);

    const isMine = new Array<boolean>(total).fill(false);
    for (let i = 0; i < mineCount; i++) isMine[keyed[i].i] = true;

    const counts = new Array<number>(total).fill(0);
    for (let i = 0; i < total; i++) {
      if (isMine[i]) continue;
      counts[i] = neighborsOf(i).filter((n) => isMine[n]).length;
    }

    // Generate many separate "clicks" instead of revealing every zero-region.
    // Each click starts from a safe unrevealed cell and performs a normal
    // Minesweeper reveal/flood-fill.
    const revealed = new Array<boolean>(total).fill(false);
    const revealOrder: number[] = [];

    const safeCells = shuffle(
      Array.from({ length: total }, (_, i) => i).filter((i) => !isMine[i]),
      rng,
    );

    const clicked = new Set<number>();

    for (const seed of safeCells) {
      if (clicked.size >= CLICK_COUNT) break;
      if (revealed[seed]) continue;

      clicked.add(seed);

      const queue = [seed];
      revealed[seed] = true;

      for (let qi = 0; qi < queue.length; qi++) {
        const cur = queue[qi];

        revealOrder.push(cur);

        // Normal Minesweeper behavior:
        // only zeroes continue the flood-fill.
        if (counts[cur] !== 0) continue;

        for (const n of neighborsOf(cur)) {
          if (isMine[n] || revealed[n]) continue;

          revealed[n] = true;
          queue.push(n);
        }
      }
    }

    const borderMines = new Set<number>();
    for (const idx of revealOrder) {
      for (const n of neighborsOf(idx)) {
        if (isMine[n]) borderMines.add(n);
      }
    }
    const flagCandidates = shuffle(Array.from(borderMines), rng);
    const flagCount = Math.min(
      flagCandidates.length,
      Math.max(3, Math.round(mineCount * 0.12)),
    );
    const flaggedIndices = flagCandidates.slice(0, flagCount);
    const flaggedSet = new Set(flaggedIndices);

    const grid: Cell[] = Array.from({ length: total }, (_, i) => {
      if (isMine[i]) {
        return {
          status: flaggedSet.has(i) ? "flagged" : "hidden",
          value: "bomb",
        };
      }
      if (revealed[i]) {
        return {
          status: "revealed",
          value: counts[i] as Cell["value"],
        };
      }
      return { status: "hidden", value: 0 };
    });

    return { grid, revealOrder, flaggedIndices };
  }

  return {
    grid: Array.from({ length: total }, () => ({
      status: "hidden",
      value: 0,
    })),
    revealOrder: [],
    flaggedIndices: [],
  };
}
