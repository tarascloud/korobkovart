import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16" role="status" aria-label="Loading gallery">
      {/* Page heading skeleton */}
      <Skeleton className="h-10 w-56 mb-6" />

      {/* Filter row skeleton */}
      <div className="mb-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28" />
        ))}
      </div>

      {/* Grid skeleton (masonry-like columns to match ArtworkGrid) */}
      <div className="columns-1 sm:columns-2 gap-8 [column-fill:balanced]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-8 space-y-3">
            <Skeleton
              className={
                i % 3 === 0
                  ? "aspect-[3/4]"
                  : i % 3 === 1
                  ? "aspect-square"
                  : "aspect-[4/5]"
              }
            />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading artwork gallery…</span>
    </div>
  );
}
