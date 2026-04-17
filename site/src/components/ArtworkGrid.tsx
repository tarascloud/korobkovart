"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArtworkCard } from "./ArtworkCard";
import type { Artwork, ArtworkSeries } from "@/lib/types";

const filters: { key: string; value: ArtworkSeries | "all" }[] = [
  { key: "filter_all", value: "all" },
  { key: "filter_podilia", value: "podilia" },
  { key: "filter_destruction", value: "destruction" },
  { key: "filter_murals", value: "murals" },
  { key: "filter_graphics", value: "graphics" },
  { key: "filter_earlier", value: "earlier" },
];

export function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  const t = useTranslations("gallery");
  const [active, setActive] = useState<ArtworkSeries | "all">("all");
  const [visibleCount, setVisibleCount] = useState(18);

  const filtered =
    active === "all" ? artworks : artworks.filter((a) => a.series === active);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Filters */}
      <div className="relative mb-10">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:[mask-image:none] [mask-image:linear-gradient(to_right,black_85%,transparent)]">
        {filters.map((f) => {
          const count =
            f.value === "all"
              ? artworks.length
              : artworks.filter((a) => a.series === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => {
                setActive(f.value);
                setVisibleCount(18);
              }}
              className={`px-4 py-2 text-sm tracking-[0.1em] uppercase transition-colors duration-300 border focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none ${
                active === f.value
                  ? "border-foreground text-foreground bg-foreground/5"
                  : "border-border text-secondary hover:border-foreground hover:text-foreground"
              }`}
            >
              {t(f.key)} ({count})
            </button>
          );
        })}
      </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-secondary text-center py-20">{t("no_results")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((artwork) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      )}

      {visibleCount < filtered.length && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount(prev => prev + 18)}
            className="px-8 py-3 border border-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none"
          >
            {t("load_more")} ({filtered.length - visibleCount} {t("remaining")})
          </button>
        </div>
      )}
    </div>
  );
}
