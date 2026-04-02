import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Minesweeper - Free Online Puzzle Game";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: i % 2 === 0 ? "#4ade80" : "#86efac",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                }}
              >
                {i === 2 ? "💣" : i === 4 ? "🚩" : ""}
              </div>
            ))}
          </div>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              margin: "0",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Minesweeper
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.9)",
              margin: "0",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Free Online Puzzle Game with Skins & Leaderboards
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "white",
                fontSize: "18px",
              }}
            >
              No Download
            </span>
            <span
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "white",
                fontSize: "18px",
              }}
            >
              20+ Skins
            </span>
            <span
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                padding: "8px 20px",
                borderRadius: "20px",
                color: "white",
                fontSize: "18px",
              }}
            >
              Global Rankings
            </span>
          </div>
        </div>
        <p
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          minesweeper.fr
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
