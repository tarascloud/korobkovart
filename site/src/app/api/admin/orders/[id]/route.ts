import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const updateOrderSchema = z.object({
  status: z.enum(["INQUIRY", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  carrierName: z.string().max(200).nullable().optional(),
  trackingNumber: z.string().max(200).nullable().optional(),
  shippingCost: z.coerce.number().int().min(0).max(100_000_00).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        carrierName: data.carrierName ?? undefined,
        trackingNumber: data.trackingNumber ?? undefined,
        shippingCost: data.shippingCost !== undefined ? data.shippingCost : undefined,
        notes: data.notes ?? undefined,
      },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("[Admin API] PUT /admin/orders/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
