import { User } from '../models/user.model';
import { faker } from '@faker-js/faker';

export class UserFactory {
  static createTestUser(): User {
    const firstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
    const lastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
    const email = faker.internet.email();
    const password = `${faker.string.alphanumeric(8)}A1!`;
    const birthDate = faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString()
      .split('T')[0];

    return {
      firstName,
      lastName,
      email,
      birthDate,
      password,
    };
  }
}
