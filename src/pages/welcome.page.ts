import { Page, Locator } from "@playwright/test";
import { step } from "allure-js-commons";
import { BasePage } from "./base.page";

export class WelcomePage extends BasePage {
  private readonly dropdownButton: Locator;
  private readonly usernameElement: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "/welcome";
    this.expectedUrl = /.*welcome/;
    this.dropdownButton = this.page.getByTestId("btn-dropdown");
    this.usernameElement = this.page.locator("#username");
  }

  async openUserDropdown(): Promise<this> {
    return await step("Open user dropdown menu", async () => {
      await this.dropdownButton.click();
      return this;
    });
  }

  getUsernameElement(): Locator {
    return this.usernameElement;
  }
}
