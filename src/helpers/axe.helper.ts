import { ReportHelper } from './report.helper';
import { AxeBuilder } from '@axe-core/playwright';
import { Page } from '@playwright/test';
import { createHtmlReport } from 'axe-html-reporter';
import path from 'path';
const AXE_REPORT_DIRECTORY = './accessibility-reports';
export class AxeHelper {
  static async analyzeAccessibility(
    page: Page
  ): Promise<Awaited<ReturnType<AxeBuilder['analyze']>>> {
    return await new AxeBuilder({ page }).analyze();
  }

  static async createAccessibilityReport(
    page: Page,
    accessibilityScanResults: Awaited<ReturnType<AxeBuilder['analyze']>>
  ): Promise<void> {
    const pageName = ReportHelper.extractPageNameFromUrl(page);
    const reportFileName = `accessibility-report-${pageName}-page.html`;
    AxeHelper.generateHTMLReport(accessibilityScanResults, reportFileName);
    await ReportHelper.attachToPlaywrightReport(reportFileName, path.join(AXE_REPORT_DIRECTORY, reportFileName));
  }

  private static generateHTMLReport(
    accessibilityScanResults: Awaited<ReturnType<AxeBuilder['analyze']>>,
    reportFileName: string
  ): void {
    createHtmlReport({
      results: accessibilityScanResults,
      options: {
        outputDir: AXE_REPORT_DIRECTORY,
        reportFileName: reportFileName,
      },
    });
  }
}
