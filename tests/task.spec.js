import { uniqueName } from "./helpers/data.js";
import { test, expect } from "./fixtures/auth.js";
import TaskPage from "../pages/TaskPage.js";

test("check task create form", async ({ page }) => {
  const taskPage = new TaskPage(page);

  await taskPage.goto();
  await taskPage.openCreateForm();

  await expect(page).toHaveURL(/\/#\/tasks\/create$/);

  await expect(taskPage.assignee).toBeVisible();
  await expect(taskPage.title).toBeVisible();
  await expect(taskPage.content).toBeVisible();
  await expect(taskPage.status).toBeVisible();
  await expect(taskPage.label).toBeVisible();
  await expect(taskPage.saveButton).toBeVisible();
});

test("create task", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const title = uniqueName("create");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title,
    content: "Task created by Playwright",
    status: "To Review",
    label: "enhancement",
  });

  await expect(taskPage.successMessage).toBeVisible();
  await expect(taskPage.title).toHaveValue(title);
  await expect(taskPage.content).toHaveValue("Task created by Playwright");
});

test("task list", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const title = uniqueName("list");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title,
    content: "Task list test",
    status: "Draft",
    label: "task",
  });

  await taskPage.goto();
  await expect(taskPage.getTaskCard(title)).toBeVisible();
});

test("open edit task form", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const title = uniqueName("edit-form");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title,
    content: "Open edit form test",
    status: "Draft",
    label: "task",
  });

  await taskPage.goto();
  await taskPage.openTaskEdit(title);

  await expect(taskPage.assignee).toContainText("sarah@example.com");
  await expect(taskPage.title).toHaveValue(title);
  await expect(taskPage.content).toHaveValue("Open edit form test");
  await expect(taskPage.status).toContainText("Draft");
  await expect(taskPage.label).toContainText("task");
});

test("edit task", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const oldTitle = uniqueName("before-edit");
  const newTitle = uniqueName("after-edit");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title: oldTitle,
    content: "Before update",
    status: "Draft",
    label: "task",
  });

  await taskPage.goto();
  await taskPage.openTaskEdit(oldTitle);

  await expect(taskPage.title).toHaveValue(oldTitle);
  await expect(taskPage.content).toHaveValue("Before update");
  await taskPage.title.fill(newTitle);
  await taskPage.content.fill("Updated by Playwright");
  await taskPage.saveButton.click();

  await expect(page).toHaveURL(/\/#\/tasks$/);
  await expect(taskPage.updateMessage).toBeVisible();
  await expect(taskPage.getTaskCard(newTitle)).toBeVisible();
  await expect(taskPage.getTaskCard(oldTitle)).toHaveCount(0);
});

test.describe("task filters", () => {
  test.setTimeout(60_000);

  test("filter tasks by label", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueName("label-filter");

    await taskPage.goto();
    await taskPage.openCreateForm();

    await taskPage.createTask({
      assignee: "sarah@example.com",
      title,
      content: "Label filter test",
      status: "Draft",
      label: "critical",
    });

    const excludedTitle = uniqueName("excluded");
    await taskPage.goto();
    await taskPage.openCreateForm();
    await taskPage.createTask({
      assignee: "john@google.com",
      title: excludedTitle,
      content: "Task that must disappear",
      status: "Draft",
      label: "task",
    });

    await taskPage.goto();
    await expect(taskPage.getTaskCard(title)).toBeVisible();
    await expect(taskPage.getTaskCard(excludedTitle)).toBeVisible();
    await taskPage.filterByLabel("critical");
    await expect(taskPage.getTaskCard(excludedTitle)).toHaveCount(0);
    await expect(taskPage.getTaskCard(title)).toBeVisible();
  });

  test("filter tasks by status", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueName("status-filter");

    await taskPage.goto();
    await taskPage.openCreateForm();

    await taskPage.createTask({
      assignee: "sarah@example.com",
      title,
      content: "Status filter test",
      status: "Published",
      label: "task",
    });

    const excludedTitle = uniqueName("excluded");
    await taskPage.goto();
    await taskPage.openCreateForm();
    await taskPage.createTask({
      assignee: "john@google.com",
      title: excludedTitle,
      content: "Task that must disappear",
      status: "Draft",
      label: "task",
    });

    await taskPage.goto();
    await expect(taskPage.getTaskCard(title)).toBeVisible();
    await expect(taskPage.getTaskCard(excludedTitle)).toBeVisible();
    await taskPage.filterByStatus("Published");
    await expect(taskPage.getTaskCard(excludedTitle)).toHaveCount(0);
    await expect(taskPage.getTaskCard(title)).toBeVisible();
  });

  test("filter tasks by assignee", async ({ page }) => {
    const taskPage = new TaskPage(page);
    const title = uniqueName("assignee-filter");

    await taskPage.goto();
    await taskPage.openCreateForm();

    await taskPage.createTask({
      assignee: "john@google.com",
      title,
      content: "Assignee filter test",
      status: "Draft",
      label: "task",
    });

    const excludedTitle = uniqueName("excluded");
    await taskPage.goto();
    await taskPage.openCreateForm();
    await taskPage.createTask({
      assignee: "jack@yahoo.com",
      title: excludedTitle,
      content: "Task that must disappear",
      status: "Draft",
      label: "task",
    });

    await taskPage.goto();
    await expect(taskPage.getTaskCard(title)).toBeVisible();
    await expect(taskPage.getTaskCard(excludedTitle)).toBeVisible();
    await taskPage.filterByAssignee("john@google.com");
    await expect(taskPage.getTaskCard(excludedTitle)).toHaveCount(0);
    await expect(taskPage.getTaskCard(title)).toBeVisible();
  });
});

test("delete task", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const title = uniqueName("delete");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title,
    content: "Task will be deleted",
    status: "Draft",
    label: "task",
  });

  await expect(taskPage.successMessage).toBeVisible();
  await taskPage.deleteButton.click();
  await expect(taskPage.deleteMessage).toBeVisible();
  await expect(page).toHaveURL(/#\/tasks$/);
  await expect(taskPage.createButton).toBeVisible();
  await expect(taskPage.getColumn("Draft")).toBeVisible();
  await expect(taskPage.getTaskCard(title)).toHaveCount(0);
});

test("move task between columns", async ({ page }) => {
  const taskPage = new TaskPage(page);
  const title = uniqueName("drag");

  await taskPage.goto();
  await taskPage.openCreateForm();

  await taskPage.createTask({
    assignee: "sarah@example.com",
    title,
    content: "Drag and drop test",
    status: "Draft",
    label: "task",
  });

  await expect(taskPage.successMessage).toBeVisible();

  await taskPage.goto();

  const draftColumn = taskPage.getColumn("Draft");
  const reviewColumn = taskPage.getColumn("To Review");

  await expect(draftColumn.getByText(title, { exact: true })).toBeVisible();

  await taskPage.moveTask(title, "To Review");

  await expect(reviewColumn.getByText(title, { exact: true })).toBeVisible();
  await expect(draftColumn.getByText(title, { exact: true })).toHaveCount(0);

  await taskPage.openTaskEdit(title);
  await expect(taskPage.title).toHaveValue(title);
  await expect(taskPage.status).toContainText("To Review");
});

test("empty task cannot be created", async ({ page }) => {
  const taskPage = new TaskPage(page);
  await taskPage.goto();
  await taskPage.openCreateForm();
  await expect(taskPage.saveButton).toBeDisabled();
  await expect(page).toHaveURL(/#\/tasks\/create$/);
  await expect(taskPage.title).toHaveValue("");
  await expect(taskPage.successMessage).toHaveCount(0);
});

test("task requires a title", async ({ page }) => {
  const taskPage = new TaskPage(page);
  await taskPage.goto();
  await taskPage.openCreateForm();
  await taskPage.createTask({
    assignee: "sarah@example.com",
    title: "",
    content: "Missing title",
    status: "Draft",
    label: "task",
  });
  await expect(taskPage.title).toHaveAttribute("aria-invalid", "true");
  await expect(page).toHaveURL(/\/create$/);
  await expect(taskPage.successMessage).toHaveCount(0);
});
