/**
 * Page Object — Login.
 *
 * Locators are role/label-based (getByLabel/getByRole), never CSS or XPath:
 * they read like the user's intent and survive markup refactors, which is the
 * single biggest source of "the tests broke but the app didn't".
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Password");
    this.submit = page.getByRole("button", { name: "Sign in" });
    this.error = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
