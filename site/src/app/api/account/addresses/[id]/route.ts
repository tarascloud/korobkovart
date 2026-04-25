import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const updateAddressSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  country: z.string().min(1).max(100).optional(),
  city: z.string().min(1).max(200).optional(),
  address: z.string().min(1).max(500).optional(),
  zip: z.string().min(1).max(20).optional(),
  phone: z.string().max(30).nullable().optional(),
  isDefault: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateAddressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  // Verify ownership
  const existing = await prisma.address.findFirst({
    where: { id, userId },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: {
      name: data.name,
      country: data.country,
      city: data.city,
      address: data.address,
      zip: data.zip,
      phone: data.phone,
      isDefault: data.isDefault,
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
