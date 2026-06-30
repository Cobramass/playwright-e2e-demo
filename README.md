# Playwright E2E demo — a suite you can trust

[![e2e](https://github.com/Cobramass/playwright-e2e-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/Cobramass/playwright-e2e-demo/actions/workflows/ci.yml)

A production-shaped end-to-end test suite for a small web app (login → browse → cart →
checkout). It's a portfolio demo, but it's built to the bar that separates a test suite a team
actually relies on from one they delete after a week of false alarms.

The app under test (`app/`) is a deliberately tiny, fully deterministic SPA — no backend, no
network, no clock — so the suite is reproducible to the byte. The same framework points at a
real app by changing the Page Objects and `baseURL`.

## The bar this demonstrates

| Concern | How it's done |
|---|---|
| **No flake** | Full chromium suite runs **10× per push** (`npm run flake-check`) and must stay green — a green streak is the single most persuasive proof. Verified locally: **90/90**. |
| **Web-first assertions** | Every check is an auto-retrying `expect(locator)` (`toBeVisible`, `toHaveText`, `toBeDisabled`). **Zero `waitForTimeout`** — enforced by ESLint. |
| **Role-based locators** | `getByRole` / `getByLabel` / `getByTestId` throughout (see `pages/`). No brittle CSS or XPath. |
| **Real assertions everywhere** | No action-only tests — ESLint `expect-expect` fails the build if a test asserts nothing. |
| **Structure** | Page Object Model (`pages/`) + custom fixtures (`fixtures.js`); every test gets its own browser context, so there's no order-dependent state. |
| **CI** | GitHub Actions: lint → **sharded** parallel run (2 shards) → merged **HTML report published to GitHub Pages** → separate flake-check job. `trace: 'on-first-retry'`. |
| **Guardrails** | `forbidOnly` fails CI on a stray `test.only`; `eslint-plugin-playwright` catches floating-promise (un-awaited) locator calls — the #1 cause of silent false passes. |

## Run it

```bash
npm install
npx playwright install chromium firefox   # one-time browser download
npm test            # run the suite (auto-starts the app server)
npm run flake-check # the full chromium suite, 10× each — proves stability
npm run report      # open the HTML report from the last run
npm run lint        # the anti-flake lint rules
```

> On a busy Windows machine you may hit `spawn UNKNOWN` when launching many browsers at once
> (OS process saturation, not a test fault). Add `--workers=2` if so; CI runners are clean.

## Layout

```
app/            the deterministic web app under test (html/css/js)
server.mjs      zero-dependency static server (Playwright webServer starts it)
pages/          Page Objects — login / products / cart
fixtures.js     POM injection + a logged-in fixture
tests/          auth.spec.js · cart.spec.js · checkout.spec.js
playwright.config.js   parallel, retries-in-CI, trace, HTML report
eslint.config.js       anti-flake lint rules
.github/workflows/ci.yml   lint · sharded e2e · flake-check · Pages publish
```

## What changes for a real client app

1. **Targets** — point `baseURL` at their app; update the Page Object locators.
2. **Auth/state** — swap the in-memory login for their real auth (Playwright `storageState`
   to log in once and reuse the session across tests — faster, still isolated).
3. **The report link** — the published HTML report becomes the live, shareable proof that the
   suite is green; the flake-check job keeps it honest as the app changes (the maintenance retainer).

Built by Matthew Daly — Playwright / E2E test automation, delivered with CI and a live report.
