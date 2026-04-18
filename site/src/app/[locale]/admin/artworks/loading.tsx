export default function ArtworksLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded">
            <div className="w-16 h-16 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse" />
              <div className="h-3 w-1/4 bg-muted animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
