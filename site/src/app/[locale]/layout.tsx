import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ArtGalleryJsonLd } from "@/components/JsonLd";
import { IntroOverlay } from "@/components/IntroOverlay";
import { AdminBar } from "@/components/AdminBar";
import { auth } from "@/lib/auth";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    metadataBase: new URL("https://ko.taras.cloud"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        uk: "/ua",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `https://ko.taras.cloud/${locale}`,
      siteName: "Korobkov Art Studio",
      locale:
        locale === "ua" ? "uk_UA" : locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();
  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user as any).role as string | undefined,
  } : null;

  return (
    <html lang={locale} suppressHydrationWarning className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ArtGalleryJsonLd />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <IntroOverlay />
            <Header user={user} />
            <main className="flex-1 pt-[73px]">{children}</main>
            <Footer />
            <AdminBar user={user} />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
