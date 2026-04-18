export default function SettingsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="h-8 w-40 bg-muted animate-pulse mb-8" />
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
        ))}
        <div className="h-10 w-32 bg-muted animate-pulse rounded mt-4" />
      </div>
    </div>
  );
}
