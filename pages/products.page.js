/**
 * Page Object — Products list.
 */
export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Products" });
    this.cartCount = page.getByTestId("cart-count");
    this.viewCart = page.getByTestId("view-cart");
  }

  /** Add a product by its visible name, e.g. "Wireless Mouse". */
  async addToCart(productName) {
    await this.page.getByRole("button", { name: `Add ${productName} to cart` }).click();
  }

  async openCart() {
    await this.viewCart.click();
  }
}
