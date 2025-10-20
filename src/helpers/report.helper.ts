import test, { Page } from '@playwright/test';

export class ReportHelper {
  static extractPageNameFromUrl(page: Page): string {
    const url = new URL(page.url());
    const pathname = url.pathname.replace(/\/$/, '');
    let pageName = pathname === '' ? 'home' : pathname.slice(1);
    // Remove .html extension if present
    pageName = pageName.replace(/\.html$/, '');
    return pageName;
  }

  static async attachToPlaywrightReport(
    reportFileName: string,
    reportFilePath: string
  ): Promise<void> {
    await test.info().attach(reportFileName, {
      path: reportFilePath,
      contentType: 'text/html',
    });
  }
}
