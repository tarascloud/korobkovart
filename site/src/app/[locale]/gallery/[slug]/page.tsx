import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArtworkBySlug, getRelatedArtworks } from "@/lib/artworks";
import { ArtworkJsonLd } from "@/components/JsonLd";
import { ArtworkDetail } from "@/components/ArtworkDetail";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return { title: "Not Found" };
  }

  const title = `${artwork.title} (${artwork.year})`;
  const description = `${artwork.title} - ${artwork.medium}, ${artwork.dimensions}. By Mykhailo Korobkov.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://ko.taras.cloud/${locale}/gallery/${artwork.slug}`,
      siteName: "Korobkov Art Studio",
      images: [
        {
          url: `/api/og/${artwork.slug}`,
          width: 1200,
          height: 630,
          alt: artwork.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/${artwork.slug}`],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);

  if (!artwork) notFound();

  const related = await getRelatedArtworks(artwork.series, artwork.slug, 4);
  const session = await auth();
  const isOwner = (session?.user as Record<string, unknown> | undefined)?.role === "OWNER";

  return (
    <>
      <ArtworkJsonLd artwork={artwork} />
      <ArtworkDetail artwork={artwork} related={related} isOwner={isOwner} />
    </>
  );
}
