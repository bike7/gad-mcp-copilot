import { faker } from "@faker-js/faker";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
}

export class UserFactory {
  static createTestUser(): User {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      birthDate: faker.date
        .birthdate({ min: 18, max: 65, mode: "age" })
        .toISOString()
        .split("T")[0],
      password: `${faker.string.alphanumeric(8)}A1!`,
    };
  }
}
