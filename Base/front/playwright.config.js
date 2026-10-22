// front/playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5174/~ribatet1/SAE-3.01/Base/',
  },
  webServer: {
    command: 'npm run dev -- --port 5174 --strictPort',
    url: 'http://localhost:5174/~ribatet1/SAE-3.01/Base/',
    reuseExistingServer: false,
  },
});