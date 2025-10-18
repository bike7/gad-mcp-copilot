import { Locator, Page } from '@playwright/test';
import { step } from 'allure-js-commons';

export class BasePage {
  protected url: string;
  protected expectedUrl: RegExp;
  protected expectedPageHeader: string;
  protected readonly alert: Locator;

  constructor(protected page: Page) {
    this.url = '';
    this.expectedUrl = /.*/;
    this.expectedPageHeader = '';
    this.alert = this.page.getByRole('alert');
  }

  async goto(): Promise<this> {
    return await step(`Navigate to ${this.constructor.name}`, async () => {
      await this.page.goto(this.url);
      return this;
    });
  }

  getExpectedUrl(): RegExp {
    return this.expectedUrl;
  }

  getAlert(): Locator {
    return this.alert;
  }

  getExpectedPageHeader(): string {
    return this.expectedPageHeader;
  }
}
