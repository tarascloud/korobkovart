import { ArtworkForm } from "@/components/admin/ArtworkForm";

export default async function NewArtworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-wider uppercase mb-8">
        New Artwork
      </h1>
      <ArtworkForm locale={locale} />
    </div>
  );
}
