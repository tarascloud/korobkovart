import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const createArtworkSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  year: z.coerce.number().int().min(1900).max(2100),
  series: z.enum(["podilia", "destruction", "murals", "graphics", "earlier"]),
  medium: z.string().min(1).max(300),
  dimensions: z.string().min(1).max(200),
  status: z.enum(["available", "sold", "on_exhibition", "exists"]).optional().default("available"),
  imagePath: z.string().min(1),
  descriptionEn: z.string().max(5000).nullable().optional(),
  descriptionEs: z.string().max(5000).nullable().optional(),
  descriptionUa: z.string().max(5000).nullable().optional(),
  collaborator: z.string().max(200).nullable().optional(),
  limitedEditionTotal: z.coerce.number().int().min(1).nullable().optional(),
  limitedEditionAvailable: z.coerce.number().int().min(0).nullable().optional(),
  featured: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().optional().default(0),
  price: z.coerce.number().int().min(0).max(100_000_00).nullable().optional(),
});

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
    const parsed = createArtworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const artwork = await prisma.artwork.create({
      data: {
        title: data.title,
        slug: data.slug,
        year: data.year,
        series: data.series,
        medium: data.medium,
        dimensions: data.dimensions,
        status: data.status,
        imagePath: data.imagePath,
        descriptionEn: data.descriptionEn ?? null,
        descriptionEs: data.descriptionEs ?? null,
        descriptionUa: data.descriptionUa ?? null,
        collaborator: data.collaborator ?? null,
        limitedEditionTotal: data.limitedEditionTotal ?? null,
        limitedEditionAvailable: data.limitedEditionAvailable ?? null,
        featured: data.featured,
        sortOrder: data.sortOrder,
        price: data.price ?? null,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (err) {
    console.error("[Admin API] POST /admin/artworks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
