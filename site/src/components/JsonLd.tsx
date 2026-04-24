import { getAbsoluteImageUrl } from "@/lib/r2";

export function ArtGalleryJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ArtGallery',
    name: 'Korobkov Art Studio',
    description: 'Contemporary Ukrainian art studio. Original paintings, murals, and installations.',
    url: 'https://ko.taras.cloud',
    telephone: '+380634755619',
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
    priceRange: '€500-€5000',
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
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://ko.taras.cloud/${locale}/gallery/${artwork.slug}`,
      seller: { "@type": "Organization", name: "Korobkov Art Studio" },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
