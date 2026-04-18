export default function TasksLoading() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="h-8 w-40 bg-muted animate-pulse mb-8" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded">
            <div className="w-5 h-5 bg-muted animate-pulse rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 bg-muted animate-pulse" />
              <div className="h-3 w-1/4 bg-muted animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
