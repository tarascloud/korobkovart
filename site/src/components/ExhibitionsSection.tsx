import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { exhibitions } from "@/data/exhibitions";

export async function ExhibitionsSection() {
  const t = await getTranslations("home");

  const recent = [...exhibitions]
    .sort((a, b) => b.year - a.year)
    .slice(0, 5);

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <ScrollReveal>
            <h2 className="text-2xl font-bold tracking-wider uppercase">
              {t("exhibitions_section.title")}
            </h2>
          </ScrollReveal>
          <Link
            href="/exhibitions"
            className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase"
          >
            {t("exhibitions_section.view_all")} &rarr;
          </Link>
        </div>

        <div className="space-y-0">
          {recent.map((exhibition, i) => (
            <ScrollReveal key={exhibition.id} delay={i * 0.08}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 border-b border-border">
                <span className="text-sm text-secondary min-w-[80px] font-mono">
                  {exhibition.date}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{exhibition.title}</h3>
                  <p className="text-sm text-secondary">
                    {exhibition.venue}
                  </p>
                </div>
                <span className="text-sm text-secondary">
                  {exhibition.city}, {exhibition.country}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
