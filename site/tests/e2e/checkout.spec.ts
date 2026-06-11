/**
 * E2E: Checkout flow — self-contained fixtures (no pre-seeded DB required)
 *
 * beforeAll seeds its own test data via Prisma (artwork, buyer, OWNER user,
 * INQUIRY order, OWNER DB session) and afterAll removes everything it created.
 *
 * Covered:
 *  1. Buyer: seeded artwork detail page renders + Buy button opens the
 *     purchase modal (UI), public /api/inquiry accepts a valid payload (API).
 *  2. Admin pipeline: INQUIRY → CONFIRMED → SHIPPED via
 *     PUT /api/admin/orders/:id with a *programmatic* OWNER session.
 *     KO uses NextAuth v5 + PrismaAdapter => database session strategy, so an
 *     OWNER session is created by inserting a Session row and setting the
 *     `authjs.session-token` cookie — no Google OAuth flow needed in CI.
 *  3. Auth/validation guards: 401 for unauthenticated admin PUT,
 *     400 for invalid inquiry payload (run even without DB).
 *
 * DB access: uses DATABASE_URL (falls back to the local dev DB used by
 * playwright.config.ts webServer). When the DB is unreachable (e.g. running
 * against https://ko.taras.cloud via playwright-remote.config.ts), the
 * seeded tests are skipped with an explicit reason instead of failing.
 */

import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://korobkov:korobkov@localhost:5432/korobkov';

// All fixture identifiers share this prefix so leftovers from crashed runs
// are swept on the next run (cleanup() runs both before seed and afterAll).
const FIXTURE_SLUG = 'e2e-checkout-fixture-artwork';
const OWNER_EMAIL = 'e2e-checkout-owner@test.invalid';
const BUYER_EMAIL = 'e2e-checkout-buyer@test.invalid';

let prisma: PrismaClient | null = null;
let dbAvailable = false;
let orderId = '';
let ownerSessionToken = '';

function localePath(baseURL: string | undefined, path: string): string {
  // localhost uses /en/ locale prefix; production does not
  if (baseURL && baseURL.includes('localhost')) return `/en${path}`;
  return path;
}

async function cleanup(db: PrismaClient) {
  // Order of deletes respects FK constraints (Order → User/Artwork cascade
  // is not guaranteed, so delete orders first; Session cascades on User).
  await db.order.deleteMany({
    where: { user: { email: { in: [OWNER_EMAIL, BUYER_EMAIL] } } },
  });
  await db.user.deleteMany({ where: { email: { in: [OWNER_EMAIL, BUYER_EMAIL] } } });
  await db.artwork.deleteMany({ where: { slug: FIXTURE_SLUG } });
}

test.beforeAll(async () => {
  try {
    const adapter = new PrismaPg({ connectionString: DATABASE_URL });
    prisma = new PrismaClient({ adapter });
    await prisma.$queryRaw`SELECT 1`;
    dbAvailable = true;
  } catch {
    // DB unreachable (e.g. remote run) — seeded tests will be skipped.
    dbAvailable = false;
    return;
  }

  await cleanup(prisma);

  const artwork = await prisma.artwork.create({
    data: {
      slug: FIXTURE_SLUG,
      title: 'E2E Checkout Fixture',
      year: 2026,
      series: 'podilia',
      medium: 'e2e test fixture',
      dimensions: '100x80 cm',
      status: 'available',
      imagePath: '/artworks/mural-1.jpg',
      sortOrder: 9999,
    },
  });

  const buyer = await prisma.user.create({
    data: { email: BUYER_EMAIL, name: 'E2E Buyer', role: 'BUYER' },
  });

  ownerSessionToken = randomUUID();
  await prisma.user.create({
    data: {
      email: OWNER_EMAIL,
      name: 'E2E Owner',
      role: 'OWNER',
      sessions: {
        create: {
          sessionToken: ownerSessionToken,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1h
        },
      },
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      artworkId: artwork.id,
      status: 'INQUIRY',
      notes: 'E2E checkout fixture order',
    },
  });
  orderId = order.id;
});

test.afterAll(async () => {
  if (prisma) {
    if (dbAvailable) await cleanup(prisma);
    await prisma.$disconnect();
  }
});

test.describe('Buyer checkout inquiry', () => {
  test('seeded artwork detail page renders and Buy opens purchase modal', async ({
    page,
    baseURL,
  }) => {
    test.skip(!dbAvailable, 'DB not reachable — seeded fixture unavailable');

    await page.goto(localePath(baseURL, `/gallery/${FIXTURE_SLUG}`), {
      waitUntil: 'domcontentloaded',
    });

    await expect(
      page.getByRole('heading', { name: /E2E Checkout Fixture/i }).first(),
    ).toBeVisible({ timeout: 15_000 });

    const buyButton = page
      .getByRole('button', { name: /buy|purchase|замовити|купити/i })
      .first();
    await expect(buyButton).toBeVisible({ timeout: 10_000 });
    await buyButton.click();

    // Purchase modal opens (role=dialog with shipping form inside).
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 10_000 });
  });

  test('public inquiry API accepts a valid payload', async ({ page, baseURL }) => {
    const baseUrl = baseURL ?? 'http://localhost:3100';
    const apiResponse = await page.request.post(`${baseUrl}/api/inquiry`, {
      data: {
        name: 'Test Buyer E2E',
        email: 'e2e-test@example.com',
        message: 'I am interested in purchasing this artwork. E2E test.',
        type: 'inquiry',
        subject: 'Artwork purchase inquiry (E2E test)',
      },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(
      apiResponse.status(),
      `Expected 200 from /api/inquiry, got ${apiResponse.status()}`,
    ).toBe(200);

    const body = await apiResponse.json();
    expect(body.success, 'Expected success: true in response').toBe(true);
  });

  test('inquiry API validates required fields', async ({ page, baseURL }) => {
    const baseUrl = baseURL ?? 'http://localhost:3100';
    const response = await page.request.post(`${baseUrl}/api/inquiry`, {
      data: { type: 'purchase' }, // missing required: name, email, message
      headers: { 'Content-Type': 'application/json' },
    });

    expect(
      response.status(),
      `Expected 400 for invalid inquiry payload, got ${response.status()}`,
    ).toBe(400);
  });
});

test.describe('Admin order status pipeline', () => {
  test('unauthenticated PUT to /api/admin/orders/:id returns 401', async ({
    page,
    baseURL,
  }) => {
    const baseUrl = baseURL ?? 'http://localhost:3100';
    const response = await page.request.put(
      `${baseUrl}/api/admin/orders/non-existent-order-id`,
      {
        data: { status: 'CONFIRMED' },
        headers: { 'Content-Type': 'application/json' },
      },
    );

    expect(
      [401, 403, 302].includes(response.status()),
      `Expected 401/403/302 for unauthenticated admin request, got ${response.status()}`,
    ).toBe(true);
  });

  test('OWNER transitions order INQUIRY → CONFIRMED → SHIPPED', async ({
    browser,
    baseURL,
  }) => {
    test.skip(!dbAvailable, 'DB not reachable — seeded fixture unavailable');

    const baseUrl = baseURL ?? 'http://localhost:3100';
    const { hostname, protocol } = new URL(baseUrl);
    const isHttps = protocol === 'https:';

    const context = await browser.newContext({ baseURL: baseUrl });
    // NextAuth v5 database session: the cookie value IS the Session.sessionToken.
    // On https the cookie name carries the __Secure- prefix.
    await context.addCookies([
      {
        name: isHttps ? '__Secure-authjs.session-token' : 'authjs.session-token',
        value: ownerSessionToken,
        domain: hostname,
        path: '/',
        httpOnly: true,
        secure: isHttps,
        sameSite: 'Lax',
      },
    ]);

    try {
      for (const status of ['CONFIRMED', 'SHIPPED'] as const) {
        const res = await context.request.put(`/api/admin/orders/${orderId}`, {
          data: { status },
          headers: { 'Content-Type': 'application/json' },
        });
        expect(
          res.status(),
          `Expected 200 transitioning order to ${status}, got ${res.status()}`,
        ).toBe(200);
        const body = await res.json();
        expect(body.status, `API should echo new status ${status}`).toBe(status);
      }

      // Verify final state directly in the DB.
      const dbOrder = await prisma!.order.findUnique({ where: { id: orderId } });
      expect(dbOrder?.status, 'Order should be SHIPPED in DB').toBe('SHIPPED');
    } finally {
      await context.close();
    }
  });
});
