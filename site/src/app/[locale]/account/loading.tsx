export default function AccountLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="h-8 w-48 bg-muted animate-pulse mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse" />
          <div className="h-4 w-full bg-muted animate-pulse" />
          <div className="h-4 w-3/4 bg-muted animate-pulse" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse" />
          <div className="h-4 w-full bg-muted animate-pulse" />
          <div className="h-4 w-3/4 bg-muted animate-pulse" />
        </div>
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-6 w-40 bg-muted animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded">
            <div className="w-16 h-16 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse" />
              <div className="h-3 w-1/4 bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
