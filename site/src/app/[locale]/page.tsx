import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/HeroSection";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PressSection } from "@/components/PressSection";
import { ExhibitionsSection } from "@/components/ExhibitionsSection";
import { getFeaturedArtworks } from "@/lib/artworks";
import { Link } from "@/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("home");
  const featured = await getFeaturedArtworks();

  return (
    <div>
      <HeroSection />

      {/* Featured Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold tracking-wider uppercase">
            {t("featured")}
          </h2>
          <Link
            href="/gallery"
            className="text-sm text-secondary hover:text-foreground transition-colors tracking-wider uppercase"
          >
            {t("view_all")} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((artwork) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      </section>

      {/* Series Descriptions */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
          <ScrollReveal>
            <h3 className="text-xl font-bold tracking-wider uppercase mb-4">
              {t("series.podilia")}
            </h3>
            <p className="text-secondary leading-relaxed">
              {t("series.podilia_desc")}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h3 className="text-xl font-bold tracking-wider uppercase mb-4">
              {t("series.destruction")}
            </h3>
            <p className="text-secondary leading-relaxed">
              {t("series.destruction_desc")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Press Mentions */}
      <PressSection />

      {/* Exhibitions */}
      <ExhibitionsSection />
    </div>
  );
}
