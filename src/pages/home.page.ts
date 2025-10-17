import { Page, Locator } from "@playwright/test";
import { step } from "allure-js-commons";
import { BasePage } from "./base.page";
import { RegisterPage } from "./register.page";
import { LoginPage } from "./login.page";

export class HomePage extends BasePage {
  private readonly heading: Locator;
  private readonly dropdownButton: Locator;
  private readonly loginLink: Locator;
  private readonly registerLink: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "/";
    this.expectedUrl = /.*\//;
    this.heading = this.page.getByRole("heading", { name: "Welcome on" });
    this.dropdownButton = this.page.getByTestId("btn-dropdown");
    this.loginLink = this.page.getByRole("link", { name: "Login" });
    this.registerLink = this.page.getByRole("link", { name: "Register" });
  }

  async openUserDropdown(): Promise<this> {
    return await step("Open user dropdown menu", async () => {
      await this.dropdownButton.click();
      return this;
    });
  }

  async clickLogin(): Promise<LoginPage> {
    return await step("Click on Login link", async () => {
      await this.loginLink.click();
      return new LoginPage(this.page);
    });
  }

  async clickRegister(): Promise<RegisterPage> {
    return await step("Click on Register link", async () => {
      await this.registerLink.click();
      return new RegisterPage(this.page);
    });
  }

    getPageHeading(): Locator {
    return this.heading;
  }
}
