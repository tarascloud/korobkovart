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

    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        year: body.year !== undefined ? Number(body.year) : undefined,
        series: body.series,
        medium: body.medium,
        dimensions: body.dimensions,
        status: body.status,
        imagePath: body.imagePath,
        descriptionEn: body.descriptionEn ?? undefined,
        descriptionEs: body.descriptionEs ?? undefined,
        descriptionUa: body.descriptionUa ?? undefined,
        collaborator: body.collaborator ?? undefined,
        limitedEditionTotal: body.limitedEditionTotal !== undefined ? (body.limitedEditionTotal ? Number(body.limitedEditionTotal) : null) : undefined,
        limitedEditionAvailable: body.limitedEditionAvailable !== undefined ? (body.limitedEditionAvailable ? Number(body.limitedEditionAvailable) : null) : undefined,
        featured: body.featured,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
        price: body.price !== undefined ? (body.price ? Number(body.price) : null) : undefined,
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
