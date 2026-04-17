import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div>
      {/* Bio text */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold tracking-wider uppercase mb-2">
          {t("artist_title")}
        </h2>
        <p className="text-secondary text-sm mb-6">{t("artist_subtitle")}</p>
        <p className="leading-relaxed text-secondary">{t("bio")}</p>
      </section>

      {/* Full-width photo */}
      <div className="w-full">
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
