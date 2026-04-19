import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    // Default Chromium suite
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // WebKit (Safari) — important for e-commerce: payment flows, form autofill,
    // and CSS rendering differ significantly between Blink and WebKit engines.
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
    timeout: 30000,
    env: {
      DATABASE_URL: 'postgresql://korobkov:korobkov@localhost:5432/korobkov',
    },
  },
});
