import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateUserRepository } from "./repository/create.repository.js";
import { UserEntityInterface } from "./user.entity.js";
import { db } from "@src/database/database.js";

export default class UserFactory extends Factory<UserEntityInterface> {
  createMany(count: number): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  definition() {
    return {
      username: faker.name.fullName(),
      email: faker.name.firstName(),
      displayName: faker.name.lastName(),
      createdAt: new Date(),
    };
  }

  async create() {
    const UserRepository = new CreateUserRepository(db);
    return await UserRepository.handle(this.makeOne());
  }
}
