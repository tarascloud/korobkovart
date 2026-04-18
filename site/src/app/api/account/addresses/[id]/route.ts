import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      name: body.name ?? undefined,
      country: body.country ?? undefined,
      city: body.city ?? undefined,
      address: body.address ?? undefined,
      zip: body.zip ?? undefined,
      phone: body.phone ?? undefined,
      isDefault: body.isDefault ?? undefined,
    },
  });

  return NextResponse.json(address);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.address.findFirst({
    where: { id, userId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });

  // If deleted was default, make another one default
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId },
    });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
