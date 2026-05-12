import { getTranslations } from "next-intl/server";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { GalleryItemListJsonLd } from "@/components/JsonLd";
import { getAllArtworks } from "@/lib/artworks";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("gallery");
  const artworks = await getAllArtworks();

  return (
    <>
      <GalleryItemListJsonLd artworks={artworks} locale={locale} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-none mb-12">
          {t("title")}
        </h1>
        <ArtworkGrid artworks={artworks} />
      </div>
    </>
  );
}
