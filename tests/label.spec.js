import { uniqueName } from "./helpers/data.js";
import { test, expect } from "./fixtures/auth.js";
import LabelPage from "../pages/LabelPage.js";

test("check label create form", async ({ page }) => {
  const labelPage = new LabelPage(page);

  await labelPage.goto();
  await labelPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/labels\/create$/);
  await expect(labelPage.name).toBeVisible();
  await expect(labelPage.saveButton).toBeVisible();
});

test("create label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const name = uniqueName("automation");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await expect(labelPage.successMessage).toBeVisible();
  await expect(labelPage.name).toHaveValue(name);
});

test("label list", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const name = uniqueName("list");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();

  await expect(labelPage.nameHeader).toBeVisible();

  const labelRow = labelPage.getLabelRow(name);

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText(name);
});

test("open edit label form", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const name = uniqueName("edit-form");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();
  await labelPage.openLabel(name);

  await expect(labelPage.name).toBeVisible();
  await expect(labelPage.name).toHaveValue(name);
});

test("edit label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const oldName = uniqueName("before-edit");
  const newName = uniqueName("after-edit");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(oldName);

  await labelPage.goto();
  await labelPage.openLabel(oldName);

  await expect(labelPage.name).toHaveValue(oldName);
  await labelPage.name.fill(newName);
  await labelPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/labels$/);
  await expect(labelPage.updateMessage).toBeVisible();

  const labelRow = labelPage.getLabelRow(newName);

  await expect(labelRow).toBeVisible();
  await expect(labelRow).toContainText(newName);
  await expect(labelPage.getLabelRow(oldName)).toHaveCount(0);
});

test("delete label", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const name = uniqueName("delete");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);

  await labelPage.goto();

  await labelPage.getLabelCheckbox(name).check();
  await labelPage.deleteButton.click();

  await expect(labelPage.deleteMessage).toBeVisible();
  await expect(labelPage.getLabelRow(name)).toHaveCount(0);
});

test("delete several labels", async ({ page }) => {
  const labelPage = new LabelPage(page);

  const firstLabel = uniqueName("bulk-1");
  const secondLabel = uniqueName("bulk-2");

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(firstLabel);

  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(secondLabel);

  await labelPage.goto();

  await labelPage.getLabelCheckbox(firstLabel).check();
  await labelPage.getLabelCheckbox(secondLabel).check();

  await labelPage.deleteButton.click();

  await expect(labelPage.bulkDeleteMessage).toBeVisible();

  await expect(labelPage.getLabelRow(firstLabel)).toHaveCount(0);
  await expect(labelPage.getLabelRow(secondLabel)).toHaveCount(0);
});
test("empty label cannot be created", async ({ page }) => {
  const form = new LabelPage(page);
  await form.goto();
  await form.openCreateForm();
  await expect(form.saveButton).toBeDisabled();
  await expect(page).toHaveURL(/\/create$/);
  await expect(form.name).toHaveValue("");
});

test("undo label deletion", async ({ page }) => {
  const labelPage = new LabelPage(page);
  const name = uniqueName("undo-delete");
  await labelPage.goto();
  await labelPage.openCreateForm();
  await labelPage.createLabel(name);
  await expect(labelPage.successMessage).toBeVisible();
  await labelPage.goto();
  await expect(labelPage.getLabelRow(name)).toBeVisible();
  await labelPage.getLabelCheckbox(name).check();
  await labelPage.deleteButton.click();
  await expect(labelPage.getLabelRow(name)).toHaveCount(0);
  await labelPage.undoButton.click();
  await expect(labelPage.getLabelRow(name)).toBeVisible();
  await labelPage.openLabel(name);
  await expect(labelPage.name).toHaveValue(name);
});
