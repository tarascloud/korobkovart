import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Manrope } from "next/font/google";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ArtGalleryJsonLd } from "@/components/JsonLd";
import { AdminBar } from "@/components/AdminBar";
import { NoiseOverlay } from "@/components/NoiseOverlay";
import { auth } from "@/lib/auth";

const GA_MEASUREMENT_ID = "G-H3LWG543XL";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
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
    keywords: (t("keywords") as string).split(", "),
    metadataBase: new URL("https://ko.taras.cloud"),
    alternates: {
      canonical: `https://ko.taras.cloud/${locale}`,
      languages: {
        en: "/en",
        es: "/es",
        uk: "/ua",
        "x-default": "/en",
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
          url: "/about.jpg",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@taaboroda",
      creator: "@taaboroda",
      title: t("title"),
      description: t("description"),
      images: ["/about.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const session = await auth();
  const user = session?.user ? {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user as any).role as string | undefined,
  } : null;

  const isProd = process.env.NODE_ENV === "production";

  return (
    <html lang={locale} suppressHydrationWarning className={`h-full ${manrope.variable} ${manrope.className}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t!=='light'&&s))document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {isProd && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {tNav("skip_to_content")}
        </a>
        <ArtGalleryJsonLd />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header user={user} />
            <main id="main" tabIndex={-1} className="flex-1 pt-[73px] focus:outline-none">{children}</main>
            <Footer />
            <AdminBar user={user} />
            <NoiseOverlay />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
