import { expect, test } from '../../../src/fixtures/page.fixture';
import { step, suite } from 'allure-js-commons';

// Smoke tests for basic navigation and page load

test.describe('Main Pages Smoke tests', () => {
  test('Should load Home page', async ({ page, homePage }) => {
    await suite('Smoke Tests');
    // Act
    await homePage.goto();
    // Assert
    await step('Verify home page is loaded', async () => {
      await expect(page).toHaveURL(homePage.getExpectedUrl());
      await expect(homePage.getPageHeading()).toBeVisible();
    });
  });

  test('Should load Login page', async ({ page, loginPage }) => {
    await suite('Smoke Tests');
    // Act
    await loginPage.goto();
    // Assert
    await step('Verify login page is loaded', async () => {
      await expect(page).toHaveURL(loginPage.getExpectedUrl());
      await expect(loginPage.getPageHeading()).toBeVisible();
    });
  });

  test('Should load Register page', async ({ page, registerPage }) => {
    await suite('Smoke Tests');
    // Act
    await registerPage.goto();
    // Assert
    await step('Verify register page is loaded', async () => {
      await expect(page).toHaveURL(registerPage.getExpectedUrl());
      await expect(registerPage.getPageHeading()).toBeVisible();
    });
  });
});
