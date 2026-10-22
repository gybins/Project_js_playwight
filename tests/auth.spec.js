import { test, expect } from "@playwright/test";
import { credentials } from "./helpers/data.js";
import LoginPage from "../pages/LoginPage.js";

test("Successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const { username, password } = credentials;

  await loginPage.login(username, password);

  await expect(loginPage.avatar).toBeVisible();
});

test("Successful logout", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  const { username, password } = credentials;

  await loginPage.login(username, password);

  await expect(loginPage.avatar).toBeVisible();

  await loginPage.logout();

  await expect(loginPage.button).toBeVisible();
});
test("empty login form is rejected", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.button.click();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(loginPage.username).toHaveAttribute("aria-invalid", "true");
  await expect(loginPage.password).toHaveAttribute("aria-invalid", "true");
  await expect(loginPage.profileButton).toHaveCount(0);
});
