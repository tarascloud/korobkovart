import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24" role="status" aria-label="Loading artwork">
      <Skeleton className="h-4 w-24 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
        <Skeleton className="aspect-[3/4]" />
        <div className="flex flex-col gap-6">
          <Skeleton className="h-9 w-2/3" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-border/60">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading artwork details…</span>
    </div>
  );
}
