import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { getAbsoluteImageUrl } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const artwork = await prisma.artwork.findUnique({ where: { slug } });

  if (!artwork) {
    return new Response("Not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          backgroundColor: "#f5f5f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Left: artwork image */}
        <div style={{ width: "630px", height: "630px", display: "flex" }}>
          <img
            src={getAbsoluteImageUrl(artwork.imagePath)}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        {/* Right: details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#666",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Korobkov Art Studio
          </div>
          <div
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#1a1a1a",
              lineHeight: 1.2,
              marginBottom: "24px",
            }}
          >
            {artwork.title}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#666",
              marginBottom: "8px",
            }}
          >
            {artwork.year} · {artwork.medium}
          </div>
          <div style={{ fontSize: "16px", color: "#888" }}>
            {artwork.dimensions}
          </div>
          {artwork.status === "available" && (
            <div
              style={{
                fontSize: "14px",
                color: "#16a34a",
                marginTop: "24px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Available for purchase
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
