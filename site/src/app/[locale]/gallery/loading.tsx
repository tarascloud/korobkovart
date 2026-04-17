export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="h-8 w-48 bg-muted animate-pulse mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-muted animate-pulse" />
            <div className="h-4 w-3/4 bg-muted animate-pulse" />
            <div className="h-3 w-1/2 bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
