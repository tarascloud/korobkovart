import { prisma } from "@/lib/prisma";
import { CollectionManager } from "@/components/admin/CollectionManager";

export default async function AdminCollectionsPage() {
  const [collections, artworks] = await Promise.all([
    prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        artworks: {
          include: {
            artwork: { select: { id: true, title: true, imagePath: true } },
          },
        },
      },
    }),
    prisma.artwork.findMany({
      select: { id: true, title: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <CollectionManager
      collections={JSON.parse(JSON.stringify(collections))}
      allArtworks={artworks}
    />
  );
}
