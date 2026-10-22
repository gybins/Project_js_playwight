import { test as base, expect } from "@playwright/test";
import LoginPage from "../../pages/LoginPage.js";
import { credentials } from "../helpers/data.js";

export const test = base.extend({
  page: async ({ page }, provide) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await expect(loginPage.avatar).toBeVisible();
    await provide(page);
  },
});
export { expect };
