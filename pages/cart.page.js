/**
 * Page Object — Cart + checkout.
 */
export class CartPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Your cart" });
    this.total = page.getByTestId("cart-total");
    this.checkout = page.getByTestId("checkout");
    this.empty = page.getByText("Your cart is empty.");
    this.items = page.locator("#cart-list li");
  }

  async removeProduct(productName) {
    await this.page.getByRole("button", { name: `Remove ${productName}` }).click();
  }

  async placeOrder() {
    await this.checkout.click();
  }
}
