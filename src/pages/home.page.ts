import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { RegisterPage } from "./register.page";
import { LoginPage } from "./login.page";

export class HomePage extends BasePage {
  private readonly dropdownButton: Locator;
  private readonly loginLink: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "/";
    this.expectedUrl = /.*\//;
    this.dropdownButton = this.page.getByTestId("btn-dropdown");
    this.loginLink = this.page.getByRole("link", { name: "Login" });
    this.registerLink = this.page.getByRole("link", { name: "Register" });
  }

  async openUserDropdown(): Promise<this> {
    await this.dropdownButton.click();
    return this;
  }

  async clickLogin(): Promise<LoginPage> {
    await this.loginLink.click();
    return new LoginPage(this.page);
  }

  async clickRegister(): Promise<RegisterPage> {
    await this.registerLink.click();
    return new RegisterPage(this.page);
  }
}
