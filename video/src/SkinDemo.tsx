import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { CellSkin } from "@/types/bff";
import type { Cell } from "@/types/game";
import { PreviewGrid } from "@/features/shared/components/cell-skin-preview";
import { generateRealisticBoard } from "./generate-board";
import type { SkinDemoProps } from "./skin-types";

// Native pixel size PreviewGrid renders cells at on the real site (size-10 = 40px).
const CELL_PX_NATIVE = 40;
// Rendered cell size once scaled up, tuned for the higher-res canvas.
const TARGET_CELL_PX = 130;
const SCALE = TARGET_CELL_PX / CELL_PX_NATIVE;

export const SkinDemo: React.FC<SkinDemoProps> = ({ skin }) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();

  // Tile the site's demo pattern to however many cells are needed to cover
  // the whole frame edge-to-edge, keeping cells square (no crop/stretch).
  const cols = Math.ceil(width / TARGET_CELL_PX);
  const rows = Math.ceil(height / TARGET_CELL_PX);
  const boardWidthPx = cols * CELL_PX_NATIVE;
  const boardHeightPx = rows * CELL_PX_NATIVE;

  const { grid: solvedGrid, revealOrder, flaggedIndices } = React.useMemo(
    () => generateRealisticBoard(cols, rows),
    [cols, rows],
  );

  const revealStart = fps * 0.6;
  const revealStagger = 1;
  const flagStagger = 4;
  const flagStart = revealStart + revealOrder.length * revealStagger + 15;

  const revealFrameOf = React.useMemo(() => {
    const map = new Map<number, number>();
    revealOrder.forEach((idx, order) => {
      map.set(idx, revealStart + order * revealStagger);
    });
    return map;
  }, [revealOrder, revealStart]);

  const flagFrameOf = React.useMemo(() => {
    const map = new Map<number, number>();
    flaggedIndices.forEach((idx, order) => {
      map.set(idx, flagStart + order * flagStagger);
    });
    return map;
  }, [flaggedIndices, flagStart]);

  const animatedGrid: Cell[] = solvedGrid.map((cell, i) => {
    if (cell.status === "flagged") {
      const readyAt = flagFrameOf.get(i) ?? 0;
      return frame >= readyAt ? cell : { status: "hidden", value: "bomb" };
    }
    if (cell.status === "revealed") {
      const readyAt = revealFrameOf.get(i);
      const isRevealed = readyAt !== undefined && frame >= readyAt;
      return isRevealed ? cell : { status: "hidden", value: 0 };
    }
    return cell;
  });

  const titleProgress = spring({ frame, fps, config: { damping: 200 } });

  const ctaStart = durationInFrames - fps * 3;
  const ctaProgress = spring({
    frame: frame - ctaStart,
    fps,
    config: { damping: 200 },
  });

  const titleOpacity = titleProgress * (1 - ctaProgress);

  return (
    <AbsoluteFill className="bg-neutral-900" style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: boardWidthPx,
          height: boardHeightPx,
          transform: `translate(-50%, -50%) scale(${SCALE})`,
        }}
      >
        <PreviewGrid
          skin={skin.id as CellSkin}
          grid={animatedGrid}
          gridSize={cols}
          rows={rows}
        />
      </div>

      {/* Full-screen layer so the radial fade reaches full transparency
          before any edge — a bounded box would clip it into a hard line. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 9,
          opacity: titleOpacity,
          background: `radial-gradient(ellipse ${width * 0.65}px ${height * 0.29}px at 50% ${height * 0.16}px, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.32,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
        }}
      >
        <div className="text-center">
          <div className="text-white/70 text-2xl tracking-widest uppercase">
            Cell skin
          </div>
          <div className="text-white text-6xl font-bold mt-1">
            {skin.name}
          </div>
        </div>
      </div>

      {frame >= ctaStart && (
        <Sequence from={ctaStart} name="cta">
          <AbsoluteFill
            className="flex flex-col items-center justify-center"
            style={{
              zIndex: 20,
              opacity: ctaProgress,
              background: "rgba(0,0,0,0.78)",
            }}
          >
            <div
              style={{
                transform: `translateY(${interpolate(ctaProgress, [0, 1], [30, 0])}px)`,
              }}
              className="text-center px-12"
            >
              <div className="text-white text-5xl font-bold mb-4">
                Get the {skin.name} skin
              </div>
              <div className="text-white/90 text-4xl">
                at{" "}
                <span className="font-bold underline decoration-4">
                  minesweeper.fr
                </span>
              </div>
            </div>
          </AbsoluteFill>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
