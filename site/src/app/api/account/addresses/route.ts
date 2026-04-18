import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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

  if (!body.name || !body.country || !body.city || !body.address || !body.zip) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // If this is the first address or isDefault requested, unset other defaults
  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({ where: { userId } });

  const address = await prisma.address.create({
    data: {
      userId,
      name: body.name,
      country: body.country,
      city: body.city,
      address: body.address,
      zip: body.zip,
      phone: body.phone || null,
      isDefault: body.isDefault || existingCount === 0,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
