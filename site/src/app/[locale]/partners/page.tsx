import { useTranslations } from "next-intl";
import { InquiryForm } from "@/components/InquiryForm";

export default function PartnersPage() {
  const t = useTranslations("partners");

  const types = [
    { key: "gallery" },
    { key: "mural" },
    { key: "curatorial" },
    { key: "corporate" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase mb-4">
        {t("title")}
      </h1>
      <p className="text-base text-secondary mb-16 leading-relaxed">{t("subtitle")}</p>

      {/* Why Partner */}
      <section className="mb-20">
        <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-6">
          {t("why_title")}
        </h2>
        <p className="text-secondary text-base leading-relaxed">{t("why_text")}</p>
      </section>

      {/* Types */}
      <section className="mb-20">
        <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-10">
          {t("types_title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {types.map((type) => (
            <div
              key={type.key}
              className="p-6 border border-border hover:border-foreground/40 transition-colors duration-300"
            >
              <h3 className="text-base font-semibold tracking-wide mb-2">
                {t(`type_${type.key}` as any)}
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                {t(`type_${type.key}_desc` as any)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Press Kit */}
      <section className="mb-20">
        <a
          href="/booklet.pdf"
          download
          className="inline-block px-8 py-3 border border-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
        >
          {t("press_kit")}
        </a>
      </section>

      {/* Form */}
      <section>
        <h2 className="text-lg font-semibold tracking-[0.2em] uppercase mb-8">
          {t("form_title")}
        </h2>
        <InquiryForm type="partner" />
      </section>
    </div>
  );
}
