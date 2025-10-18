import { DEBUGGING_PORT } from '../../playwright.config';
import { Page } from '@playwright/test';

export class LighthouseHelper {
  static async runAudit(
    page: Page,
    pageName: string,
    thresholds = {
      performance: 50,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
    }
  ) {
    const { playAudit } = await import('playwright-lighthouse');

    await playAudit({
      page,
      thresholds,
      port: DEBUGGING_PORT,
      opts: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
      reports: {
        formats: {
          html: true,
          json: true,
        },
        name: `lighthouse-report-${pageName}`,
        directory: './lighthouse-reports',
      },
    });
  }
}
