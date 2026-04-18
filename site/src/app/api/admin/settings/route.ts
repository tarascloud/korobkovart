import { NextRequest, NextResponse } from "next/server";
import { requireOwnerApi } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await requireOwnerApi();
  if (error) return error;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireOwnerApi();
  if (error) return error;

  try {
    const body = await req.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: {
        siteName: body.siteName,
        phone: body.phone,
        email: body.email,
        instagram: body.instagram,
        tgBotToken: body.tgBotToken,
        tgChatId: body.tgChatId,
        tgEnabled: body.tgEnabled,
      },
      create: {
        id: "default",
        siteName: body.siteName,
        phone: body.phone,
        email: body.email,
        instagram: body.instagram,
        tgBotToken: body.tgBotToken,
        tgChatId: body.tgChatId,
        tgEnabled: body.tgEnabled,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[Settings] Error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
