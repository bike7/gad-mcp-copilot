import { Page, Locator } from "@playwright/test";
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
    await this.dropdownButton.click();
    return this;
  }

  getUsernameElement(): Locator {
    return this.usernameElement;
  }
}
