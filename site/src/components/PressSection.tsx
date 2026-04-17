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
    title: "Podilia — Contemporary Ukrainian Art in Cordoba",
    year: 2023,
  },
];

export async function PressSection() {
  const t = await getTranslations("home");

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <ScrollReveal>
          <h2 className="text-2xl font-bold tracking-wider uppercase mb-10">
            {t("press.title")}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pressMentions.map((mention, i) => (
            <ScrollReveal key={mention.id} delay={i * 0.1}>
              <div className="border border-border p-6 hover:border-foreground transition-colors">
                <p className="text-xs text-secondary tracking-wider uppercase mb-3">
                  {mention.outlet} &middot; {mention.year}
                </p>
                <h3 className="font-medium leading-snug mb-4">
                  {mention.title}
                </h3>
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
