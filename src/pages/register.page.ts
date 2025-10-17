import test, { Page, Locator } from "@playwright/test";
import { step } from "allure-js-commons";
import { BasePage } from "./base.page";
import { LoginPage } from "./login.page";
import { User } from "../models/user.model";

export class RegisterPage extends BasePage {
  private readonly heading: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly birthDateInput: Locator;
  private readonly passwordInput: Locator;
  private readonly registerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "/register.html";
    this.expectedUrl = /.*register\.html/;
    this.heading = this.page.getByRole("heading", { name: "Register" });
    this.firstNameInput = this.page.getByPlaceholder("Enter User First Name");
    this.lastNameInput = this.page.getByPlaceholder("Enter User Last Name");
    this.emailInput = this.page.getByPlaceholder("Enter User Email");
    this.birthDateInput = this.page.getByPlaceholder("Enter Birth Date");
    this.passwordInput = this.page.getByPlaceholder("Enter Password");
    this.registerButton = this.page.getByRole("button", { name: "Register" });
  }

  async fillRegistrationForm(testUser: User): Promise<this> {
    return await step("Fill registration form", async () => {
      await this.firstNameInput.fill(testUser.firstName);
      await this.lastNameInput.fill(testUser.lastName);
      await this.emailInput.fill(testUser.email);
      await this.birthDateInput.fill(testUser.birthDate);
      await this.page.keyboard.press("Escape");
      await this.passwordInput.fill(testUser.password);
      return this;
    });
  }

  async clickRegister(): Promise<LoginPage> {
    return await step("Click Register button", async () => {
      await this.registerButton.click();
      return new LoginPage(this.page);
    });
  }

  getHeading(): Locator {
    return this.heading;
  }
}
