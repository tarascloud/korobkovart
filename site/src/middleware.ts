import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
});

// Map country codes to locales
const countryToLocale: Record<string, string> = {
  UA: 'ua',
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  DO: 'es',
  HN: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PA: 'es',
  UY: 'es',
  PY: 'es',
  BO: 'es',
};

export default function middleware(request: NextRequest) {
  const { host, pathname, search } = request.nextUrl;

  // Redirect www.korobkovart.com → korobkovart.com (301 permanent)
  if (host === 'www.korobkovart.com') {
    const url = request.nextUrl.clone();
    url.host = 'korobkovart.com';
    return NextResponse.redirect(url, { status: 301 });
  }

  // Check Cloudflare country header first
  const country = request.headers.get('cf-ipcountry') || '';
  const geoLocale = countryToLocale[country.toUpperCase()];

  if (geoLocale && !pathname.match(/^\/(en|es|ua)(\/|$)/)) {
    // Only redirect if user hasn't already chosen a locale
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (!cookieLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${geoLocale}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(en|es|ua)/:path*']
};
