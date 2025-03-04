import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

export default defineConfig({
  plugins: [],
  test: {
    testTimeout: 100000,
    environment: 'node',
    setupFiles: './__tests__/setup.ts',
    env: {
      ...config().parsed,
    },
  },
  resolve: {
    alias: {
      '@': '/',
    },
  },
});
