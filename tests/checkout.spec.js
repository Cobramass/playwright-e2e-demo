import { test, expect } from "../fixtures.js";

test.describe("checkout", () => {
  test("a full purchase flow ends on a confirmation with an order reference", async ({ shopPage, page, productsPage, cartPage }) => {
    await productsPage.addToCart("Mechanical Keyboard");
    await productsPage.openCart();
    await cartPage.placeOrder();

    await expect(page.getByRole("heading", { name: "Order confirmed" })).toBeVisible();
    await expect(page.getByTestId("order-ref")).toHaveText(/^ORD-\d+$/);
  });

  test("checkout clears the cart for the next order", async ({ shopPage, page, productsPage, cartPage }) => {
    await productsPage.addToCart("Wireless Mouse");
    await productsPage.openCart();
    await cartPage.placeOrder();

    await page.getByTestId("new-order").click();
    await expect(productsPage.heading).toBeVisible();
    await expect(productsPage.cartCount).toHaveText("0");
  });

  test("checkout is not possible with an empty cart", async ({ shopPage, productsPage, cartPage }) => {
    await productsPage.openCart();
    await expect(cartPage.empty).toBeVisible();
    await expect(cartPage.checkout).toBeDisabled();
  });
});
