import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: '@vitest/coverage-v8',
      thresholds: {
        lines: 60,
        functions: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
