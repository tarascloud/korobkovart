import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16" role="status" aria-label="Loading gallery">
      {/* Page heading skeleton */}
      <Skeleton className="h-10 w-56 mb-6" />

      {/* Filter row skeleton */}
      <div className="mb-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28" />
        ))}
      </div>

      {/* Grid skeleton — matches ArtworkGrid: 2-col grid with aspect-[3/4] tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading artwork gallery…</span>
    </div>
  );
}
