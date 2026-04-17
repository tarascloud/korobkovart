import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.artworkId) {
      return NextResponse.json({ error: "artworkId is required" }, { status: 400 });
    }

    const link = await prisma.artworkCollection.create({
      data: {
        artworkId: body.artworkId,
        collectionId: id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error("[Admin API] POST /admin/collections/[id]/artworks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.artworkId) {
      return NextResponse.json({ error: "artworkId is required" }, { status: 400 });
    }

    await prisma.artworkCollection.delete({
      where: {
        artworkId_collectionId: {
          artworkId: body.artworkId,
          collectionId: id,
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Admin API] DELETE /admin/collections/[id]/artworks error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
