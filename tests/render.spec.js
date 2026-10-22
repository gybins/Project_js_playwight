import { test, expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage.js";

test("check render", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page).toHaveURL(/#\/login$/);
  await expect(loginPage.username).toBeVisible();
  await expect(loginPage.password).toBeVisible();
  await expect(loginPage.button).toBeVisible();
  await expect(loginPage.button).toBeEnabled();
});
