export default function ArtworkLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-muted animate-pulse" />
        <div className="space-y-6">
          <div className="h-10 w-3/4 bg-muted animate-pulse" />
          <div className="h-4 w-1/2 bg-muted animate-pulse" />
          <div className="h-4 w-1/3 bg-muted animate-pulse" />
          <div className="h-4 w-2/5 bg-muted animate-pulse" />
          <div className="h-20 w-full bg-muted animate-pulse mt-8" />
          <div className="h-12 w-40 bg-muted animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}
