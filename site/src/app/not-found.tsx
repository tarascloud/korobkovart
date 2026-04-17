import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
      <p className="text-lg text-secondary mt-4 mb-8">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/en"
        className="px-8 py-3 bg-foreground text-background text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  );
}
