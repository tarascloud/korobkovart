import { test, expect, expectNoJSErrors, expectNoCspErrors } from "./fixtures";

test.describe("Smoke tests", () => {
  test("home page loads without JS errors", async ({ page, jsErrors }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Korobkov Art Studio/);
    await expect(page.locator("text=Korobkov").first()).toBeVisible();
    expectNoCspErrors(jsErrors);
    expectNoJSErrors(jsErrors);
  });

  test("gallery page shows artworks without JS errors", async ({ page, jsErrors }) => {
    await page.goto("/en/gallery");
    await expect(page.locator("h1").last()).toBeVisible();
    await expect(page.locator("article").first()).toBeVisible();
    expectNoCspErrors(jsErrors);
    expectNoJSErrors(jsErrors);
  });

  test("artwork detail page without JS errors", async ({ page, jsErrors }) => {
    await page.goto("/en/gallery/concrete-flowers");
    await expect(page.locator("h1").last()).toBeVisible();
    expectNoCspErrors(jsErrors);
    expectNoJSErrors(jsErrors);
  });

  test("about page loads without JS errors", async ({ page, jsErrors }) => {
    await page.goto("/en/about");
    await expect(page.locator("h1").last()).toBeVisible();
    expectNoCspErrors(jsErrors);
    expectNoJSErrors(jsErrors);
  });

  test("contact page has form without JS errors", async ({ page, jsErrors }) => {
    await page.goto("/en/contact");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    expectNoCspErrors(jsErrors);
    expectNoJSErrors(jsErrors);
  });

  test("sign in link visible", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator('a[title="Sign in"]')).toBeVisible();
  });
});
