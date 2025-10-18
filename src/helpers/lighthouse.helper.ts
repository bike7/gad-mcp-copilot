import { DEBUGGING_PORT } from '../../playwright.config';
import { Page } from '@playwright/test';

export interface LighthouseMetrics {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface LighthouseCategory {
  score: number | null;
}

interface PlaywrightLighthouseResult {
  lhr: {
    categories: Record<string, LighthouseCategory>;
  };
}

export class LighthouseHelper {
  static async runAudit(
    page: Page,
    thresholds: LighthouseMetrics
  ): Promise<Partial<LighthouseMetrics>> {
    const { playAudit } = await import('playwright-lighthouse');
    const pageName = LighthouseHelper.extractPageNameFromUrl(page);

    const result = await playAudit({
      page,
      thresholds: {
        performance: thresholds.performance,
        accessibility: thresholds.accessibility,
        'best-practices': thresholds.bestPractices,
        seo: thresholds.seo,
      },
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

    const categories = (result as PlaywrightLighthouseResult).lhr.categories;

    return {
      performance: categories['performance']?.score
        ? categories['performance'].score * 100
        : undefined,
      accessibility: categories['accessibility']?.score
        ? categories['accessibility'].score * 100
        : undefined,
      bestPractices: categories['best-practices']?.score
        ? categories['best-practices'].score * 100
        : undefined,
      seo: categories['seo']?.score ? categories['seo'].score * 100 : undefined,
    };
  }

  private static extractPageNameFromUrl(page: Page): string {
    const url = new URL(page.url());
    const pathname = url.pathname.replace(/\/$/, '');
    const pageName = pathname === '' ? 'home' : pathname.slice(1);
    return pageName;
  }
}
