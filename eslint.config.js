import playwright from "eslint-plugin-playwright";

/**
 * Flat ESLint config. The Playwright plugin's recommended rules enforce the
 * exact failure modes that make E2E suites flaky:
 *   - missing-playwright-await  → catches floating-promise locator/expect calls
 *     (the practical equivalent of no-floating-promises for Playwright)
 *   - no-wait-for-timeout       → bans hard sleeps in favour of web-first waits
 *   - expect-expect             → every test must actually assert something
 *   - no-skipped-test / no-focused-test → no silently disabled coverage
 */
export default [
  {
    ignores: ["node_modules/", "playwright-report/", "test-results/"],
  },
  {
    ...playwright.configs["flat/recommended"],
    files: ["tests/**/*.js", "pages/**/*.js", "fixtures.js"],
  },
];
