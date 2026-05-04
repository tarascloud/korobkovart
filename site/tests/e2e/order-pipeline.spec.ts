/**
 * E2E: Order pipeline
 *
 * buyer-flow: Full purchase modal walkthrough (shipping → carrier → contact details → submit → confirmation).
 *   - No auth required; tests the public e-commerce path used by all buyers.
 *
 * admin-flow: Admin order management — verifies auth gate (403/redirect) for unauthenticated
 *   requests. Full OWNER login is Google OAuth and cannot be automated in Playwright without
 *   a real session; the API-gate test ensures the endpoint is protected.
 *
 * Run against local dev:
 *   npx playwright test tests/e2e/order-pipeline.spec.ts
 *
 * Run against live:
 *   BASE_URL=https://ko.taras.cloud npx playwright test tests/e2e/order-pipeline.spec.ts --config=playwright-remote.config.ts
 */

import { test, expect } from '@playwright/test';

// Artwork slug that exists in both dev and prod DB (confirmed seed data).
const ARTWORK_SLUG = 'concrete-flowers';

function artworkPath(baseURL: string | undefined) {
  // Live site redirects /en/gallery/slug → /gallery/slug.
  if (baseURL && baseURL.includes('localhost')) return `/en/gallery/${ARTWORK_SLUG}`;
  return `/gallery/${ARTWORK_SLUG}`;
}

function adminOrdersPath(baseURL: string | undefined) {
  if (baseURL && baseURL.includes('localhost')) return '/en/admin/orders';
  return '/admin/orders';
}

/**
 * Filter out known third-party CSP violations that are not app-level bugs.
 * GTM/GA script blocks are tracked separately (ko.taras.cloud CSP task).
 */
function isCriticalError(msg: string): boolean {
  if (/googletagmanager|google-analytics|gtag/i.test(msg)) return false;
  return /Content Security Policy|Hydration failed|did not match/i.test(msg);
}

/**
 * Open the artwork detail page, wait for full hydration, then open the purchase modal.
 * Returns the Buy button locator for further interaction.
 */
async function openModal(page: import('@playwright/test').Page, baseURL: string | undefined) {
  await page.goto(artworkPath(baseURL), { waitUntil: 'load' });
  // Wait for React hydration: the "Buy This Artwork" button must be interactive (not just present).
  const buyBtn = page.getByRole('button', { name: /Buy This Artwork/i });
  await expect(buyBtn).toBeEnabled({ timeout: 15_000 });
  await buyBtn.click();
  // Wait for the modal to appear using a text locator (matches the h2 "Purchase Artwork").
  await expect(page.locator('text=Purchase Artwork').first()).toBeVisible({ timeout: 8_000 });
  return buyBtn;
}

test.describe('buyer-flow: purchase modal', () => {
  let pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });
  });

  test.afterEach(() => {
    const criticalErrors = pageErrors.filter(isCriticalError);
    expect(
      criticalErrors,
      `CSP/hydration errors:\n${criticalErrors.join('\n')}`,
    ).toHaveLength(0);
  });

  test('purchase modal opens on artwork detail page', async ({ page, baseURL }) => {
    await openModal(page, baseURL);
    // Modal is open — verify key modal content is visible.
    await expect(page.locator('select').first()).toBeVisible({ timeout: 5_000 });
  });

  test('shipping step: country select and calculate button', async ({ page, baseURL }) => {
    await openModal(page, baseURL);

    // Country <select> is visible in shipping step.
    const countrySelect = page.locator('select').first();
    await expect(countrySelect).toBeVisible({ timeout: 5_000 });

    // Select Spain (ES) — closest to Valencia where shipping originates.
    await countrySelect.selectOption('ES');

    // Calculate Shipping button becomes enabled and can be clicked.
    const calcBtn = page.getByRole('button', { name: /Calculate Shipping/i });
    await expect(calcBtn).toBeEnabled({ timeout: 3_000 });
    await calcBtn.click();

    // Shipping options appear after calculation: "Choose Shipping Carrier".
    await expect(page.locator('text=Choose Shipping Carrier').first()).toBeVisible({ timeout: 5_000 });
  });

  test('shipping step: carrier selection enables Proceed to Checkout button', async ({ page, baseURL }) => {
    await openModal(page, baseURL);

    const countrySelect = page.locator('select').first();
    await countrySelect.selectOption('ES');
    await page.getByRole('button', { name: /Calculate Shipping/i }).click();

    // Wait for carrier options.
    await expect(page.locator('text=Choose Shipping Carrier').first()).toBeVisible({ timeout: 5_000 });

    // Click the first carrier button — carriers show price in €.
    const carrierButtons = page.locator('button').filter({ hasText: /€/ });
    await expect(carrierButtons.first()).toBeVisible({ timeout: 5_000 });
    await carrierButtons.first().click();

    // Proceed to Checkout button becomes enabled.
    const proceedBtn = page.getByRole('button', { name: /Proceed to Checkout/i });
    await expect(proceedBtn).toBeEnabled({ timeout: 3_000 });
  });

  test('details step: contact form fields are visible', async ({ page, baseURL }) => {
    await openModal(page, baseURL);

    const countrySelect = page.locator('select').first();
    await countrySelect.selectOption('ES');
    await page.getByRole('button', { name: /Calculate Shipping/i }).click();

    await expect(page.locator('text=Choose Shipping Carrier').first()).toBeVisible({ timeout: 5_000 });
    const carrierButtons = page.locator('button').filter({ hasText: /€/ });
    await carrierButtons.first().click();

    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();

    // Details step: "Your Contact Details" heading visible (h3 in PurchaseModal).
    await expect(page.locator('text=Your Contact Details').first()).toBeVisible({ timeout: 5_000 });
    // Email input inside the modal (scoped to avoid matching the InquiryForm below).
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
  });

  test('full buyer flow: submit order → confirmation screen', async ({ page, baseURL }) => {
    await openModal(page, baseURL);

    // Step 1 — Shipping.
    const countrySelect = page.locator('select').first();
    await countrySelect.selectOption('ES');
    await page.getByRole('button', { name: /Calculate Shipping/i }).click();
    await expect(page.locator('text=Choose Shipping Carrier').first()).toBeVisible({ timeout: 5_000 });
    const carrierButtons = page.locator('button').filter({ hasText: /€/ });
    await carrierButtons.first().click();
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();

    // Step 2 — Contact details.
    await expect(page.locator('text=Your Contact Details').first()).toBeVisible({ timeout: 5_000 });

    // Fill name — the first non-email input in the modal (Full Name field).
    const nameInput = page.locator('input:not([type="email"]):not([type="tel"])').first();
    await nameInput.fill('Test Buyer');

    // The page has two email inputs: one in PurchaseModal (first) and one in InquiryForm (second).
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.fill('testbuyer@example.com');

    // Submit.
    const submitBtn = page.getByRole('button', { name: /Submit Order/i });
    await expect(submitBtn).toBeEnabled({ timeout: 3_000 });
    await submitBtn.click();

    // Step 3 — Confirmation: "Order Request Received!" (t("order_received")).
    await expect(
      page.locator('text=Order Request Received').first(),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('modal can be closed with × button', async ({ page, baseURL }) => {
    await openModal(page, baseURL);

    // Close via the modal close button (aria-label = t("close") = "Close").
    await page.getByRole('button', { name: /^Close$/i }).click();

    // Modal is gone: the country select is no longer visible.
    await expect(page.locator('text=Purchase Artwork').first()).not.toBeVisible({ timeout: 3_000 });
  });
});

test.describe('admin-flow: order management auth gate', () => {
  test('admin orders page redirects unauthenticated to sign-in', async ({ page, baseURL }) => {
    await page.goto(adminOrdersPath(baseURL));
    // NextAuth redirects to /auth/signin.
    await expect(page).toHaveURL(/auth|login|signin/, { timeout: 8_000 });
  });

  test('admin orders API returns 403 without session', async ({ request }) => {
    // PUT /api/admin/orders/:id without auth must return 403.
    const res = await request.put('/api/admin/orders/00000000-0000-0000-0000-000000000000', {
      data: { status: 'CONFIRMED' },
    });
    expect(res.status()).toBe(403);
  });
});
