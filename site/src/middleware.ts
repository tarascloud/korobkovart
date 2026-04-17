import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
});

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
  // With localePrefix: 'never', locale is determined by cookie only.
  // Set cookie from geo-detection on first visit.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (!cookieLocale) {
    const country = request.headers.get('cf-ipcountry') || '';
    const geoLocale = countryToLocale[country.toUpperCase()];
    if (geoLocale) {
      const response = intlMiddleware(request);
      response.cookies.set('NEXT_LOCALE', geoLocale, { path: '/', maxAge: 365 * 24 * 60 * 60 });
      return response;
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|auth|artworks|images|fonts|favicon.ico|booklet.pdf|robots.txt|sitemap.xml|manifest.json|sw.js|hero-bg.mp4|videos|.*\\.jpg|.*\\.png|.*\\.webp).*)']
};
