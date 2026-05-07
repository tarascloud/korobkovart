import { getAbsoluteImageUrl } from "@/lib/r2";

export function ArtGalleryJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'Korobkov Art Studio',
    description: 'Contemporary Ukrainian art studio. Original paintings, murals, and installations.',
    url: 'https://ko.taras.cloud',
    telephone: '+380634755619',
    email: 'info@korobkovart.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Valencia',
      addressCountry: 'ES',
    },
    founder: {
      '@type': 'Person',
      name: 'Michael Korobkov',
      birthDate: '1985',
      birthPlace: 'Crimea, Ukraine',
      nationality: 'Ukrainian',
      jobTitle: 'Artist',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 39.4699,
      longitude: -0.3763,
    },
    image: 'https://ko.taras.cloud/logo.svg',
    priceRange: '$$',
    openingHours: 'Mo-Fr 10:00-18:00',
    sameAs: [
      'https://www.instagram.com/korobkov_art/',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export function ArtworkJsonLd({
  artwork,
  locale = "en",
}: {
  artwork: {
    title: string;
    year: number;
    medium: string;
    dimensions: string;
    image: string;
    slug: string;
    series?: string;
    status?: string;
    description?: { en?: string; es?: string; ua?: string } | null;
    price?: number | null;
  };
  locale?: string;
}) {
  const [wRaw, hRaw] = artwork.dimensions.split("x").map((s) => s.trim());
  const w = wRaw ? parseFloat(wRaw) : undefined;
  const h = hRaw ? parseFloat(hRaw.replace(/[^0-9.]/g, "")) : undefined;

  const desc = (artwork.description && (artwork.description[locale as "en"|"es"|"ua"] || artwork.description.en)) || undefined;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: artwork.title,
    dateCreated: String(artwork.year),
    artMedium: artwork.medium,
    artform: "Painting",
    artworkSurface: artwork.medium,
    image: getAbsoluteImageUrl(artwork.image),
    url: `https://ko.taras.cloud/${locale}/gallery/${artwork.slug}`,
    inLanguage: locale,
    creator: {
      "@type": "Person",
      name: "Michael Korobkov",
      jobTitle: "Artist",
      nationality: "Ukrainian",
    },
  };

  if (desc) jsonLd.description = desc;
  if (w) jsonLd.width = { "@type": "QuantitativeValue", value: w, unitCode: "CMT" };
  if (h) jsonLd.height = { "@type": "QuantitativeValue", value: h, unitCode: "CMT" };
  if (artwork.series) jsonLd.genre = artwork.series;
  if (artwork.status === "available") {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://ko.taras.cloud/${locale}/gallery/${artwork.slug}`,
      seller: { "@type": "Organization", name: "Korobkov Art Studio" },
    };
    // DES/SMM-20260507-0003: include price (EUR, derived from cents) so Google Shopping
    // and product rich snippets activate. price=null means "price on request" — omit.
    if (artwork.price != null && artwork.price > 0) {
      offer.price = (artwork.price / 100).toFixed(2);
    }
    jsonLd.offers = offer;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
