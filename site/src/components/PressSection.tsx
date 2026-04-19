import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";

interface PressMention {
  id: string;
  outlet: string;
  title: string;
  url?: string;
  year: number;
}

const pressMentions: PressMention[] = [
  {
    id: "bsmt-london",
    outlet: "BSMT Gallery",
    title: "Ukrainian Artists at BSMT: Art in Times of War",
    url: "https://bfrfrnd.space",
    year: 2022,
  },
  {
    id: "okis-wroclaw",
    outlet: "OKiS Wroclaw",
    title: "Korobkov: Destruction Series Solo Exhibition",
    year: 2022,
  },
  {
    id: "circulo-cordoba",
    outlet: "Circulo de la Amistad",
    title: "Podilia -- Contemporary Ukrainian Art in Cordoba",
    year: 2023,
  },
];

export async function PressSection() {
  const t = await getTranslations("home");

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold tracking-tight uppercase mb-10">
            {t("press.title")}
          </h2>
        </ScrollReveal>

        {/* Asymmetric stacked list -- no 3-col grid */}
        <div className="space-y-0">
          {pressMentions.map((mention, i) => (
            <ScrollReveal key={mention.id} delay={i * 0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(140px,1fr)_2fr_auto] gap-2 sm:gap-8 py-6 border-b border-border items-baseline group hover:border-foreground/40 transition-colors">
                <p className="text-xs text-secondary tracking-wider uppercase font-mono">
                  {mention.outlet} &middot; {mention.year}
                </p>
                <h3 className="font-medium leading-snug">
                  {mention.title}
                </h3>
                <div className="sm:text-right">
                  {mention.url && (
                    <a
                      href={mention.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase"
                    >
                      {t("press.read_article")} &rarr;
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
