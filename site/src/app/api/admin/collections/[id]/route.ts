import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const updateCollectionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  descriptionEn: z.string().max(5000).nullable().optional(),
  descriptionEs: z.string().max(5000).nullable().optional(),
  descriptionUa: z.string().max(5000).nullable().optional(),
  coverImagePath: z.string().max(500).nullable().optional(),
  sortOrder: z.coerce.number().int().optional(),
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
    const parsed = updateCollectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        descriptionEn: data.descriptionEn ?? undefined,
        descriptionEs: data.descriptionEs ?? undefined,
        descriptionUa: data.descriptionUa ?? undefined,
        coverImagePath: data.coverImagePath ?? undefined,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json(collection);
  } catch (err) {
    console.error("[Admin API] PUT /admin/collections/[id] error:", err);
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
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Admin API] DELETE /admin/collections/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
