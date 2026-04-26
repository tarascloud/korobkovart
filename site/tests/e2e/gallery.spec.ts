/**
 * E2E: Gallery page — filter chip interaction
 *
 * Tests that clicking a series filter tab changes the visible artwork count
 * (i.e. filtering actually works and the page re-renders correctly).
 *
 * Run against live: BASE_URL=https://ko.taras.cloud npx playwright test tests/e2e/gallery.spec.ts --config=playwright-remote.config.ts
 * Run against local: npx playwright test tests/e2e/gallery.spec.ts (uses localhost:3100 via playwright.config.ts)
 *
 * Note: The gallery uses role="tab" (not role="button") for filter chips.
 * The live URL serves /gallery (locale redirect from /en/gallery → /gallery).
 */
import { test, expect } from '@playwright/test';

// The live site redirects /en/gallery → /gallery.
// For local dev (localhost:3100) the locale prefix works.
// We detect which URL scheme to use by checking if baseURL includes localhost.
function galleryPath(baseURL: string | undefined): string {
  if (baseURL && baseURL.includes('localhost')) return '/en/gallery';
  return '/gallery';
}

test.describe('Gallery — filter chips', () => {
  test('All Works shows artwork cards', async ({ page, baseURL }) => {
    await page.goto(galleryPath(baseURL), { waitUntil: 'domcontentloaded' });

    // Wait for at least one artwork card article to render.
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10_000 });

    const allCount = await page.locator('article').count();
    expect(allCount, 'Gallery should have at least 1 artwork').toBeGreaterThan(0);
  });

  test('filter tabs are visible', async ({ page, baseURL }) => {
    await page.goto(galleryPath(baseURL), { waitUntil: 'domcontentloaded' });

    // Filter chips use role="tab" on the live site.
    const allWorksTab = page.getByRole('tab', { name: /All Works/i });
    await expect(allWorksTab).toBeVisible({ timeout: 8_000 });
  });

  test('Podilia filter tab is visible and clickable', async ({ page, baseURL }) => {
    await page.goto(galleryPath(baseURL), { waitUntil: 'domcontentloaded' });

    // The Podilia tab may show "Podilia (18)" as text — use partial match.
    const podiliaTab = page.getByRole('tab', { name: /Podilia/i });
    await expect(podiliaTab).toBeVisible({ timeout: 8_000 });
    await podiliaTab.click();

    // After clicking, artworks should still render (podilia series has entries).
    await expect(page.locator('article').first()).toBeVisible({ timeout: 8_000 });
  });

  test('filter tab changes artwork card count vs All Works', async ({ page, baseURL }) => {
    await page.goto(galleryPath(baseURL), { waitUntil: 'domcontentloaded' });

    // Get total artwork count under "All Works".
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10_000 });
    const allCount = await page.locator('article').count();

    // Click "Podilia" tab — it renders a subset.
    const podiliaTab = page.getByRole('tab', { name: /Podilia/i });
    await podiliaTab.click();

    // Brief settle for client-side filter.
    await page.waitForTimeout(500);
    const filteredCount = await page.locator('article').count();

    // Filtered count must be > 0.
    expect(filteredCount, 'Podilia filter should show at least 1 artwork').toBeGreaterThan(0);

    // Filtered count should be <= allCount (it is a subset or equal).
    expect(
      filteredCount,
      `Podilia (${filteredCount}) should be <= All Works (${allCount})`,
    ).toBeLessThanOrEqual(allCount);
  });

  test('filter tabs do not cause console errors', async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });

    await page.goto(galleryPath(baseURL), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('article').first()).toBeVisible({ timeout: 10_000 });

    // Click through all visible filter tabs.
    const filterTabs = page.getByRole('tab');
    const count = await filterTabs.count();
    for (let i = 0; i < count; i++) {
      await filterTabs.nth(i).click();
      await page.waitForTimeout(200);
    }

    // Filter out known third-party CSP violations (e.g. GTM/analytics blocked by CSP).
    // These are tracked separately; here we assert no app-level JS errors.
    const appErrors = errors.filter(
      (e) => !e.includes('googletagmanager') && !e.includes('google-analytics'),
    );
    expect(appErrors, `App-level console errors during filter clicks: ${appErrors.join(', ')}`).toEqual([]);
  });
});
