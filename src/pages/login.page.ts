import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { WelcomePage } from "./welcome.page";

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
    email: string,
    password: string,
    keepSignedIn = true
  ): Promise<this> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (keepSignedIn) {
      await this.keepMeSignedInCheckbox.check();
    }
    return this;
  }

  async clickLogin(): Promise<WelcomePage> {
    await this.loginButton.click();
    return new WelcomePage(this.page);
  }

  getHeading(): Locator {
    return this.heading;
  }
}
