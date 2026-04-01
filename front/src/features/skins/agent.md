# Minesweeper Cell Skins - Standalone Agent Brief

You are creating new cell skins for the Minesweeper frontend. This document is
intentionally self-contained so you can work without extra context.

## Mission

When this brief is invoked, create **4 additional cell skins** on top of whatever
already exists in `NonPublishedCellSkins`.

Each run should append new skins; do not replace or rewrite prior experiments
unless explicitly asked.

Create exactly **4 new cell skins for this run**:

1. **Three skins** with fully new concepts/themes.
2. **One skin** that introduces a **new visual mechanic** that does not exist in
   currently published skins.

Take your time to think about unique themes before writing code. Avoid generic
rethemes.

## Files You Must Use

- Skin source: `src/features/skins/cell-skins.ts`
- Preview page: `src/features/skins/index.tsx` and
  `src/features/skins/components/cell-skins-gallery.tsx`
- Gameplay renderer depends on `getSkin(...)` in `cell-skins.ts`.

## Where To Add New Skins

Add all new work-in-progress skins into:

- `NonPublishedCellSkins` in `cell-skins.ts`

Do not put new experiments directly into `CellSkins` until validated.

## Incremental Run Contract (Important)

Treat every citation/use of this file as a new iteration:

- Add 4 **new unique keys** each run.
- Never reuse names from prior runs.
- Keep existing `NonPublishedCellSkins` entries unless a separate instruction
  asks to clean up, rename, or remove them.
- If there are already `N` non-published skins, after the run there should be
  `N + 4`.
- Keep exactly one of the 4 new skins marked as the "new mechanic" skin.

## Required Skin Shape

Every skin entry must follow the same shape:

- `green`
- `lightGreen`
- `gray`
- `silver`
- `number` map for `0..8`

Optional:

- `flagEmoji`
- `bombEmoji`
- `getOverlayClass(context)`
- `getOverlayStyle(context)`

Keep `gray` and `silver` with `transition-none`.

## Theme Quality Rules

A good skin is a coherent world, not a random texture pack.

- Themes similar to existing ones are fine as long as the skin itself is really
  different (distinct overlays, colors, mechanic, mood). Don't reject a concept
  just because another skin shares the same broad category.
- Hidden cells, revealed cells, emoji, and accents must feel like one universe.
- The board is viewed from a **top-down / bird's-eye perspective** (camera
  looking straight down). Design every skin as if the scene is seen from the
  sky: textures, lighting, and motifs should read as a ground plane, not a
  vertical wall.
- Design for the **board view first**, not zoomed-in single-cell beauty.
- Example quality bar:
  - `igloo`: snowy hidden cells, icy/revealed vibe, snowman flag.
  - `flowerfloor`: organic floral ambiance everywhere.
- Keep number readability and gameplay clarity as highest priority.
- Effects must look intentional across neighboring cells, not isolated per-cell
  noise.
- Prefer deterministic row/column phase systems (bands, seams, flows, clusters)
  over scattered decorative dots.

## Composition-First Rules (Mandatory)

Before finalizing a skin, verify these composition constraints:

1. **Neighborhood coherence**
   - Adjacent cells must visually connect (edge logic, shared direction, or
     repeating phase) so groups read as one pattern.
2. **Dual-state identity**
   - Hidden and revealed states must both belong to the same theme, with clear
     gameplay contrast.
3. **No micro-noise dependency**
   - The skin must still look strong when tiny random details are removed.
4. **Readable at gameplay scale**
   - Numbers/emoji remain legible against all major background regions.
5. **10x10 sanity check**
   - The board should look intentional when scanned as a whole, not like
     unrelated tiles.

## New Mechanic Skin Requirement (1 of 4)

One skin must add a new visual mechanic not used in existing skins. Examples:

- Directional reveal flow tied to nearest unrevealed edges.
- Seam-connected pattern bands that only appear when multiple revealed cells
  form clusters.
- Multi-layer parallax illusion using deterministic offsets based on `row/col`.
- Context-aware symbol substitution where adjacent states alter motif geometry.

Mechanic must still be deterministic and readable.

## Determinism and Safety

- Do not use raw `Math.random()` directly in render path.
- Use deterministic seeded randomness (based on `row`/`col`) when needed.
- Avoid bleed artifacts: prefer `backgroundRepeat: "no-repeat"` for generated
  overlays.
- Keep bomb and flag emojis distinct if both are customized.

## Practical Workflow

1. Propose at least 6 candidate themes privately, choose the strongest 4.
2. Implement 4 additional skins in `NonPublishedCellSkins` (append-only).
3. Ensure one of them is explicitly marked and designed as the "new mechanic"
   skin.
4. Validate quickly in preview:
   - readability of numbers and symbols
   - clear hidden vs revealed contrast
   - no weird seams between adjacent cells
   - strong board-level composition in 5x5 and 10x10 views
5. Refine names and comments for maintainability.

## Output Expectations

- Deliver code changes only (no pseudo-code).
- Add concise comments only where logic is non-obvious.
- Keep style performant and avoid over-complex CSS that harms frame rate.

## If New Skin Names Are Needed

If you add totally new skin keys and type errors appear, update the relevant
skin name types (currently derived from API-generated types) so the project can
compile.
