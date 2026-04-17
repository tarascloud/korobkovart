import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        descriptionEn: body.descriptionEn ?? undefined,
        descriptionEs: body.descriptionEs ?? undefined,
        descriptionUa: body.descriptionUa ?? undefined,
        coverImagePath: body.coverImagePath ?? undefined,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
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
