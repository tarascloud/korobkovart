import { getTranslations } from "next-intl/server";
import { ArtworkGrid } from "@/components/ArtworkGrid";
import { getAllArtworks } from "@/lib/artworks";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const artworks = await getAllArtworks();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase mb-12">
        {t("title")}
      </h1>
      <ArtworkGrid artworks={artworks} />
    </div>
  );
}
