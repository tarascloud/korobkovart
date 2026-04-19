import { test, expect } from '@playwright/test';

test('admin login redirects unauthenticated', async ({ page }) => {
  await page.goto('/ua/admin');
  await expect(page).toHaveURL(/auth|login/);
});

test('public homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
