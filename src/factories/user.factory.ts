import { faker } from "@faker-js/faker";
import { User } from "../models/user.model";
export class UserFactory {
  static createTestUser(): User {
    const firstName = faker.person.firstName().replace(/[^A-Za-z]/g, "");
    const lastName = faker.person.lastName().replace(/[^A-Za-z]/g, "");
    return {
      firstName,
      lastName,
      email: faker.internet.email(),
      birthDate: faker.date
        .birthdate({ min: 18, max: 65, mode: "age" })
        .toISOString()
        .split("T")[0],
      password: `${faker.string.alphanumeric(8)}A1!`,
    };
  }
}
