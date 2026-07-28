import { ImageResponse } from "next/og";
import {
  backgroundSkins,
  getBackgroundSkinMetaBySlug,
} from "@/features/skins/backgrounds";

export const runtime = "edge";

export const alt = "Minesweeper Background Skin Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ skinName: string; locale: string }>;
}) {
  const { skinName, locale } = await params;
  const skinMeta = getBackgroundSkinMetaBySlug(skinName, locale);

  if (!skinMeta) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 48,
          }}
        >
          Background Not Found
        </div>
      ),
      { ...size }
    );
  }

  const skinDef = Object.values(backgroundSkins).find(
    (s) => s.slug === skinName
  );
  const ogColor = skinDef?.ogColor ?? "#f8fafc";

  const isLight =
    ogColor.toLowerCase() === "#ffffff" ||
    ogColor.toLowerCase() === "#f8fafc" ||
    ogColor.toLowerCase() === "#dbeafe" ||
    ogColor.toLowerCase() === "#b9eb86" ||
    ogColor.toLowerCase() === "#fde68a";

  const textColor = isLight ? "#0f172a" : "#ffffff";
  const subtextColor = isLight ? "#475569" : "rgba(255,255,255,0.8)";
  const cardBg = isLight ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.4)";
  const cardBorder = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)";

  return new ImageResponse(
    (
      <div
        style={{
          background: ogColor,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cardBg,
            border: `2px solid ${cardBorder}`,
            borderRadius: "32px",
            padding: "50px 70px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: subtextColor,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "16px",
            }}
          >
            Background Skin
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
              color: textColor,
              lineHeight: 1.1,
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            {skinMeta.name}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: subtextColor,
              lineHeight: 1.5,
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            {skinMeta.description.length > 100
              ? skinMeta.description.slice(0, 97) + "..."
              : skinMeta.description}
          </div>
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "#22c55e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              💣
            </div>
            <div
              style={{
                fontSize: "20px",
                color: subtextColor,
              }}
            >
              minesweeper.fr
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
