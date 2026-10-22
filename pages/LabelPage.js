export default class LabelPage {
  constructor(page) {
    this.page = page;

    this.createButton = page.getByRole("link", { name: "Create", exact: true });

    this.name = page.getByRole("textbox", { name: "Name", exact: true });

    this.saveButton = page.getByRole("button", {
      name: "Save",
    });

    this.nameHeader = page.getByRole("columnheader", {
      name: /Name/i,
    });

    this.successMessage = page.getByText("Element created");
    this.updateMessage = page.getByText("Element updated");

    this.deleteButton = page.getByRole("button", {
      name: "Delete",
    });

    this.undoButton = page.getByRole("button", { name: "Undo", exact: true });
    this.deleteMessage = page.getByText("Element deleted");

    this.selectAllCheckbox = page.getByRole("checkbox", {
      name: "Select all",
    });

    this.bulkDeleteMessage = page.getByText(/elements deleted/);

    this.emptyLabelsMessage = page.getByText("No Labels yet.", {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/#/labels");
  }

  async openCreateForm() {
    await this.createButton.click();
    await this.name.click();
  }

  async createLabel(name) {
    await this.name.fill(name);
    await this.saveButton.click();
  }

  getLabelRow(name) {
    return this.page.getByRole("row").filter({
      hasText: name,
    });
  }

  async openLabel(name) {
    await this.getLabelRow(name).click();
  }

  getLabelCheckbox(name) {
    return this.getLabelRow(name).getByRole("checkbox");
  }
}
