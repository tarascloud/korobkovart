import { defineConfig, devices } from '@playwright/test';

// Default: local dev server (webServer below). Set BASE_URL to run against a
// deployed instance (e.g. BASE_URL=https://ko.taras.cloud for prod smoke) —
// in that case the local webServer is NOT started.
const baseURL = process.env.BASE_URL || 'http://localhost:3100';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // WebKit (Safari) — important for e-commerce: payment flows, form autofill,
    // and CSS rendering differ significantly between Blink and WebKit engines.
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run dev -- --port 3100',
        url: 'http://localhost:3100',
        reuseExistingServer: true,
        timeout: 30000,
        env: {
          DATABASE_URL: 'postgresql://korobkov:korobkov@localhost:5432/korobkov',
        },
      },
});
