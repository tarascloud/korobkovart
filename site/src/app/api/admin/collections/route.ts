import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const collections = await prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: { artworks: { include: { artwork: true } } },
    });

    const mapped = collections.map((c: typeof collections[number]) => ({
      ...c,
      artworkCount: c.artworks.length,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("[Admin API] GET /admin/collections error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await request.json();

    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        name: body.name,
        slug: body.slug,
        descriptionEn: body.descriptionEn || null,
        descriptionEs: body.descriptionEs || null,
        descriptionUa: body.descriptionUa || null,
        coverImagePath: body.coverImagePath || null,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (err) {
    console.error("[Admin API] POST /admin/collections error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
