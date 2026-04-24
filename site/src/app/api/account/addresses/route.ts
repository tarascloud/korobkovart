import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const createAddressSchema = z.object({
  name: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  city: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  zip: z.string().min(1).max(20),
  phone: z.string().max(30).nullable().optional(),
  isDefault: z.boolean().optional().default(false),
});

export async function GET() {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(request: NextRequest) {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const body = await request.json();
  const parsed = createAddressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  // If this is the first address or isDefault requested, unset other defaults
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({ where: { userId } });

  const address = await prisma.address.create({
    data: {
      userId,
      name: data.name,
      country: data.country,
      city: data.city,
      address: data.address,
      zip: data.zip,
      phone: data.phone ?? null,
      isDefault: data.isDefault || existingCount === 0,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
