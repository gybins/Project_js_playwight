export default class TaskPage {
  constructor(page) {
    this.page = page;

    this.createButton = page.getByRole("link", { name: "Create", exact: true });

    this.assignee = page.getByRole("combobox", {
      name: /Assignee/i,
    });

    this.title = page.getByRole("textbox", { name: "Title", exact: true });
    this.content = page.getByRole("textbox", { name: "Content", exact: true });

    this.status = page.getByRole("combobox", {
      name: /Status/i,
    });

    this.label = page.getByRole("combobox", {
      name: /Label/i,
    });

    this.saveButton = page.getByRole("button", {
      name: "Save",
    });

    this.deleteButton = page.getByRole("button", {
      name: /Delete/i,
    });

    this.updateMessage = page.getByText("Element updated");
    this.deleteMessage = page.getByText("Element deleted");
    this.successMessage = page.getByText("Element created");
  }

  async goto() {
    await this.page.goto("/#/tasks");
  }

  async openCreateForm() {
    await this.createButton.click();
  }

  async createTask({ assignee, title, content, status, label }) {
    await this.assignee.click();
    await this.page.getByRole("option", { name: assignee }).click();

    await this.title.fill(title);
    await this.content.fill(content);

    await this.status.click();
    await this.page.getByRole("option", { name: status }).click();

    await this.label.click();
    await this.page.getByRole("option", { name: label }).click();

    await this.page.keyboard.press("Escape");

    await this.saveButton.click();
  }

  async openTaskEdit(title) {
    await this.getTaskContainer(title)
      .getByRole("link", { name: "Edit", exact: true })
      .click();
  }

  async filterByAssignee(assignee) {
    await this.assignee.click();
    await this.page.getByRole("option", { name: assignee }).click();
  }

  async filterByStatus(status) {
    await this.status.click();
    await this.page.getByRole("option", { name: status }).click();
  }

  async filterByLabel(label) {
    await this.label.click();
    await this.page.getByRole("option", { name: label }).click();
    await this.page.keyboard.press("Escape");
  }

  getTaskCard(title) {
    return this.page.getByText(title, { exact: true });
  }

  getTaskContainer(title) {
    return this.page.locator("[data-rfd-draggable-id]").filter({
      has: this.getTaskCard(title),
    });
  }

  getColumn(status) {
    return this.page
      .getByText(status, { exact: true })
      .locator("..")
      .locator("[data-rfd-droppable-id]");
  }

  async moveTask(title, targetStatus) {
    const task = this.getTaskContainer(title);
    const targetColumn = this.getColumn(targetStatus);

    await task.scrollIntoViewIfNeeded();

    const taskBox = await task.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    if (!taskBox || !targetBox) {
      throw new Error("Task or target column not found");
    }

    const startX = taskBox.x + taskBox.width / 2;
    const startY = taskBox.y + taskBox.height / 2;
    const endX = targetBox.x + targetBox.width / 2;
    const endY = Math.max(100, targetBox.y + Math.min(40, targetBox.height / 2));

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();

    try {
      await this.page.mouse.move(startX + 15, startY + 15, { steps: 5 });
      await task.and(this.page.locator('[style*="position: fixed"]')).waitFor();
      await this.page.mouse.move(endX, endY, { steps: 30 });
      await this.page.mouse.move(endX, endY);
      await targetColumn.and(this.page.locator(".isDraggingOver")).waitFor();
    } finally {
      await this.page.mouse.up();
    }
  }
}
