import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

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

  async fillRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    birthDate: string,
    password: string
  ): Promise<this> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.birthDateInput.fill(birthDate);
    await this.page.keyboard.press("Escape");
    await this.passwordInput.fill(password);
    return this;
  }

  async clickRegister(): Promise<this> {
    await this.registerButton.click();
    return this;
  }

  getHeading(): Locator {
    return this.heading;
  }
}
