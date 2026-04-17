import { prisma } from "@/lib/prisma";
import { ArtworkTable } from "@/components/admin/ArtworkTable";

export default async function AdminArtworksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const artworks = await prisma.artwork.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-wider uppercase">
          Artworks
        </h1>
        <a
          href={`/${locale}/admin/artworks/new`}
          className="px-4 py-2 bg-foreground text-background text-sm tracking-wider uppercase"
        >
          + New Artwork
        </a>
      </div>
      <ArtworkTable
        artworks={JSON.parse(JSON.stringify(artworks))}
      />
    </div>
  );
}
