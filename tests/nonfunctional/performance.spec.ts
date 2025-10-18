import { test } from '../../src/fixtures/page.fixture';
import { LighthouseHelper } from '../../src/helpers/lighthouse.helper';
import { HomePage } from '../../src/pages/home.page';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';

test.describe.configure({ mode: 'serial' });

test.describe('Lighthouse Performance Tests', () => {
  test('Home page should meet performance standards', async ({ page }) => {
    await new HomePage(page).goto();
    await LighthouseHelper.runAudit(page, 'home-page');
  });

  test('Login page should meet performance standards', async ({ page }) => {
    await new LoginPage(page).goto();
    await LighthouseHelper.runAudit(page, 'login-page');
  });

  test('Register page should meet performance standards', async ({ page }) => {
    await new RegisterPage(page).goto();
    await LighthouseHelper.runAudit(page, 'register-page');
  });
});
