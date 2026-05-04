import { test as base, expect, type Page } from "@playwright/test";

/** React hydration errors to ignore in JS error checks */
const IGNORED_ERRORS = [
  /Minified React error #418/, // hydration text mismatch
  /Minified React error #423/, // hydration node mismatch
  /Minified React error #425/, // hydration resuming error
  /hydration/i,
];

function isIgnoredError(msg: string): boolean {
  return IGNORED_ERRORS.some((re) => re.test(msg));
}

/**
 * Extended test fixture that tracks JS errors (filtering hydration noise)
 * and provides helper methods for common assertions.
 */
export const test = base.extend<{
  /** Collected JS errors (excluding known hydration noise) */
  jsErrors: string[];
}>({
  jsErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => {
      if (!isIgnoredError(err.message)) {
        errors.push(err.message);
      }
    });
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isIgnoredError(msg.text())) {
        errors.push(msg.text());
      }
    });
    await use(errors);
  },
});

export { expect };

/** Assert no unexpected JS errors were collected */
export function expectNoJSErrors(errors: string[]) {
  expect(errors, "Unexpected JS errors on page").toHaveLength(0);
}

/** Assert no CSP violations in collected errors */
export function expectNoCspErrors(errors: string[]) {
  const cspErrors = errors.filter((e) =>
    /Content Security Policy/i.test(e)
  );
  expect(
    cspErrors,
    `CSP violations found:\n${cspErrors.join("\n")}`
  ).toHaveLength(0);
}

/** Navigate and wait for the page to be interactive */
export async function goTo(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
}
