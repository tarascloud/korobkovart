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
            <h2 className="text-2xl font-semibold tracking-tight uppercase [text-wrap:balance]">
              {t("exhibitions_section.title")}
            </h2>
          </ScrollReveal>
          <Link
            href="/cv"
            className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase"
          >
            {t("exhibitions_section.view_all")} &rarr;
          </Link>
        </div>

        <div className="space-y-0">
          {recent.map((exhibition, i) => (
            <ScrollReveal key={exhibition.id} delay={i * 0.08}>
              <div className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-5 border-b border-border hover:bg-muted/30 transition-colors duration-200 px-3 -mx-3">
                <span className="text-sm text-secondary min-w-[80px] font-mono">
                  {exhibition.date}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <h3 className="font-medium">{exhibition.title}</h3>
                  <span
                    className={`hidden sm:inline-block px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase border ${
                      exhibition.type === "personal"
                        ? "border-foreground/30 text-foreground/70"
                        : "border-secondary/30 text-secondary"
                    }`}
                  >
                    {exhibition.type === "personal" ? "Solo" : "Group"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-secondary">
                    {exhibition.venue}
                  </p>
                </div>
                <span className="text-sm text-secondary whitespace-nowrap">
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
