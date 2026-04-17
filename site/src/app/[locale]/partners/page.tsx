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
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-wider uppercase mb-4">
        {t("title")}
      </h1>
      <p className="text-xl text-secondary mb-12">{t("subtitle")}</p>

      {/* Why Partner */}
      <section className="mb-16">
        <h2 className="text-xl font-bold tracking-wider uppercase mb-4">
          {t("why_title")}
        </h2>
        <p className="text-secondary leading-relaxed">{t("why_text")}</p>
      </section>

      {/* Types */}
      <section className="mb-16">
        <h2 className="text-xl font-bold tracking-wider uppercase mb-8">
          {t("types_title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {types.map((type) => (
            <div key={type.key} className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-2">
                {t(`type_${type.key}` as any)}
              </h3>
              <p className="text-sm text-secondary">
                {t(`type_${type.key}_desc` as any)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Press Kit */}
      <section className="mb-16">
        <a
          href="/booklet.pdf"
          download
          className="inline-block px-8 py-3 border border-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
        >
          {t("press_kit")}
        </a>
      </section>

      {/* Form */}
      <section>
        <h2 className="text-xl font-bold tracking-wider uppercase mb-6">
          {t("form_title")}
        </h2>
        <InquiryForm type="partner" />
      </section>
    </div>
  );
}
