import { LighthouseHelper } from '../../src/helpers/lighthouse.helper';
import { HomePage } from '../../src/pages/home.page';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Lighthouse Performance Tests', () => {
  //Arrange
  const thresholds = {
    performance: 50,
    accessibility: 50,
    bestPractices: 50,
    seo: 50,
  };

  test('Home page should meet performance standards', async ({ page }) => {
    //Act
    await new HomePage(page).goto();
    const scores = await LighthouseHelper.runAudit(page, thresholds);
    //Assert
    expect
      .soft(scores.performance)
      .toBeGreaterThanOrEqual(thresholds.performance);
    expect
      .soft(scores.accessibility)
      .toBeGreaterThanOrEqual(thresholds.accessibility);
    expect
      .soft(scores.bestPractices)
      .toBeGreaterThanOrEqual(thresholds.bestPractices);
    expect.soft(scores.seo).toBeGreaterThanOrEqual(thresholds.seo);
  });

  test('Login page should meet performance standards', async ({ page }) => {
    //Act
    await new LoginPage(page).goto();
    const scores = await LighthouseHelper.runAudit(page, thresholds);
    //Assert
    expect
      .soft(scores.performance)
      .toBeGreaterThanOrEqual(thresholds.performance);
    expect
      .soft(scores.accessibility)
      .toBeGreaterThanOrEqual(thresholds.accessibility);
    expect
      .soft(scores.bestPractices)
      .toBeGreaterThanOrEqual(thresholds.bestPractices);
    expect.soft(scores.seo).toBeGreaterThanOrEqual(thresholds.seo);
  });

  test('Register page should meet performance standards', async ({ page }) => {
    //Act
    await new RegisterPage(page).goto();
    const scores = await LighthouseHelper.runAudit(page, thresholds);
    //Assert
    expect
      .soft(scores.performance)
      .toBeGreaterThanOrEqual(thresholds.performance);
    expect
      .soft(scores.accessibility)
      .toBeGreaterThanOrEqual(thresholds.accessibility);
    expect
      .soft(scores.bestPractices)
      .toBeGreaterThanOrEqual(thresholds.bestPractices);
    expect.soft(scores.seo).toBeGreaterThanOrEqual(thresholds.seo);
  });
});
