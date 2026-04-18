import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/en');
    await expect(page).toHaveTitle(/Korobkov Art Studio/);
    await expect(page.locator('text=Korobkov').first()).toBeVisible();
    await expect(page.locator('text=View Gallery')).toBeVisible();
  });

  test('gallery page shows artworks', async ({ page }) => {
    await page.goto('/en/gallery');
    await expect(page.locator('h1').last()).toContainText('Gallery');
    // Filter buttons visible
    await expect(page.getByRole('button', { name: /All Works/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Podilia/ })).toBeVisible();
    // At least one artwork card
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('artwork detail page', async ({ page }) => {
    await page.goto('/en/gallery/concrete-flowers');
    await expect(page.locator('h1').last()).toContainText('Concrete flowers');
    await expect(page.getByText('2023', { exact: true })).toBeVisible();
    await expect(page.locator('text=Available')).toBeVisible();
    await expect(page.locator('text=Buy This Artwork')).toBeVisible();
  });

  test('about page loads', async ({ page }) => {
    await page.goto('/en/about');
    await expect(page.locator('h1').last()).toContainText('About');
    await expect(page.locator('text=Mykhailo Korobkov')).toBeVisible();
  });

  test('contact page has form', async ({ page }) => {
    await page.goto('/en/contact');
    await expect(page.locator('h1').last()).toContainText('Contact');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('language switch works', async ({ page }) => {
    await page.goto('/en');
    await page.click('button:text("UA")');
    await page.waitForURL(/\/ua/);
    await expect(page.locator('text=Галерея')).toBeVisible();
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

  test('exhibitions page loads', async ({ page }) => {
    await page.goto('/en/exhibitions');
    await expect(page.locator('h1')).toContainText('Exhibition');
    await expect(page.locator('text=BSMT Art Gallery')).toBeVisible();
  });

  test('sign in link visible', async ({ page }) => {
    await page.goto('/en');
    // User icon should be visible (not logged in)
    await expect(page.locator('a[title="Sign in"]')).toBeVisible();
  });
});
