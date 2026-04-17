import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Korobkov Art Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1a1a1a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: 80, height: 2, backgroundColor: "#d4a574", marginBottom: 32 }} />
        <div style={{ fontSize: 72, fontWeight: 700, color: "#ffffff", letterSpacing: -1 }}>
          Korobkov Art Studio
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#999999",
            marginTop: 16,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Contemporary Ukrainian Art
        </div>
        <div style={{ display: "flex", width: 80, height: 2, backgroundColor: "#d4a574", marginTop: 32 }} />
        <div style={{ fontSize: 16, color: "#666666", marginTop: 24 }}>ko.taras.cloud</div>
      </div>
    ),
    { ...size }
  );
}
