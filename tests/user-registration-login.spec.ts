import { test, expect } from "../src/fixtures/page.fixture";
import { faker } from "@faker-js/faker";

test.describe("User Registration and Login", () => {
  const testUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    birthDate: faker.date
      .birthdate({ min: 18, max: 65, mode: "age" })
      .toISOString()
      .split("T")[0],
    password: `${faker.string.alphanumeric(8)}A1!`,
  };

  test("should successfully register a new user", async ({
    page,
    homePage,
  }) => {
    // Arrange
    const expectedAlertText = "User created";
    const registerPage = await homePage
      .goto()
      .then((home) => home.openUserDropdown())
      .then((home) => home.clickRegister());

    await expect(page).toHaveURL(registerPage.getExpectedUrl());
    await expect(registerPage.getHeading()).toBeVisible();

    // Act
    await registerPage
      .fillRegistrationForm(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.birthDate,
        testUser.password
      )
      .then((register) => register.clickRegister());

    // Assert
    await expect(registerPage.getAlert()).toContainText(expectedAlertText);
  });

  test("should successfully login with registered user credentials", async ({
    page,
    homePage,
    loginPage,
  }) => {
    // Arrange
    const expectedAlertText = "User created";
    const registerPage = await homePage
      .goto()
      .then((home) => home.openUserDropdown())
      .then((home) => home.clickRegister());

    await registerPage
      .fillRegistrationForm(
        testUser.firstName,
        testUser.lastName,
        testUser.email,
        testUser.birthDate,
        testUser.password
      )
      .then((register) => register.clickRegister());

    await expect(registerPage.getAlert()).toContainText(expectedAlertText);

    await loginPage.goto();
    await expect(page).toHaveURL(loginPage.getExpectedUrl());
    await expect(loginPage.getHeading()).toBeVisible();

    // Act
    const welcomePage = await loginPage
      .fillLoginForm(testUser.email, testUser.password)
      .then((login) => login.clickLogin());

    // Assert
    await expect(page).toHaveURL(welcomePage.getExpectedUrl(), {
      timeout: 10000,
    });
    await welcomePage.openUserDropdown();
    await expect(welcomePage.getUsernameElement()).toContainText(
      testUser.firstName
    );
  });
});
