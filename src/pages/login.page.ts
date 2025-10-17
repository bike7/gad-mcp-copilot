import { Page, Locator } from "@playwright/test";
import { step } from "allure-js-commons";
import { BasePage } from "./base.page";
import { WelcomePage } from "./welcome.page";
import { User } from "../models/user.model";

export class LoginPage extends BasePage {
  private readonly heading: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly keepMeSignedInCheckbox: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.url = "/login";
    this.expectedUrl = /.*login/;
    this.heading = this.page.getByRole("heading", { name: "Login" });
    this.emailInput = this.page.getByPlaceholder("Enter User Email");
    this.passwordInput = this.page.getByPlaceholder("Enter Password");
    this.keepMeSignedInCheckbox = this.page.getByRole("checkbox", {
      name: /keep me sign in/i,
    });
    this.loginButton = this.page.getByRole("button", { name: "LogIn" });
  }

  async fillLoginForm(
    testUser: User,
    keepSignedIn = true
  ): Promise<this> {
    return await step("Fill login form", async () => {
      await this.emailInput.fill(testUser.email);
      await this.passwordInput.fill(testUser.password);
      if (keepSignedIn) {
        await this.keepMeSignedInCheckbox.check();
      }
      return this;
    });
  }

  async clickLogin(): Promise<WelcomePage> {
    return await step("Click Login button", async () => {
      await this.loginButton.click();
      return new WelcomePage(this.page);
    });
  }

  getHeading(): Locator {
    return this.heading;
  }
}
