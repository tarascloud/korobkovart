"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-secondary mt-4 mb-8">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </div>
  );
}
