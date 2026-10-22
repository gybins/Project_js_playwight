import { test, expect } from "./fixtures/auth.js";
import StatusPage from "../pages/StatusPage.js";

test("check status create form", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();
  await statusPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/task_statuses\/create$/);

  await expect(statusPage.name).toBeVisible();
  await expect(statusPage.slug).toBeVisible();
  await expect(statusPage.saveButton).toBeVisible();
});

test("create status", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();
  await statusPage.openCreateForm();

  const name = "In progress";
  const slug = "in_progress";

  await statusPage.createStatus(name, slug);

  await expect(statusPage.successStatusCreate).toBeVisible();

  await expect(statusPage.name).toHaveValue(name);
  await expect(statusPage.slug).toHaveValue(slug);
  await statusPage.goto();
  await expect(statusPage.getStatusRow(name)).toBeVisible();
  await expect(statusPage.getStatusRow(name)).toContainText(slug);
});

test("status list", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  await expect(statusPage.nameHeader).toBeVisible();
  await expect(statusPage.slugHeader).toBeVisible();

  const statusRow = statusPage.getStatusRow("Draft");

  await expect(statusRow).toBeVisible();
  await expect(statusRow).toContainText("draft");
});

test("open edit status form", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  const statusName = "Draft";

  await statusPage.openStatus(statusName);

  await expect(statusPage.name).toBeVisible();
  await expect(statusPage.slug).toHaveValue("draft");
  await expect(statusPage.name).toHaveValue(statusName);
});

test("edit status form", async ({ page }) => {
  const statusPage = new StatusPage(page);
  await statusPage.goto();
  const oldName = "Draft";
  const newName = "Ready";
  const newSlug = "ready";
  await statusPage.openStatus(oldName);
  await expect(statusPage.name).toHaveValue(oldName);
  await expect(statusPage.slug).toHaveValue("draft");
  await statusPage.name.fill(newName);
  await statusPage.slug.fill(newSlug);
  await statusPage.saveButton.click();
  await expect(page).toHaveURL(/#\/task_statuses$/);
  await expect(statusPage.updateMessage).toBeVisible();
  await expect(statusPage.getStatusRow(newName)).toContainText(newSlug);
  await expect(statusPage.getStatusRow(oldName)).toHaveCount(0);
});

test("delete status", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  const statusName = "Draft";

  await statusPage.getStatusCheckbox(statusName).check();

  await statusPage.deleteButton.click();

  await expect(statusPage.deleteMessage).toBeVisible();

  await expect(
    statusPage.getStatusRow(statusName)
  ).toHaveCount(0);
});

test("delete all statuses", async ({ page }) => {
  const statusPage = new StatusPage(page);

  await statusPage.goto();

  await statusPage.selectAllCheckBox.check();

  await expect(statusPage.selectAllCheckBox).toBeChecked();

  await statusPage.deleteButton.click();

  await expect(statusPage.bulkDeleteMessage).toBeVisible();
  await expect(statusPage.emptyStatusesMessage).toBeVisible();
});
test("empty status cannot be created", async ({ page }) => {
  const form = new StatusPage(page);
  await form.goto();
  await form.openCreateForm();
  await expect(form.saveButton).toBeDisabled();
  await expect(page).toHaveURL(/\/create$/);
  await expect(form.name).toHaveValue("");
  await expect(form.slug).toHaveValue("");
});

test("status requires a name", async ({ page }) => {
  const statusPage = new StatusPage(page);
  await statusPage.goto();
  await statusPage.openCreateForm();
  await statusPage.createStatus("", "new_status");
  await expect(statusPage.name).toHaveAttribute("aria-invalid", "true");
  await expect(page).toHaveURL(/\/create$/);
  await expect(statusPage.successStatusCreate).toHaveCount(0);
});
