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
        <div className="flex flex-col items-center justify-center py-24 gap-6">
          {/* Empty state icon -- abstract frame */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary/40">
            <rect x="6" y="6" width="52" height="52" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M22 38L28 30L34 36L38 32L44 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="text-center">
            <p className="text-sm text-secondary tracking-wide">{t("no_results")}</p>
            <p className="text-xs text-secondary/60 mt-2">
              {t("filter_all") && "Try selecting a different series"}
            </p>
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 gap-8 [column-fill:balanced]">
          {visible.map((artwork, i) => (
            <div key={artwork.slug} className="break-inside-avoid mb-8">
              <ArtworkCard artwork={artwork} index={i} />
            </div>
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
