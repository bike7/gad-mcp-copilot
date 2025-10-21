import { defineConfig, devices } from '@playwright/test';

export const DEBUGGING_PORT = 9222;
export default defineConfig({
  testDir: './tests',
  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on',
  },

  projects: [
    {
      name: 'functional',
      testDir: './tests/functional',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'nonfunctional',
      testDir: './tests/nonfunctional',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [`--remote-debugging-port=${DEBUGGING_PORT}`],
        },
      },
    },
  ],
});
