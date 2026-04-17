import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mapArtwork } from "@/lib/artworks";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("collections");

  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      artworks: {
        include: { artwork: true },
        orderBy: { artwork: { sortOrder: "asc" } },
      },
    },
  });

  if (!collection) notFound();

  const artworks = collection.artworks.map((ac) => mapArtwork(ac.artwork));
  const description =
    locale === "ua"
      ? collection.descriptionUa
      : locale === "es"
        ? collection.descriptionEs
        : collection.descriptionEn;

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/gallery/collections"
        className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase mb-8 inline-block"
      >
        &larr; {t("back_to_collections")}
      </Link>
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-4 mt-4">
        {collection.name}
      </h1>
      {description && (
        <p className="text-secondary mb-10 max-w-2xl">{description}</p>
      )}
      {artworks.length === 0 ? (
        <p className="text-secondary text-center py-20">
          {t("collection_empty")}
        </p>
      ) : (
        <ArtworkGrid artworks={artworks} />
      )}
    </div>
  );
}
