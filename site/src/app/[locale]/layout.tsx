import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ArtGalleryJsonLd } from "@/components/JsonLd";
import { AdminBar } from "@/components/AdminBar";
import { auth } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});


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
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Korobkov Art Studio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
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
    <html lang={locale} suppressHydrationWarning className={`h-full ${inter.variable} ${inter.className}`}>
      <body className="min-h-full flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:text-black"
        >
          Skip to content
        </a>
        <ArtGalleryJsonLd />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header user={user} />
            <main id="main" className="flex-1 pt-[73px]">{children}</main>
            <Footer />
            <AdminBar user={user} />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
