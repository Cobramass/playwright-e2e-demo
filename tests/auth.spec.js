import { test, expect, VALID_USER } from "../fixtures.js";

test.describe("authentication", () => {
  test("valid credentials sign the user in", async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await expect(productsPage.heading).toBeVisible();
  });

  test("invalid credentials show an error and keep the user out", async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, "wrong password");
    await expect(loginPage.error).toHaveText("Invalid email or password.");
    await expect(productsPage.heading).toBeHidden();
  });

  test("empty submission does not sign in", async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.submit.click();
    await expect(productsPage.heading).toBeHidden();
    await expect(loginPage.error).toBeVisible();
  });
});
