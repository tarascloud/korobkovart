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

  const filtered =
    active === "all" ? artworks : artworks.filter((a) => a.series === active);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors border ${
              active === f.value
                ? "border-foreground text-foreground bg-foreground/5"
                : "border-border text-secondary hover:border-foreground hover:text-foreground"
            }`}
          >
            {t(f.key)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-secondary text-center py-20">{t("no_results")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} />
          ))}
        </div>
      )}
    </div>
  );
}
