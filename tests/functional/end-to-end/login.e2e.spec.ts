import { UserFactory } from '../../../src/factories/user.factory';
import { expect, test } from '../../../src/fixtures/page.fixture';
import { step, suite } from 'allure-js-commons';

test.describe('User Login End-to-End', () => {
  test('Should register and login a new user', async ({ page, homePage }) => {
    await suite('End To End Tests');
    // Arrange
    const expectedAlertText = 'User created';
    const testUser = UserFactory.createTestUser();

    // Act - Registration
    await homePage.goto();
    await homePage.openUserDropdown();
    const registerPage = await homePage.clickRegister();
    await registerPage.fillRegistrationForm(testUser);
    const loginPage = await registerPage.clickRegister();
    // Assert - Registration
    await step('Verify user registration is successful', async () => {
      await expect(registerPage.getAlert()).toContainText(expectedAlertText);
    });
    await step('Verify login page is loaded', async () => {
      await expect(page).toHaveURL(loginPage.getExpectedUrl());
      await expect(loginPage.getPageHeading()).toBeVisible();
    });
    // Act - Login
    await loginPage.fillLoginForm(testUser);
    const welcomePage = await loginPage.clickLogin();

    // Assert - Login
    await step('Verify user is successfully logged in', async () => {
      await expect(page).toHaveURL(welcomePage.getExpectedUrl(), {
        timeout: 10000,
      });
      await welcomePage.openUserDropdown();
      await expect(welcomePage.getUsernameElement()).toContainText(
        testUser.firstName
      );
    });
  });
});
