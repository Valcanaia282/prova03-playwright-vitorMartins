import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/scenarios',
  reporter: [['html', { outputFolder: 'artifacts/report' }]],
});
