/**
 * Custom fixtures — give every test fresh, isolated Page Objects and an
 * optional already-logged-in app. Each test gets its own browser context
 * (Playwright default), so there is no shared state to cause order-dependent
 * flake. The `shopPage` fixture removes login boilerplate from cart/checkout
 * tests without hiding it from the auth tests that actually assert it.
 */
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page.js";
import { ProductsPage } from "./pages/products.page.js";
import { CartPage } from "./pages/cart.page.js";

export const VALID_USER = { email: "buyer@example.com", password: "correct horse" };

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  // A page already authenticated and sitting on the products view.
  shopPage: async ({ page, loginPage, productsPage }, use) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await expect(productsPage.heading).toBeVisible();
    await use(page);
  },
});

export { expect };
