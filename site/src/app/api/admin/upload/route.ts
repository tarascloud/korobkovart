import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/api-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files allowed" },
        { status: 400 },
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }

    const slug = (formData.get("slug") as string) || Date.now().toString();
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();

    const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif"];
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 },
      );
    }
    // Sanitize filename — only allow alphanumeric, hyphens, underscores
    const safeSlug = slug.replace(/[^a-zA-Z0-9_-]/g, "-");
    const filename = `${safeSlug}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const artworksDir = path.join(process.cwd(), "public", "artworks");
    await mkdir(artworksDir, { recursive: true });

    const uploadPath = path.join(artworksDir, filename);
    await writeFile(uploadPath, buffer);

    return NextResponse.json({ path: `/artworks/${filename}` });
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
