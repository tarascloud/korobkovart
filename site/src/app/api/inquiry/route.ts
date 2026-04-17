import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  // PUBLIC: inquiry/purchase endpoint — allows guest submissions
  try {
    const body = await req.json();
    const { name, email, subject, message, type } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("[Inquiry]", { name, email, subject, message, type });

    // For purchase requests, try to create an Order in DB if user is logged in
    if (type === "purchase") {
      const session = await auth();
      const userId = session?.user?.id;

      if (userId && body.artworkId) {
        // Verify artwork exists
        const artwork = await prisma.artwork.findUnique({
          where: { id: body.artworkId },
        });

        if (artwork) {
          const order = await prisma.order.create({
            data: {
              userId,
              artworkId: artwork.id,
              status: "INQUIRY",
              carrierName: body.carrier || null,
              shippingCost: body.shippingCost
                ? Math.round(Number(body.shippingCost) * 100)
                : null,
              notes: message,
            },
          });

          await sendTelegramNotification(
            `\u{1F3A8} <b>New Purchase Inquiry</b>\n\n` +
              `Artwork: ${artwork.title}\n` +
              `Buyer: ${name} (${email})\n` +
              `Carrier: ${body.carrier || "N/A"}\n` +
              `Shipping: \u20AC${body.shippingCost || "N/A"}\n` +
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
