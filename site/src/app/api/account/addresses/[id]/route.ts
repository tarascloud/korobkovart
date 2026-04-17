import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

async function requireAuthApi() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAuthApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId: session.user!.id as string },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user!.id as string, isDefault: true, id: { not: id } },
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
  const session = await requireAuthApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.address.findFirst({
    where: { id, userId: session.user!.id as string },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });

  // If deleted was default, make another one default
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: session.user!.id as string },
    });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
