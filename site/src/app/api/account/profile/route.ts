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

export async function GET() {
  const session = await requireAuthApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user!.id as string },
    select: { id: true, name: true, email: true, phone: true, image: true },
  });

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await requireAuthApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: session.user!.id as string },
    data: {
      name: body.name ?? undefined,
      phone: body.phone ?? undefined,
    },
    select: { id: true, name: true, email: true, phone: true, image: true },
  });

  return NextResponse.json(user);
}
