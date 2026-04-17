import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="relative w-full">
      {/* Full-width photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/about.jpg"
        alt={t("artist_title")}
        className="w-full h-auto"
      />

      {/* Gradient top: white → transparent */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent z-10" />

      {/* Gradient bottom: transparent → white */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />

      {/* Bio text overlay at top */}
      <div className="absolute inset-x-0 top-0 z-20 max-w-4xl mx-auto px-6 py-12 md:py-16">
        <p className="leading-relaxed text-secondary text-sm sm:text-base">
          {t("bio")}
        </p>
      </div>
    </div>
  );
}
