import { faker } from '@faker-js/faker';
import { RegisterUserDto } from '../../src/auth/dto/register-user.dto';

export function getRegisterUserData(): RegisterUserDto {
  return {
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    middlename: faker.person.middleName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    dob: faker.date.birthdate({ min: 18, mode: 'age' }).toString(),
    accountType: "saving",
    address: faker.location.streetAddress(),
    mobileNumber: faker.phone.number()
  };
}
