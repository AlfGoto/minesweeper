# Cell Skins Agent Guide

This file explains how AI agents should add or modify cell skins for Minesweeper.

## Goal

Create visually distinct skins while preserving gameplay readability and existing runtime behavior.

## Source of Truth

- Skin definitions live in `cell-skins.ts`.
- Skin selection and rendering happen in `cell.tsx` via `getSkin(...)`.

## Required Skin Shape

Each skin must define:

- `green` (unrevealed checker tile A)
- `lightGreen` (unrevealed checker tile B)
- `gray` (revealed checker tile A)
- `silver` (revealed checker tile B)
- `number` (map for values `0..8`)

Optional:

- `flagEmoji` (emoji for flagged cells, default: `🚩`)
- `bombEmoji` (emoji for revealed bombs, default: `💣`)
- `getOverlayClass(context)` for class-based pattern overlays
- `getOverlayStyle(context)` for dynamic/seeded inline patterns

## Hard Constraints

1. **Do not rename structural keys**
   - Keep exactly: `green`, `lightGreen`, `gray`, `silver`, `number` (plus optional `flagEmoji`, `bombEmoji`).

2. **Keep `transition-none` on revealed states**
   - `gray` and `silver` must include `transition-none`.

3. **Do not hardcode skin selection in `cell.tsx`**
   - Keep `const selectedCellSkin = session?.skins.cells || "default";`

5. **Avoid visual bleed artifacts**
   - For generated overlays, prefer `backgroundRepeat: "no-repeat"`.
   - If needed, keep pattern centers away from borders.

6. **Use distinct emoji when both are customized**
   - If a skin defines both `flagEmoji` and `bombEmoji`, they must be different for gameplay clarity.

## Recommended Workflow

1. Add or update a skin entry in `CellSkins`.
2. If using dynamic randomness:
   - Use deterministic seeded randomness from `row`/`col`.
   - Do not use non-deterministic randomness (`Math.random`) directly per render.
3. Verify in UI that:
   - numbers stay readable,
   - no seams/bleed between cells,
   - unrevealed/revealed contrast remains clear.

## Neighbor Context Utility

- Do not recompute neighbor checks directly in `cell.tsx`.
- Use `getUnrevealedNeighborContext(...)` from `cell-skins.ts`.
- This utility already knows board dimensions (`HEIGHT`) and returns neighbor flags that skins can consume.
- Available neighbor flags in skin context:
  - Cardinal: `topIsUnrevealed`, `rightIsUnrevealed`, `bottomIsUnrevealed`, `leftIsUnrevealed`
  - Diagonal: `topLeftIsUnrevealed`, `topRightIsUnrevealed`, `bottomRightIsUnrevealed`, `bottomLeftIsUnrevealed`
- Keep skin-specific visual logic in skin definitions (`getOverlayClass` / `getOverlayStyle`), not in `cell.tsx`.

## Template

```ts
"my-skin": {
  green: "...",
  lightGreen: "...",
  gray: "... transition-none",
  silver: "... transition-none",
  flagEmoji: "🚩",
  bombEmoji: "💣",
  number: {
    0: "",
    1: "...",
    2: "...",
    3: "...",
    4: "...",
    5: "...",
    6: "...",
    7: "...",
    8: "...",
  },
  getOverlayStyle: ({ row, col, isHiddenOrFlagged }) => {
    if (!isHiddenOrFlagged) return undefined;
    // seeded deterministic style here
    return { backgroundImage: "...", backgroundRepeat: "no-repeat" };
  },
},
```

## Design Notes

- Favor subtle texture over noise overload.
- Cells are small on screen: prioritize bold readable shapes and medium/large motifs over micro-detail.
- Avoid over-detailed overlays that only look good when zoomed; keep effects legible at actual gameplay size.
- Keep bomb/flag and number legibility as top priority.
- Strong styles are fine, but gameplay clarity must win over decoration.
- Design skins as a **group composition**, not as isolated cells.
- Always evaluate how adjacent cells connect (edges, corners, gradients, motifs) so neighborhoods look intentional.
- Prefer patterns that create coherent clusters/flows across the grid rather than random per-cell noise.

## Creative Direction (Current)

- Animations are welcome and encouraged when they add personality (Tailwind animation classes are preferred).
- Keep playful organic overlays inspired by `flowerfloor` (flowers, petals, natural micro-patterns).
- Use deterministic seeded variation so each cell feels alive, but remains stable across renders.
- Prefer subtle-to-medium motion intensity; avoid effects that reduce readability of numbers, flags, or bombs.
