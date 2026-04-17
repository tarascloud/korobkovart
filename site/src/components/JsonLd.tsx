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
      addressLocality: 'Kyiv',
      addressCountry: 'UA',
    },
    founder: {
      '@type': 'Person',
      name: 'Mykhailo Korobkov',
      birthDate: '1985',
      birthPlace: 'Crimea, Ukraine',
      nationality: 'Ukrainian',
      jobTitle: 'Artist',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ArtworkJsonLd({ artwork }: { artwork: { title: string; year: number; medium: string; dimensions: string; image: string; slug: string } }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: artwork.title,
    dateCreated: String(artwork.year),
    artMedium: artwork.medium,
    width: artwork.dimensions.split('x')[0]?.trim(),
    height: artwork.dimensions.split('x')[1]?.replace(' cm', '').trim(),
    image: `https://ko.taras.cloud${artwork.image}`,
    url: `https://ko.taras.cloud/en/gallery/${artwork.slug}`,
    creator: {
      '@type': 'Person',
      name: 'Mykhailo Korobkov',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
