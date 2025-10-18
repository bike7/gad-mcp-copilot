import { UserFactory } from '../../../src/factories/user.factory';
import { expect, test } from '../../../src/fixtures/page.fixture';
import { step, suite } from 'allure-js-commons';

test.describe('User Registration', () => {
  test('Should register a new user', async ({ page, registerPage }) => {
    await suite('Integration Tests');
    // Arrange
    const expectedAlertText = 'User created';
    const testUser = UserFactory.createTestUser();

    // Act
    await registerPage.goto();
    await step('Verify register page is loaded', async () => {
      await expect(page).toHaveURL(registerPage.getExpectedUrl());
      await expect(registerPage.getPageHeading()).toBeVisible();
    });
    await registerPage.fillRegistrationForm(testUser);
    await registerPage.clickRegister();

    // Assert
    await step('Verify registration confirmation alert text', async () => {
      await expect(registerPage.getAlert()).toContainText(expectedAlertText);
    });
  });
});
