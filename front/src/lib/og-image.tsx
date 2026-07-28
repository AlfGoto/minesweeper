import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

const OG_COLORS = {
  hidden: "#32CD32",
  hiddenAlt: "#90EE90",
  revealed: "#D2B48C",
  revealedAlt: "#F5DEB3",
};

type CellData = {
  isHidden: boolean;
  isOdd: boolean;
  content: string;
};

const GRID_SIZE = 5;
const GRID: CellData[] = [
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: false, isOdd: true, content: "💣" },
  { isHidden: false, isOdd: false, content: "1" },
  { isHidden: false, isOdd: true, content: "2" },
  { isHidden: true, isOdd: false, content: "🚩" },
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: false, isOdd: true, content: "1" },
  { isHidden: false, isOdd: false, content: "2" },
  { isHidden: false, isOdd: true, content: "3" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: false, isOdd: false, content: "1" },
  { isHidden: false, isOdd: true, content: "3" },
  { isHidden: false, isOdd: false, content: "2" },
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: false, isOdd: true, content: "" },
  { isHidden: false, isOdd: false, content: "1" },
  { isHidden: true, isOdd: true, content: "" },
  { isHidden: true, isOdd: false, content: "" },
  { isHidden: true, isOdd: true, content: "" },
];

const NUMBER_COLORS: Record<string, string> = {
  "1": "#2563eb",
  "2": "#16a34a",
  "3": "#dc2626",
};

const getCellColor = (cell: CellData) => {
  if (cell.isHidden) {
    return cell.isOdd ? OG_COLORS.hidden : OG_COLORS.hiddenAlt;
  }
  return cell.isOdd ? OG_COLORS.revealed : OG_COLORS.revealedAlt;
};

export function createOgImage(title: string, description: string) {
  const cellSize = 90;
  const gap = 4;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          padding: "40px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${gap}px`,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                gap: `${gap}px`,
              }}
            >
              {Array.from({ length: GRID_SIZE }).map((_, colIndex) => {
                const cell = GRID[rowIndex * GRID_SIZE + colIndex];
                const content = cell.content;
                const isNumber = ["1", "2", "3"].includes(content);

                return (
                  <div
                    key={colIndex}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: getCellColor(cell),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isNumber ? "42px" : "48px",
                      fontWeight: isNumber ? "bold" : "normal",
                      color: isNumber
                        ? NUMBER_COLORS[content] ?? "#000"
                        : undefined,
                    }}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "500px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: "#0f172a",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            {description}
          </div>
          <div
            style={{
              marginTop: "36px",
              fontSize: "20px",
              color: "#64748b",
            }}
          >
            minesweeper.fr
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}
