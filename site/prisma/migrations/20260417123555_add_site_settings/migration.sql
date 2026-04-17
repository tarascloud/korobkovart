-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Korobkov Art Studio',
    "phone" TEXT NOT NULL DEFAULT '+38 (063) 475 56 19',
    "email" TEXT NOT NULL DEFAULT 'info@korobkovart.com',
    "instagram" TEXT NOT NULL DEFAULT 'https://www.instagram.com/korobkov.art/',
    "tgBotToken" TEXT NOT NULL DEFAULT '',
    "tgChatId" TEXT NOT NULL DEFAULT '',
    "tgEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
