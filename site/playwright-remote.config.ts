import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'https://ko.taras.cloud',
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
