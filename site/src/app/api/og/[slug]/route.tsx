import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getAbsoluteImageUrl } from "@/lib/r2";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/**
 * Load the artwork image and return it as a base64 data URL.
 *
 * Satori (ImageResponse) cannot reliably fetch the image itself: a self-fetch
 * to https://ko.taras.cloud from inside the container loops back through
 * Cloudflare and fails/hangs. Instead we read the file from /public directly
 * (or fetch from R2 when R2_PUBLIC_URL is configured) and embed it inline.
 */
async function loadImageDataUrl(imagePath: string): Promise<string | null> {
  try {
    if (process.env.R2_PUBLIC_URL) {
      const res = await fetch(getAbsoluteImageUrl(imagePath));
      if (!res.ok) return null;
      const buf = Buffer.from(await res.arrayBuffer());
      const mime = res.headers.get("content-type") || "image/jpeg";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }

    const publicDir = path.join(process.cwd(), "public");
    const resolved = path.resolve(publicDir, imagePath.replace(/^\/+/, ""));
    // Path traversal guard: imagePath comes from DB, but stay defensive.
    if (!resolved.startsWith(publicDir + path.sep)) return null;

    const buf = await readFile(resolved);
    const mime = MIME_BY_EXT[path.extname(resolved).toLowerCase()] || "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Static brand fallback — returned on any render error instead of a 502. */
function brandFallbackImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#666",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          Korobkov
        </div>
        <div style={{ fontSize: "48px", fontWeight: 800, color: "#1a1a1a" }}>
          Korobkov Art Studio
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const artwork = await prisma.artwork.findUnique({ where: { slug } });

    if (!artwork) {
      return new Response("Not found", { status: 404 });
    }

    const imageSrc = await loadImageDataUrl(artwork.imagePath);

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
          {imageSrc && (
            <div style={{ width: "630px", height: "630px", display: "flex" }}>
              <img
                src={imageSrc}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}
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
              {`${artwork.year} · ${artwork.medium}`}
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
  } catch (err) {
    console.error("[og] render failed, serving brand fallback:", err);
    return brandFallbackImage();
  }
}
