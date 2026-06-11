import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  let pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });
  });

  test.afterEach(() => {
    const cspErrors = pageErrors.filter((e) =>
      /Content Security Policy|Hydration failed|did not match/i.test(e)
    );
    expect(
      cspErrors,
      `CSP/hydration errors found:\n${cspErrors.join('\n')}`
    ).toHaveLength(0);
  });

  test('home page loads', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Korobkov Art Studio/);
    await expect(page.locator('text=Korobkov').first()).toBeVisible();
    await expect(page.locator('text=View Gallery').first()).toBeVisible();
  });

  test('gallery page shows artworks', async ({ page }) => {
    await page.goto('/en/gallery');
    await expect(page.locator('h1').last()).toContainText('Gallery');
    // Filter tabs visible (rendered as role="tab", not "button")
    await expect(page.getByRole('tab', { name: /All Works/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Podilia/ })).toBeVisible();
    // At least one artwork card
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('artwork detail page', async ({ page }) => {
    await page.goto('/en/gallery/concrete-flowers');
    await expect(page.locator('h1').last()).toContainText('Concrete flowers');
    await expect(page.getByText('2023', { exact: true })).toBeVisible();
    await expect(page.locator('text=Available').first()).toBeVisible();
    await expect(page.locator('text=Buy This Artwork').first()).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/en/about');
    // Current about page: h1 is the studio name, "Artist Statement" section below
    await expect(page.locator('h1').last()).toContainText('Korobkov Art Studio');
    await expect(page.getByRole('heading', { name: /Artist Statement/i })).toBeVisible();
  });

  test('contact page has form', async ({ page }) => {
    await page.goto('/en/contact');
    // Current contact page has no h1; the inquiry form heading is an h2
    await expect(page.getByRole('heading', { name: /send us a message/i })).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('language switch works', async ({ page }) => {
    await page.goto('/en');
    await page.click('button:text("UA")');
    await page.waitForURL(/\/ua/);
    await expect(page.locator('text=Галерея').first()).toBeVisible();
  });

  test('gallery filter works', async ({ page }) => {
    await page.goto('/en/gallery');
    await page.click('button:text("Podilia")');
    // Should still show artworks (podilia series)
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('purchase modal opens', async ({ page }) => {
    await page.goto('/en/gallery/concrete-flowers');
    await page.click('button:text("Buy This Artwork")');
    await expect(page.locator('text=Purchase Artwork')).toBeVisible();
    await expect(page.locator('select').first()).toBeVisible(); // country dropdown
  });

  // 'exhibitions page loads' removed: /en/exhibitions route no longer exists
  // (returns 404); CV page covers the secondary-content-page smoke instead.
  test('cv page loads', async ({ page }) => {
    await page.goto('/en/cv');
    await expect(page.getByRole('heading', { name: /Biography/i })).toBeVisible();
  });

  test('sign in link visible', async ({ page }) => {
    await page.goto('/en');
    // User icon should be visible (not logged in)
    await expect(page.locator('a[title="Sign in"]')).toBeVisible();
  });
});
