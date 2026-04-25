import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const updateArtworkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  series: z.enum(["podilia", "destruction", "murals", "graphics", "earlier"]).optional(),
  medium: z.string().min(1).max(300).optional(),
  dimensions: z.string().min(1).max(200).optional(),
  status: z.enum(["available", "sold", "on_exhibition", "exists"]).optional(),
  imagePath: z.string().min(1).optional(),
  descriptionEn: z.string().max(5000).nullable().optional(),
  descriptionEs: z.string().max(5000).nullable().optional(),
  descriptionUa: z.string().max(5000).nullable().optional(),
  collaborator: z.string().max(200).nullable().optional(),
  limitedEditionTotal: z.coerce.number().int().min(1).nullable().optional(),
  limitedEditionAvailable: z.coerce.number().int().min(0).nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  price: z.coerce.number().int().min(0).max(100_000_00).nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateArtworkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        year: data.year,
        series: data.series,
        medium: data.medium,
        dimensions: data.dimensions,
        status: data.status,
        imagePath: data.imagePath,
        descriptionEn: data.descriptionEn ?? undefined,
        descriptionEs: data.descriptionEs ?? undefined,
        descriptionUa: data.descriptionUa ?? undefined,
        collaborator: data.collaborator ?? undefined,
        limitedEditionTotal: data.limitedEditionTotal,
        limitedEditionAvailable: data.limitedEditionAvailable,
        featured: data.featured,
        sortOrder: data.sortOrder,
        price: data.price,
      },
    });

    return NextResponse.json(artwork);
  } catch (err) {
    console.error("[Admin API] PUT /admin/artworks/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;

    const orderCount = await prisma.order.count({ where: { artworkId: id } });
    if (orderCount > 0) {
      return NextResponse.json({ error: "Cannot delete artwork with existing orders" }, { status: 409 });
    }

    await prisma.artwork.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Admin API] DELETE /admin/artworks/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
