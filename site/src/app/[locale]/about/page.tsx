import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-12">
        {t("title")}
      </h1>

      {/* Bio */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">{t("artist_title")}</h2>
        <p className="text-secondary text-sm mb-6">{t("artist_subtitle")}</p>
        <p className="leading-relaxed text-secondary">{t("bio")}</p>
      </section>

{/* Download booklet */}
      <section>
        <a
          href="/booklet.pdf"
          download
          className="inline-block px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
        >
          {t("download_booklet")}
        </a>
      </section>
    </div>
  );
}
