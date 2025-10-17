import { test, expect } from "@playwright/test";

test.describe("User Registration and Login", () => {
  const timestamp = Date.now();
  const testUser = {
    firstName: "John",
    lastName: "Doe",
    email: `john.doe.${timestamp}@example.com`,
    birthDate: "1990-01-01",
    password: "SecurePass123!",
  };

  test("should successfully register a new user", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Click on the user profile dropdown button
    await page.getByTestId("btn-dropdown").click();

    // Click on "Register" link
    await page.getByRole("link", { name: "Register" }).click();

    // Verify we're on the registration page
    await expect(page).toHaveURL(/.*register\.html/);
    await expect(page.getByRole("heading", { name: "Register" })).toBeVisible();

    // Fill in the registration form
    await page
      .getByPlaceholder("Enter User First Name")
      .fill(testUser.firstName);
    await page.getByPlaceholder("Enter User Last Name").fill(testUser.lastName);
    await page.getByPlaceholder("Enter User Email").fill(testUser.email);
    await page.getByPlaceholder("Enter Birth Date").fill(testUser.birthDate);

    // Close the datepicker by pressing Escape
    await page.keyboard.press("Escape");

    await page.getByPlaceholder("Enter Password").fill(testUser.password);

    // Select an avatar (keep the default selection)
    // Avatar combobox already has a default selection

    // Click the "Register" button
    await page.getByRole("button", { name: "Register" }).click();

    // Verify successful registration by checking for success alert
    await expect(page.getByRole("alert")).toContainText("User created");
  });

  test("should successfully login with registered user credentials", async ({
    page,
  }) => {
    // First, register the user (prerequisite)
    await page.goto("/");
    await page.getByTestId("btn-dropdown").click();
    await page.getByRole("link", { name: "Register" }).click();
    await page
      .getByPlaceholder("Enter User First Name")
      .fill(testUser.firstName);
    await page.getByPlaceholder("Enter User Last Name").fill(testUser.lastName);
    await page.getByPlaceholder("Enter User Email").fill(testUser.email);
    await page.getByPlaceholder("Enter Birth Date").fill(testUser.birthDate);

    // Close the datepicker by pressing Escape
    await page.keyboard.press("Escape");

    await page.getByPlaceholder("Enter Password").fill(testUser.password);
    await page.getByRole("button", { name: "Register" }).click();

    // Wait for success alert
    await expect(page.getByRole("alert")).toContainText("User created");

    // Navigate to login page
    await page.goto("/login");

    // Verify we're on the login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();

    // Fill in the login form
    await page.getByPlaceholder("Enter User Email").fill(testUser.email);
    await page.getByPlaceholder("Enter Password").fill(testUser.password);

    // Optionally check "Keep me sign in" checkbox
    await page.getByRole("checkbox", { name: /keep me sign in/i }).check();

    // Click the "LogIn" button
    await page.getByRole("button", { name: "LogIn" }).click();

    // Verify successful login
    // Check for redirection to welcome page
    await expect(page).toHaveURL(/.*welcome/, { timeout: 10000 });

    // Additional verification: check if user dropdown shows the user is logged in
    await page.getByTestId("btn-dropdown").click();
    await expect(page.locator("#username")).toContainText(testUser.firstName);
  });
});
