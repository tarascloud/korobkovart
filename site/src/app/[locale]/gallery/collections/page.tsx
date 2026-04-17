import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("collections");

  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      artworks: {
        include: { artwork: true },
        take: 1,
      },
      _count: { select: { artworks: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/gallery"
        className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase mb-8 inline-block"
      >
        &larr; {t("back_to_gallery")}
      </Link>
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-12 mt-4">
        {t("title")}
      </h1>
      {collections.length === 0 ? (
        <p className="text-secondary text-center py-20">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => {
            const coverImage =
              col.coverImagePath ||
              col.artworks[0]?.artwork.imagePath ||
              "/artworks/mural-1.jpg";
            const description =
              locale === "ua"
                ? col.descriptionUa
                : locale === "es"
                  ? col.descriptionEs
                  : col.descriptionEn;
            return (
              <Link
                key={col.id}
                href={`/gallery/collections/${col.slug}`}
                className="group"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={coverImage}
                    alt={col.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold">{col.name}</h2>
                    <p className="text-sm opacity-80">
                      {col._count.artworks}{" "}
                      {t("works_count")}
                    </p>
                    {description && (
                      <p className="text-sm opacity-70 mt-1 line-clamp-2">
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
