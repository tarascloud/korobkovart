import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const updateSettingsSchema = z.object({
  siteName: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(200).optional(),
  instagram: z.string().max(200).optional(),
  tgBotToken: z.string().max(100).optional(),
  tgChatId: z.string().max(50).optional(),
  tgEnabled: z.boolean().optional(),
});

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  // Mask tgBotToken — never expose full token in API responses
  const masked = {
    ...settings,
    tgBotToken: settings.tgBotToken
      ? `****${settings.tgBotToken.slice(-4)}`
      : null,
  };

  return NextResponse.json(masked);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = parsed.data;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName: data.siteName,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram,
        tgBotToken: data.tgBotToken,
        tgChatId: data.tgChatId,
        tgEnabled: data.tgEnabled,
      },
      create: {
        id: "default",
        siteName: data.siteName,
        phone: data.phone,
        email: data.email,
        instagram: data.instagram,
        tgBotToken: data.tgBotToken,
        tgChatId: data.tgChatId,
        tgEnabled: data.tgEnabled,
      },
    });

    // Mask tgBotToken — never expose full token in API responses
    const masked = {
      ...settings,
      tgBotToken: settings.tgBotToken
        ? `****${settings.tgBotToken.slice(-4)}`
        : null,
    };

    return NextResponse.json(masked);
  } catch (error) {
    console.error("[Settings] Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
