export default class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByRole("textbox", {
      name: "Username",
    });

    this.password = page.getByLabel("Password");

    this.button = page.getByRole("button", {
      name: "Sign in",
    });

    this.avatar = page.getByText("Jane Doe", {
      exact: true,
    });

    this.profileButton = page.getByRole("button", {
      name: "Profile",
    });

    this.logoutButton = page.getByRole("menuitem", { name: "Logout" });
  }

  async goto() {
    await this.page.goto("/");
  }

  async login(username, password) {
    await this.username.click();
    await this.username.fill(username);

    await this.password.fill(password);

    await this.button.click();
  }

  async logout() {
    await this.profileButton.click();
    await this.logoutButton.click();
  }
}