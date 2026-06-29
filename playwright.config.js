import { defineConfig, devices } from "@playwright/test";

/**
 * Config tuned for a deliverable, not a demo:
 *  - fullyParallel + workers: every test is isolated, so they run concurrently
 *  - retries only in CI, and `trace: 'on-first-retry'` so a flake is debuggable
 *    from the published report without slowing the green path
 *  - webServer boots the app and waits for it (no sleeps, no race)
 *  - HTML report is the published artifact (live link on GitHub Pages)
 */
const PORT = 4173;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // a stray test.only fails the CI build
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    command: "node server.mjs",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
