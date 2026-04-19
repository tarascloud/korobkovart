import { getTranslations } from "next-intl/server";
import { ScrollReveal } from "@/components/ScrollReveal";

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div>
      {/* Hero split: image left, intro right */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_4fr] gap-12 md:gap-20 items-start">
          {/* Left: Artist photo */}
          <ScrollReveal>
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about.jpg"
                alt={t("artist_title")}
                className="w-full h-auto"
              />
            </div>
          </ScrollReveal>

          {/* Right: Bio + intro */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-col gap-8 md:pt-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase leading-none mb-3">
                  {t("artist_title")}
                </h1>
                <p className="text-sm text-secondary tracking-[0.2em] uppercase">
                  {t("artist_subtitle")}
                </p>
              </div>

              <div className="h-[1px] bg-border w-16" />

              <p className="text-base text-secondary leading-relaxed max-w-[55ch]">
                {t("bio")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Artist Statement -- generous whitespace, asymmetric */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            {/* Left: Section title -- sticky on desktop */}
            <ScrollReveal>
              <div className="md:sticky md:top-32">
                <h2 className="text-xl font-semibold tracking-[0.15em] uppercase">
                  {t("statement_title")}
                </h2>
                <div className="h-[1px] bg-border w-12 mt-4" />
              </div>
            </ScrollReveal>

            {/* Right: Statement paragraphs with generous spacing */}
            <div className="flex flex-col gap-8">
              <ScrollReveal delay={0.1}>
                <p className="text-base text-secondary leading-relaxed max-w-[60ch]">
                  {t("statement_1")}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <p className="text-base text-secondary leading-relaxed max-w-[60ch]">
                  {t("statement_2")}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <p className="text-base text-secondary leading-relaxed max-w-[60ch]">
                  {t("statement_3")}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Process + Philosophy -- zigzag layout */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
          {/* Block 1: Ornament & Pattern -- text right */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 md:gap-20 mb-24 sm:mb-32">
            <ScrollReveal>
              <p className="text-base text-secondary leading-relaxed max-w-[60ch]">
                {t("statement_4")}
              </p>
            </ScrollReveal>
            <div /> {/* Asymmetric whitespace */}
          </div>

          {/* Block 2: Scale & Space -- text left with offset */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-20 mb-24 sm:mb-32">
            <div /> {/* Asymmetric whitespace */}
            <ScrollReveal>
              <p className="text-base text-secondary leading-relaxed max-w-[60ch]">
                {t("statement_5")}
              </p>
            </ScrollReveal>
          </div>

          {/* Block 3: Dialogue -- full width, centered */}
          <ScrollReveal>
            <div className="max-w-2xl">
              <p className="text-lg text-foreground/80 leading-relaxed italic">
                {t("statement_6")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Download booklet CTA */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
          <ScrollReveal>
            <a
              href="/booklet.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3.5 border border-foreground/40 text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-300 active:scale-[0.98]"
            >
              {t("download_booklet")} &rarr;
            </a>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
