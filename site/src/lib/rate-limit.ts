// Simple in-memory IP rate limiter (sliding window-ish via reset timestamp).
//適аптовано з vs-private/app/src/app/api/waitlist/route.ts.
// Призначений тільки для single-process Next.js контейнерів.

export type RateLimitOptions = {
  max: number;
  windowMs: number;
};

const stores = new Map<string, Map<string, { count: number; resetAt: number }>>();

function getStore(bucket: string): Map<string, { count: number; resetAt: number }> {
  let store = stores.get(bucket);
  if (!store) {
    store = new Map();
    stores.set(bucket, store);
  }
  return store;
}

export function getClientIp(headersList: Headers): string {
  return (
    headersList.get("cf-connecting-ip") ||
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(
  bucket: string,
  ip: string,
  opts: RateLimitOptions = { max: 10, windowMs: 60_000 }
): boolean {
  if (ip === "unknown") return true; // не блокуємо коли IP невідомий — лог-only
  const store = getStore(bucket);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  if (entry.count >= opts.max) return false;

  entry.count++;
  return true;
}
