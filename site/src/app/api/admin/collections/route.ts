import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const createCollectionSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  descriptionEn: z.string().max(5000).nullable().optional(),
  descriptionEs: z.string().max(5000).nullable().optional(),
  descriptionUa: z.string().max(5000).nullable().optional(),
  coverImagePath: z.string().max(500).nullable().optional(),
  sortOrder: z.coerce.number().int().optional().default(0),
});

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
    const parsed = createCollectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        descriptionEn: data.descriptionEn ?? null,
        descriptionEs: data.descriptionEs ?? null,
        descriptionUa: data.descriptionUa ?? null,
        coverImagePath: data.coverImagePath ?? null,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (err) {
    console.error("[Admin API] POST /admin/collections error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
