import { test, expect } from "./fixtures/auth.js";
import UserPage from "../pages/UserPage.js";

test("check link create", async ({ page }) => {
  const userAdd = new UserPage(page);

  await userAdd.goto();

  await userAdd.openCreateForm();

  await expect(page).toHaveURL(/\/#\/users\/create$/);
  await expect(userAdd.email).toBeVisible();
  await expect(userAdd.firstName).toBeVisible();
  await expect(userAdd.lastName).toBeVisible();
});

test("create user", async ({ page }) => {
  const saveUser = new UserPage(page);

  await saveUser.goto();

  await saveUser.openCreateForm();

  const email = "test@test.ru";
  const firstName = "Sergeu";
  const lastName = "Gubin";

  await saveUser.createUser(email, firstName, lastName);
  await expect(saveUser.successMessage).toBeVisible();

  await expect(saveUser.email).toHaveValue(email);
  await expect(saveUser.firstName).toHaveValue(firstName);
  await expect(saveUser.lastName).toHaveValue(lastName);
  await saveUser.goto();
  const row = saveUser.getUserRow(email);
  await expect(row).toBeVisible();
  await expect(row).toContainText(firstName);
  await expect(row).toContainText(lastName);
});

test("user list", async ({ page }) => {
  const userPage = new UserPage(page);

  await userPage.goto();

  await expect(userPage.userEmail).toBeVisible();
  await expect(userPage.userFirstName).toBeVisible();
  await expect(userPage.userLastName).toBeVisible();

  const userRow = userPage.getUserRow("john@google.com");

  await expect(userRow).toBeVisible();
  await expect(userRow).toContainText("John");
  await expect(userRow).toContainText("Doe");
});

test("edit user form", async ({ page }) => {
  const editUser = new UserPage(page);

  await editUser.goto();

  const userEmail = "john@google.com";

  await editUser.openUser(userEmail);

  await expect(editUser.email).toBeVisible();
  await expect(editUser.firstName).toBeVisible();
  await expect(editUser.lastName).toBeVisible();

  await expect(editUser.email).toHaveValue(userEmail);
  await expect(editUser.firstName).toHaveValue("John");
  const oldFirstName = await editUser.firstName.inputValue();

  const newFirstName = "Sergei";

  await editUser.firstName.fill(newFirstName);
  await editUser.saveButton.click();

  await expect(page).toHaveURL(/\/#\/users$/);
  await expect(editUser.updateMessage).toBeVisible();

  const userRow = editUser.getUserRow(userEmail);

  await expect(userRow).toContainText(newFirstName);
  await expect(userRow).not.toContainText(oldFirstName);
});

test("reject invalid user email", async ({ page }) => {
  const validEmail = new UserPage(page);
  await validEmail.goto();

  const userEmail = "john@google.com";

  await validEmail.openUser(userEmail);

  await expect(validEmail.email).toHaveValue(userEmail);
  await validEmail.email.fill('"john@google');
  await validEmail.saveButton.click();

  await expect(validEmail.emailError).toBeVisible();
  await expect(validEmail.formErrorEmailMessage).toBeVisible();
});

test("delete user", async ({ page }) => {
  const deleteUser = new UserPage(page);

  await deleteUser.goto();

  const userEmail = "john@google.com";

  await deleteUser.getUserCheckBox(userEmail).check();

  await deleteUser.deleteButton.click();

  await expect(deleteUser.deleteMessage).toBeVisible();

  await expect(deleteUser.getUserRow("john@google.com")).toHaveCount(0);
});

test("delete all users", async ({ page }) => {
  const deleteAllUsers = new UserPage(page);

  await deleteAllUsers.goto();

  await deleteAllUsers.selectAllCheckBox.check();

  await expect(deleteAllUsers.selectAllCheckBox).toBeChecked();

  await deleteAllUsers.deleteButton.click();

  await expect(deleteAllUsers.bulkDeleteMessage).toBeVisible();
  await expect(deleteAllUsers.emptyUsersMessage).toBeVisible();
});

test("empty users cannot be created", async ({ page }) => {
  const form = new UserPage(page);
  await form.goto();
  await form.openCreateForm();
  await expect(form.saveButton).toBeDisabled();
  await expect(page).toHaveURL(/\/create$/);
  await expect(form.email).toHaveValue("");
  await expect(form.firstName).toHaveValue("");
  await expect(form.lastName).toHaveValue("");
});

test("user requires a first name", async ({ page }) => {
  const userPage = new UserPage(page);
  await userPage.goto();
  await userPage.openCreateForm();
  await userPage.createUser("new@example.com", "", "Doe");
  await expect(userPage.firstName).toHaveAttribute("aria-invalid", "true");
  await expect(page).toHaveURL(/\/create$/);
  await expect(userPage.successMessage).toHaveCount(0);
});
