import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["INQUIRY", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();

    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status,
        carrierName: body.carrierName ?? undefined,
        trackingNumber: body.trackingNumber ?? undefined,
        shippingCost: body.shippingCost !== undefined ? (body.shippingCost ? Number(body.shippingCost) : null) : undefined,
        notes: body.notes ?? undefined,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("[Admin API] PUT /admin/orders/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
