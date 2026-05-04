import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3100';
const isRemote = !BASE_URL.includes('localhost');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
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
  // Only start local dev server when not using a remote BASE_URL
  ...(isRemote ? {} : {
    webServer: {
      command: 'npm run dev -- --port 3100',
      url: 'http://localhost:3100',
      reuseExistingServer: true,
      timeout: 30000,
      env: {
        DATABASE_URL: 'postgresql://korobkov:korobkov@localhost:5432/korobkov',
      },
    },
  }),
});
