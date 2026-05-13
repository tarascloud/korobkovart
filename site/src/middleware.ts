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
  // DEV-20260512-0012: `/` must deterministically redirect to the default
  // locale (`/en`) with a 301 (permanent) so search engines + crawlers see
  // a single canonical home. Previously next-intl auto-detected locale from
  // Accept-Language / cookie / geo, returning 307 and a different target per
  // visitor — non-deterministic and bad for SEO.
  if (request.nextUrl.pathname === '/') {
    const url = new URL('/en', request.url);
    return NextResponse.redirect(url, 301);
  }

  // With localePrefix: 'always', each locale has its own canonical URL (/en, /es, /ua).
  // Set cookie from geo-detection on first visit so next-intl redirects to correct locale.
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
  matcher: ['/((?!api|_next|auth|artworks|images|fonts|favicon.ico|booklet.pdf|robots.txt|sitemap.xml|manifest.json|sw.js|hero-bg.mp4|videos|.*\\.jpg|.*\\.png|.*\\.webp|.*\\.svg|.*\\.ico).*)']
};
