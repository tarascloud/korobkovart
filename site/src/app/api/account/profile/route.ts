import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, image: true },
  });

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const { error, userId } = await requireAuthApi();
  if (error) return error;

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: body.name ?? undefined,
      phone: body.phone ?? undefined,
    },
    select: { id: true, name: true, email: true, phone: true, image: true },
  });

  return NextResponse.json(user);
}
