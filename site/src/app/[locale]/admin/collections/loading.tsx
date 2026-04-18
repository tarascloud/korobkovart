export default function CollectionsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-muted animate-pulse" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded overflow-hidden">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-2/3 bg-muted animate-pulse" />
              <div className="h-3 w-1/3 bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
