export default class StatusPage {
  constructor(page) {
    this.page = page;

    this.createButton = page.getByRole("link", { name: "Create", exact: true });
    this.name = page.getByRole("textbox", { name: "Name", exact: true });
    this.slug = page.getByRole("textbox", { name: "Slug", exact: true });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.successStatusCreate = page.getByText("Element created");
    this.nameHeader = page.getByRole("columnheader", {
      name: /Name/i,
    });

    this.slugHeader = page.getByRole("columnheader", {
      name: /Slug/i,
    });

    this.updateMessage = page.getByText("Element updated");
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.deleteMessage = page.getByText("Element deleted");

    this.selectAllCheckBox = page.getByRole("checkbox", {
      name: "Select all",
    });

    this.bulkDeleteMessage = page.getByText(/elements deleted/);

    this.emptyStatusesMessage = page.getByText("No Task statuses yet.", {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/#/task_statuses");
  }

  async openCreateForm() {
    await this.createButton.click();
    await this.name.click();
  }

  async createStatus(name, slug) {
    await this.name.fill(name);
    await this.slug.fill(slug);
    await this.saveButton.click();
  }

  getStatusRow(name) {
    return this.page.getByRole("row").filter({
      hasText: name,
    });
  }

  async openStatus(name) {
    await this.getStatusRow(name).click();
  }

  getStatusCheckbox(name) {
    return this.getStatusRow(name).getByRole("checkbox");
  }
}
