import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-12">
        {t("title")}
      </h1>

      {/* Artist Info */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">{t("artist_title")}</h2>
        <p className="text-secondary text-sm mb-6">{t("artist_subtitle")}</p>
        <p className="leading-relaxed text-secondary">{t("bio")}</p>
      </section>

      {/* Education */}
      <section className="mb-16">
        <h3 className="text-lg font-bold tracking-wider uppercase mb-4">
          {t("education_title")}
        </h3>
        <ul className="space-y-2 text-secondary">
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-foreground mt-2 flex-shrink-0" />
            {t("education_1")}
          </li>
          <li className="flex items-start gap-3">
            <span className="w-2 h-2 bg-foreground mt-2 flex-shrink-0" />
            {t("education_2")}
          </li>
        </ul>
      </section>

      {/* Artist Statements */}
      <section className="mb-16 space-y-12">
        <div>
          <h3 className="text-lg font-bold tracking-wider uppercase mb-4">
            {t("statement_podilia_title")}
          </h3>
          <p className="leading-relaxed text-secondary whitespace-pre-line">
            {t("statement_podilia")}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold tracking-wider uppercase mb-4">
            {t("statement_destruction_title")}
          </h3>
          <p className="leading-relaxed text-secondary whitespace-pre-line">
            {t("statement_destruction")}
          </p>
        </div>
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
