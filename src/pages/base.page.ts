import { Page, Locator } from "@playwright/test";

export class BasePage {
  protected url: string;
  protected expectedUrl: RegExp;
  protected readonly alert: Locator;

  constructor(protected page: Page) {
    this.url = "";
    this.expectedUrl = /.*/;
    this.alert = this.page.getByRole("alert");
  }

  async goto(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  getExpectedUrl(): RegExp {
    return this.expectedUrl;
  }

  getAlert(): Locator {
    return this.alert;
  }
}
