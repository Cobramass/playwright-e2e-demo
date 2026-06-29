import { test, expect } from "../fixtures.js";

test.describe("cart", () => {
  test("adding products updates the cart count", async ({ shopPage, productsPage }) => {
    await expect(productsPage.cartCount).toHaveText("0");
    await productsPage.addToCart("Wireless Mouse");
    await expect(productsPage.cartCount).toHaveText("1");
    await productsPage.addToCart("Mechanical Keyboard");
    await expect(productsPage.cartCount).toHaveText("2");
  });

  test("cart shows the right line items and total", async ({ shopPage, productsPage, cartPage }) => {
    await productsPage.addToCart("Mechanical Keyboard"); // 89.00
    await productsPage.addToCart("Wireless Mouse"); //       39.50
    await productsPage.openCart();

    await expect(cartPage.heading).toBeVisible();
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.total).toHaveText("£128.50");
  });

  test("removing an item updates total, count, and empties correctly", async ({ shopPage, productsPage, cartPage }) => {
    await productsPage.addToCart("27\" Monitor"); // 219.00
    await productsPage.addToCart("Wireless Mouse"); // 39.50
    await productsPage.openCart();
    await expect(cartPage.total).toHaveText("£258.50");

    await cartPage.removeProduct("27\" Monitor");
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.total).toHaveText("£39.50");

    await cartPage.removeProduct("Wireless Mouse");
    await expect(cartPage.empty).toBeVisible();
    await expect(cartPage.checkout).toBeDisabled();
  });
});
