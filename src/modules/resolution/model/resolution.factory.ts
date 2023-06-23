import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyUserRepository } from "./repository/create-many.repository.js";
import { CreateUserRepository } from "./repository/create.repository.js";
import { UserEntityInterface } from "./resolution.entity.js";
import { db } from "@src/database/database.js";

export default class UserFactory extends Factory<UserEntityInterface> {
  async createMany(count: number) {
    const exampleRepository = new CreateManyUserRepository(db);
    return await exampleRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      username: faker.name.fullName(),
      email: `${faker.name.firstName()}.${faker.name.lastName()}@gmail.com`,
      displayName: faker.name.lastName(),
      photo: "randomhoto.jpg",
      createdAt: new Date(),
    };
  }

  async create() {
    const UserRepository = new CreateUserRepository(db);
    return await UserRepository.handle(this.makeOne());
  }
}
