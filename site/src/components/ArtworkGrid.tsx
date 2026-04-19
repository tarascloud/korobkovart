"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
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

const VALID_SERIES = new Set(filters.map((f) => f.value));

export function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  const t = useTranslations("gallery");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize from URL (?series=xxx), fallback to "all"
  const initialSeries = (() => {
    const s = searchParams?.get("series");
    if (s && VALID_SERIES.has(s as ArtworkSeries | "all")) {
      return s as ArtworkSeries | "all";
    }
    return "all";
  })();

  const [active, setActive] = useState<ArtworkSeries | "all">(initialSeries);
  const [visibleCount, setVisibleCount] = useState(18);

  // Sync URL when filter changes (without full navigation)
  const syncUrl = useCallback(
    (value: ArtworkSeries | "all") => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (value === "all") {
        params.delete("series");
      } else {
        params.set("series", value);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSelect = useCallback(
    (value: ArtworkSeries | "all") => {
      setActive(value);
      setVisibleCount(18);
      syncUrl(value);
    },
    [syncUrl]
  );

  const handleClear = useCallback(() => {
    handleSelect("all");
  }, [handleSelect]);

  // Keyboard arrow-key navigation across tabs (WAI-ARIA tablist pattern)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const direction = e.key === "ArrowRight" ? 1 : -1;
        const nextIdx = (idx + direction + filters.length) % filters.length;
        tabsRef.current[nextIdx]?.focus();
        handleSelect(filters[nextIdx].value);
      } else if (e.key === "Home") {
        e.preventDefault();
        tabsRef.current[0]?.focus();
        handleSelect(filters[0].value);
      } else if (e.key === "End") {
        e.preventDefault();
        const lastIdx = filters.length - 1;
        tabsRef.current[lastIdx]?.focus();
        handleSelect(filters[lastIdx].value);
      }
    },
    [handleSelect]
  );

  // If URL changes externally (back/forward), sync state
  useEffect(() => {
    const s = searchParams?.get("series");
    const next = s && VALID_SERIES.has(s as ArtworkSeries | "all") ? (s as ArtworkSeries | "all") : "all";
    if (next !== active) {
      setActive(next);
      setVisibleCount(18);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered =
    active === "all" ? artworks : artworks.filter((a) => a.series === active);

  const visible = filtered.slice(0, visibleCount);
  const isFiltered = active !== "all";

  return (
    <div>
      {/* Filter tablist */}
      <div className="relative mb-10">
        <div className="flex items-center justify-between gap-4 mb-3">
          <span id="gallery-filter-label" className="text-xs text-secondary uppercase tracking-[0.2em]">
            {t("filter_label")}
          </span>
          {isFiltered && (
            <button
              onClick={handleClear}
              className="text-xs text-secondary hover:text-foreground underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded min-h-[44px] px-2"
              aria-label={t("clear_filters")}
            >
              {t("clear_filters")}
            </button>
          )}
        </div>
        <div
          role="tablist"
          aria-labelledby="gallery-filter-label"
          className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:[mask-image:none] [mask-image:linear-gradient(to_right,black_85%,transparent)]"
        >
          {filters.map((f, idx) => {
            const count =
              f.value === "all"
                ? artworks.length
                : artworks.filter((a) => a.series === f.value).length;
            const isActive = active === f.value;
            return (
              <button
                key={f.value}
                ref={(el) => {
                  tabsRef.current[idx] = el;
                }}
                role="tab"
                aria-selected={isActive}
                aria-controls="gallery-grid"
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(f.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`min-h-[44px] px-4 py-2 text-sm tracking-[0.1em] uppercase transition-colors duration-300 border focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-foreground text-foreground bg-foreground/5"
                    : "border-border text-secondary hover:border-foreground hover:text-foreground"
                }`}
              >
                {t(f.key)} ({count})
              </button>
            );
          })}
        </div>
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {t("showing", { count: visible.length, total: filtered.length })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          id="gallery-grid"
          role="tabpanel"
          aria-live="polite"
          className="flex flex-col items-center justify-center py-24 gap-6"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-secondary/40" aria-hidden="true">
            <rect x="6" y="6" width="52" height="52" rx="2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M22 38L28 30L34 36L38 32L44 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <div className="text-center">
            <p className="text-sm text-secondary tracking-wide">{t("no_results")}</p>
            <p className="text-xs text-secondary/60 mt-2">
              {t("try_other")}
            </p>
            {isFiltered && (
              <button
                onClick={handleClear}
                className="mt-4 text-xs uppercase tracking-[0.2em] text-foreground underline underline-offset-4 hover:no-underline min-h-[44px] px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
              >
                {t("clear_filters")}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div id="gallery-grid" role="tabpanel" className="columns-1 sm:columns-2 gap-8 [column-fill:balanced]">
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
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="min-h-[44px] px-8 py-3 border border-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t("load_more")} ({filtered.length - visibleCount} {t("remaining")})
          </button>
        </div>
      )}
    </div>
  );
}
