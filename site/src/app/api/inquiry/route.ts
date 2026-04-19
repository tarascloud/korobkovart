import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const InquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(2000),
  subject: z.string().max(200).optional(),
  type: z.enum(["inquiry", "purchase"]).optional(),
  artworkId: z.string().uuid().optional(),
  carrier: z.string().max(50).optional(),
  shippingCost: z.coerce.number().min(0).max(10000).optional(),
});

export async function POST(req: NextRequest) {
  // PUBLIC: inquiry/purchase endpoint — allows guest submissions
  // Rate-limited (10/min/IP) + zod-validated to prevent email/Telegram spam.
  try {
    const headersList = await headers();
    const ip = getClientIp(headersList);

    if (!checkRateLimit("inquiry", ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = InquirySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      subject,
      message,
      type,
      artworkId,
      carrier,
      shippingCost,
    } = parsed.data;

    console.log("[Inquiry]", { name, email, subject, type, ip });

    // For purchase requests, try to create an Order in DB if user is logged in
    if (type === "purchase") {
      const session = await auth();
      const userId = session?.user?.id;

      if (userId && artworkId) {
        const artwork = await prisma.artwork.findUnique({
          where: { id: artworkId },
        });

        if (artwork) {
          const order = await prisma.order.create({
            data: {
              userId,
              artworkId: artwork.id,
              status: "INQUIRY",
              carrierName: carrier || null,
              shippingCost:
                shippingCost !== undefined
                  ? Math.round(shippingCost * 100)
                  : null,
              notes: message,
            },
          });

          await sendTelegramNotification(
            `\u{1F3A8} <b>New Purchase Inquiry</b>\n\n` +
              `Artwork: ${artwork.title}\n` +
              `Buyer: ${name} (${email})\n` +
              `Carrier: ${carrier || "N/A"}\n` +
              `Shipping: \u20AC${shippingCost ?? "N/A"}\n` +
              `Order: #${order.id.slice(-8).toUpperCase()}`
          );

          return NextResponse.json({ success: true, orderId: order.id });
        }
      }

      // Guest purchase or artwork not found — return success without DB order
      return NextResponse.json({ success: true });
    }

    await sendTelegramNotification(
      `\u{1F4E9} <b>New Inquiry</b>\n\n` +
        `From: ${name} (${email})\n` +
        `Subject: ${subject || "N/A"}\n` +
        `Message: ${message.substring(0, 200)}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Inquiry] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
