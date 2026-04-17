import { prisma } from "./prisma";

export async function sendTelegramNotification(message: string) {
  let token = process.env.TG_BOT_TOKEN;
  let chatId = process.env.TG_CHAT_ID;

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (settings?.tgEnabled && settings.tgBotToken && settings.tgChatId) {
      token = settings.tgBotToken;
      chatId = settings.tgChatId;
    }
  } catch {
    // Fall back to env vars if DB not available
  }

  if (!token || !chatId) {
    console.log("[Telegram] Not configured, skipping notification");
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("[Telegram] Failed to send:", error);
  }
}
