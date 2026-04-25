import { requireAuthApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().max(30).nullable().optional(),
});

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
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
    },
    select: { id: true, name: true, email: true, phone: true, image: true },
  });

  return NextResponse.json(user);
}
