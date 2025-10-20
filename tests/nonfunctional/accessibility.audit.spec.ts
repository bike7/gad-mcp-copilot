import { AxeHelper } from '../../src/helpers/axe.helper';
import { HomePage } from '../../src/pages/home.page';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { expect, test } from '@playwright/test';

test.describe('Accessibility Audit', () => {
  test('Home Page should meet accessibility standards', async ({
    page,
  }) => {
    //Arrange
    const maxAllowedViolations = 20;
    const maxCriticalViolations = 1;
    //Act
    await new HomePage(page).goto();
    const accessibilityScanResults = await AxeHelper.analyzeAccessibility(page);
    await AxeHelper.createAccessibilityReport(page, accessibilityScanResults);
    //Assert
    expect
      .soft(accessibilityScanResults.violations.length)
      .toBeLessThanOrEqual(maxAllowedViolations);
    expect
      .soft(
        accessibilityScanResults.violations.filter(
          (v) => v.impact === 'critical'
        ).length
      )
      .toBeLessThanOrEqual(maxCriticalViolations);
  });

  test('Login Page should meet accessibility standards', async ({
    page,
  }) => {
    //Arrange
    const maxAllowedViolations = 25;
    const maxCriticalViolations = 2;
    //Act
    await new LoginPage(page).goto();
    const accessibilityScanResults = await AxeHelper.analyzeAccessibility(page);
    await AxeHelper.createAccessibilityReport(page, accessibilityScanResults);
    //Assert
    expect
      .soft(accessibilityScanResults.violations.length)
      .toBeLessThanOrEqual(maxAllowedViolations);
    expect
      .soft(
        accessibilityScanResults.violations.filter(
          (v) => v.impact === 'critical'
        ).length
      )
      .toBeLessThanOrEqual(maxCriticalViolations);
  });

  test('Register Page should meet accessibility standards', async ({
    page,
  }) => {
    //Arrange
    const maxAllowedViolations = 25;
    const maxCriticalViolations = 2;
    //Act
    await new RegisterPage(page).goto();
    const accessibilityScanResults = await AxeHelper.analyzeAccessibility(page);
    await AxeHelper.createAccessibilityReport(page, accessibilityScanResults);
    //Assert
    expect
      .soft(accessibilityScanResults.violations.length)
      .toBeLessThanOrEqual(maxAllowedViolations);
    expect
      .soft(
        accessibilityScanResults.violations.filter(
          (v) => v.impact === 'critical'
        ).length
      )
      .toBeLessThanOrEqual(maxCriticalViolations);
  });
});
