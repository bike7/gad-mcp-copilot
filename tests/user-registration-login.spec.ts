import { test, expect } from "../src/fixtures/page.fixture";
import { UserFactory } from "../src/factories/user.factory";
import { feature, step } from "allure-js-commons";

test.describe("User Registration and Login", () => {
  test("Should successfully register a new user", async ({
    page,
    registerPage,
  }) => {
    // Arrange
    const expectedAlertText = "User created";
    const testUser = UserFactory.createTestUser();

    // Act
    await registerPage.goto();
    await step("Verify register page is loaded", async () => {
      await expect(page).toHaveURL(registerPage.getExpectedUrl());
      await expect(registerPage.getHeading()).toBeVisible();
    });
    await registerPage.fillRegistrationForm(testUser);
    await registerPage.clickRegister();

    // Assert
    await step("Verify registration confirmation alert text", async () => {
      await expect(registerPage.getAlert()).toContainText(expectedAlertText);
    });
  });

  test("Should successfully register and login a new user", async ({
    page,
    homePage,
  }) => {
    // Arrange
    const expectedAlertText = "User created";
    const testUser = UserFactory.createTestUser();

    // Act - Registration
    await homePage.goto();
    await homePage.openUserDropdown();
    const registerPage = await homePage.clickRegister();
    await registerPage.fillRegistrationForm(testUser);
    const loginPage = await registerPage.clickRegister();
    // Assert - Registration
    await step("Verify user registration is successful", async () => {
      await expect(registerPage.getAlert()).toContainText(expectedAlertText);
    });
    await step("Verify login page is loaded", async () => {
      await expect(page).toHaveURL(loginPage.getExpectedUrl());
      await expect(loginPage.getHeading()).toBeVisible();
    });
    // Act - Login
    await loginPage.fillLoginForm(testUser);
    const welcomePage = await loginPage.clickLogin();

    // Assert - Login
    await step("Verify user is successfully logged in", async () => {
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
