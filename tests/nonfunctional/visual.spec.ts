import { expect, test } from '../../src/fixtures/page.fixture';
import { HomePage } from '../../src/pages/home.page';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';

test.describe('Visual tests', () => {
  test('Home Page visual tests', async ({ page }) => {
    // Arrange
    await new HomePage(page).goto();
    // Act & Assert
    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test('Login Page visual tests', async ({ page }) => {
    // Arrange
    await new LoginPage(page).goto();
    const loginForm = page.locator('form');
    // Act & Assert
    await expect(loginForm).toHaveScreenshot();
  });

  test('Register Page visual tests (masking)', async ({ page }) => {
    // Arrange
    await new RegisterPage(page).goto();
    const registerForm = page.locator('form#registerForm');
    const userAvatarImage = page.locator('img#userPicture');
    const userAvatarSelect = page.locator('select#avatar');
    // Act & Assert
    await expect(registerForm).toHaveScreenshot({
      mask: [userAvatarImage, userAvatarSelect],
    });
  });

  test('Register Page visual tests (mocking)', async ({ page }) => {
    // Arrange
    const mockedImage = ['_default.png'];
    await page.route('/api/images/user', async (route) => {
      await route.fulfill({ json: mockedImage });
    });
    // Act
    await new RegisterPage(page).goto();
    const registerForm = page.locator('form#registerForm');
    // Assert
    await expect(registerForm).toHaveScreenshot();
  });
});
