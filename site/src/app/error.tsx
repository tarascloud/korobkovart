"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tighter leading-none [text-wrap:balance]">
        Something went wrong
      </h1>
      <p className="text-secondary mt-4 mb-8">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-all duration-150 active:scale-[0.98]"
      >
        Try Again
      </button>
    </div>
  );
}
