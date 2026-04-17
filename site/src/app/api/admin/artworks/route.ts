import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const artworks = await prisma.artwork.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(artworks);
  } catch (err) {
    console.error("[Admin API] GET /admin/artworks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await request.json();

    const { title, slug, year, series, medium, dimensions, status, imagePath } = body;
    if (!title || !slug || !year || !series || !medium || !dimensions || !imagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        slug,
        year: Number(year),
        series,
        medium,
        dimensions,
        status: status || "available",
        imagePath,
        descriptionEn: body.descriptionEn || null,
        descriptionEs: body.descriptionEs || null,
        descriptionUa: body.descriptionUa || null,
        collaborator: body.collaborator || null,
        limitedEditionTotal: body.limitedEditionTotal ? Number(body.limitedEditionTotal) : null,
        limitedEditionAvailable: body.limitedEditionAvailable ? Number(body.limitedEditionAvailable) : null,
        featured: body.featured || false,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
        price: body.price ? Number(body.price) : null,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (err) {
    console.error("[Admin API] POST /admin/artworks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
