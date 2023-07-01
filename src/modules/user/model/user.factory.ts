import { faker } from "@faker-js/faker";
import Factory from "@point-hub/express-factory";
import { CreateManyUserRepository } from "./repository/create-many.repository.js";
import { CreateUserRepository } from "./repository/create.repository.js";
import { RetrieveUserRepository } from "./repository/retrieve.repository.js";
import { UpdateUserRepository } from "./repository/update.repository.js";
import { UserEntityInterface } from "./user.entity.js";
import { db } from "@src/database/database.js";
import { generateRefreshToken, signNewToken } from "@src/utils/jwt.js";

export default class UserFactory extends Factory<UserEntityInterface> {
  async createMany(count: number) {
    const exampleRepository = new CreateManyUserRepository(db);
    return await exampleRepository.handle(this.makeMany(count));
  }
  definition() {
    return {
      username: faker.name.fullName(),
      email: `${faker.name.firstName()}.${faker.name.lastName()}@gmail.com`,
      accountName: faker.name.lastName(),
      photo: "randomhoto.jpg",
      createdAt: new Date(),
    };
  }

  async create() {
    const createUserRepository = new CreateUserRepository(db);
    const updateUserRepository = new UpdateUserRepository(db);
    const retrieveUserRepository = new RetrieveUserRepository(db);
    const user = await createUserRepository.handle(this.makeOne());
    const accessToken = signNewToken(process.env.JWT_ISSUER as string, process.env.JWT_SECRET as string, user._id);
    const refreshToken = generateRefreshToken(
      process.env.JWT_ISSUER as string,
      process.env.JWT_SECRET as string,
      user._id
    );
    await updateUserRepository.handle(user._id, { accessToken, refreshToken });
    const userData = await retrieveUserRepository.handle(user._id);
    return userData;
  }
}
