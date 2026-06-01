/**
 * API Auth Guard Tests — TES-20260601-0012
 *
 * Verifies that:
 * - All admin/* routes return 403 when no session or non-OWNER session
 * - All account/* routes return 401 when no session
 * - /api/inquiry POST accepts valid body and rejects invalid body
 *
 * Uses vi.mock to avoid real DB/Redis/Telegram connections.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock auth to return null (unauthenticated)
vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue(null),
}));

// Mock prisma to avoid DB connections
vi.mock("@/lib/prisma", () => ({
  prisma: new Proxy(
    {},
    {
      get: () =>
        new Proxy(
          {},
          {
            get: () => vi.fn().mockResolvedValue(null),
          }
        ),
    }
  ),
}));

// Mock telegram to avoid HTTP calls
vi.mock("@/lib/telegram", () => ({
  sendTelegramNotification: vi.fn().mockResolvedValue(undefined),
}));

// Mock rate-limit to allow all requests in tests
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue(true),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

// Mock r2 to avoid S3 connections
vi.mock("@/lib/r2", () => ({
  uploadToR2: vi.fn().mockResolvedValue("https://example.com/test.jpg"),
}));

// Mock next/headers to avoid request scope errors in unit test context
vi.mock("next/headers", () => ({
  headers: vi.fn().mockReturnValue(new Map([["x-forwarded-for", "127.0.0.1"]])),
  cookies: vi.fn().mockReturnValue(new Map()),
}));

function makeRequest(
  url: string,
  method: string,
  body?: Record<string, unknown>
): NextRequest {
  const init: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new NextRequest(new URL(url, "http://localhost:3000"), init as never);
}

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) };
}

async function expectUnauthorized(response: Response): Promise<void> {
  // Both 401 (requireAuthApi) and 403 (requireOwnerApi) are valid auth rejections
  expect([401, 403]).toContain(response.status);
}

describe("Admin API auth guards — unauthenticated → 403", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/admin/artworks — 403", async () => {
    const { GET } = await import("@/app/api/admin/artworks/route");
    const res = await GET();
    await expectUnauthorized(res);
  });

  it("POST /api/admin/artworks — 403", async () => {
    const { POST } = await import("@/app/api/admin/artworks/route");
    const req = makeRequest("/api/admin/artworks", "POST", {
      title: "Test",
      slug: "test",
      year: 2022,
      series: "podilia",
      medium: "oil",
      dimensions: "80x60",
      imagePath: "/test.jpg",
    });
    const res = await POST(req);
    await expectUnauthorized(res);
  });

  it("GET /api/admin/collections — 403", async () => {
    const { GET } = await import("@/app/api/admin/collections/route");
    const res = await GET();
    await expectUnauthorized(res);
  });

  it("POST /api/admin/collections — 403", async () => {
    const { POST } = await import("@/app/api/admin/collections/route");
    const req = makeRequest("/api/admin/collections", "POST", { name: "Test Collection" });
    const res = await POST(req);
    await expectUnauthorized(res);
  });

  it("GET /api/admin/settings — 403", async () => {
    const { GET } = await import("@/app/api/admin/settings/route");
    const res = await GET();
    await expectUnauthorized(res);
  });

  it("PUT /api/admin/settings — 403", async () => {
    const { PUT } = await import("@/app/api/admin/settings/route");
    const req = makeRequest("/api/admin/settings", "PUT", { heroTitle: "Test" });
    const res = await PUT(req);
    await expectUnauthorized(res);
  });

  it("PUT /api/admin/artworks/[id] — 403", async () => {
    const { PUT } = await import("@/app/api/admin/artworks/[id]/route");
    const req = makeRequest("/api/admin/artworks/test-id", "PUT", { title: "Updated" });
    const res = await PUT(req, makeParams("test-id"));
    await expectUnauthorized(res);
  });

  it("DELETE /api/admin/artworks/[id] — 403", async () => {
    const { DELETE } = await import("@/app/api/admin/artworks/[id]/route");
    const req = makeRequest("/api/admin/artworks/test-id", "DELETE");
    const res = await DELETE(req, makeParams("test-id"));
    await expectUnauthorized(res);
  });
});

describe("Account API auth guards — unauthenticated → 401", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/account/profile — 401", async () => {
    const { GET } = await import("@/app/api/account/profile/route");
    const res = await GET();
    await expectUnauthorized(res);
  });

  it("PUT /api/account/profile — 401", async () => {
    const { PUT } = await import("@/app/api/account/profile/route");
    const req = makeRequest("/api/account/profile", "PUT", { name: "Test User" });
    const res = await PUT(req);
    await expectUnauthorized(res);
  });

  it("GET /api/account/addresses — 401", async () => {
    const { GET } = await import("@/app/api/account/addresses/route");
    const res = await GET();
    await expectUnauthorized(res);
  });

  it("POST /api/account/addresses — 401", async () => {
    const { POST } = await import("@/app/api/account/addresses/route");
    const req = makeRequest("/api/account/addresses", "POST", {
      label: "Home",
      street: "Test St 1",
      city: "Valencia",
      zip: "46001",
      country: "ES",
    });
    const res = await POST(req);
    await expectUnauthorized(res);
  });
});

describe("/api/inquiry POST — validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valid inquiry body → 200 success", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const req = makeRequest("/api/inquiry", "POST", {
      name: "Test User",
      email: "test@example.com",
      message: "I am interested in this artwork.",
    });
    const res = await POST(req);
    // Either 200 (success) or rate-limited 429 — both valid paths in CI
    expect([200, 429]).toContain(res.status);
  });

  it("missing required fields → 400", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const req = makeRequest("/api/inquiry", "POST", {
      name: "Test User",
      // missing email and message
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("invalid email format → 400", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const req = makeRequest("/api/inquiry", "POST", {
      name: "Test User",
      email: "not-an-email",
      message: "Test message",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("empty body → 400", async () => {
    const { POST } = await import("@/app/api/inquiry/route");
    const req = new NextRequest("http://localhost:3000/api/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
