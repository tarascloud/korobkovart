import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArtworkForm } from "@/components/admin/ArtworkForm";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const artwork = await prisma.artwork.findUnique({ where: { id } });
  if (!artwork) notFound();

  const formData = {
    id: artwork.id,
    title: artwork.title,
    slug: artwork.slug,
    year: artwork.year,
    series: artwork.series,
    medium: artwork.medium,
    dimensions: artwork.dimensions,
    status: artwork.status,
    imagePath: artwork.imagePath,
    descriptionEn: artwork.descriptionEn || "",
    descriptionEs: artwork.descriptionEs || "",
    descriptionUa: artwork.descriptionUa || "",
    collaborator: artwork.collaborator || "",
    featured: artwork.featured,
    sortOrder: artwork.sortOrder,
    price: artwork.price,
    limitedEditionTotal: artwork.limitedEditionTotal,
    limitedEditionAvailable: artwork.limitedEditionAvailable,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        Edit Artwork
      </h1>
      <ArtworkForm artwork={formData} locale={locale} />
    </div>
  );
}
