// Rate limiter for KO public endpoints.
//
// Internals: Redis-backed sliding window when REDIS_URL/REDIS_PASSWORD is set
// (canon shared with PD/VS/JF via `rate-limit-redis.ts`, namespace `ko:rl`).
// Falls back to an in-process Map for dev/CI without Redis.
//
// Public API (`checkRateLimit`, `getClientIp`) preserved from pre-Redis
// version so existing callers continue to work.
//
// ARC-20260507-0003: when client IP cannot be determined (proxy mis-config,
// Tor exit, missing CF headers), we collapse all anonymous traffic into a
// single shared bucket `global-fallback` so rate limits still apply. The
// previous behaviour ("ip === 'unknown'" → allow) opened a trivial bypass:
// strip CF/X-Forwarded-For headers and spam /api/inquiry unbounded. This is
// fail-CLOSED for the unknown-IP edge only — the rest of the limiter stays
// fail-open if Redis is unavailable.

import { slidingWindow } from "./rate-limit-redis";

const NAMESPACE = "ko:rl";

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

/**
 * Sync in-memory check (legacy callers). Returns true if request is allowed.
 *
 * ARC-20260507-0003: ip="unknown" no longer bypasses — collapses into a
 * shared bucket so anonymous traffic is still capped.
 */
export function checkRateLimit(
  bucket: string,
  ip: string,
  opts: RateLimitOptions = { max: 10, windowMs: 60_000 }
): boolean {
  const effectiveIp = ip === "unknown" ? "global-fallback" : ip;
  const store = getStore(bucket);
  const now = Date.now();
  const entry = store.get(effectiveIp);

  if (!entry || now > entry.resetAt) {
    store.set(effectiveIp, { count: 1, resetAt: now + opts.windowMs });
    return true;
  }

  if (entry.count >= opts.max) return false;

  entry.count++;
  return true;
}

/**
 * Async, Redis-backed variant. Prefer this in new code so rate limits
 * survive rolling deployments and apply across replicas.
 *
 * Same fail-closed-for-unknown semantic as the sync variant.
 */
export async function checkRateLimitAsync(
  bucket: string,
  ip: string,
  opts: RateLimitOptions = { max: 10, windowMs: 60_000 }
): Promise<boolean> {
  const effectiveIp = ip === "unknown" ? "global-fallback" : ip;
  const r = await slidingWindow(
    NAMESPACE,
    `${bucket}:${effectiveIp}`,
    {
      limit: opts.max,
      windowSeconds: Math.max(1, Math.ceil(opts.windowMs / 1000)),
    }
  );
  if (r.allowed) return true;
  return false;
}
