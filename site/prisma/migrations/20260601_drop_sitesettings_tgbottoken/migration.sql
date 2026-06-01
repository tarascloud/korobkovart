-- Drop tgBotToken column from SiteSettings (moved to Infisical-managed env TG_BOT_KO)
-- Architect plan: VS task cmpvj289f000g01lr3kokmohp (2026-06-01)
-- Plaintext bot token must not live in DB; reads are now via process.env.TG_BOT_KO
ALTER TABLE "SiteSettings" DROP COLUMN IF EXISTS "tgBotToken";
