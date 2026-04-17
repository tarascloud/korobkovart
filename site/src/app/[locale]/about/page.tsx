import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div>
      {/* Bio text above photo */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <p className="leading-relaxed text-secondary text-base">
          {t("bio")}
        </p>
      </div>

      {/* Full-width photo */}
      <div className="relative w-full">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about.jpg"
          alt={t("artist_title")}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
